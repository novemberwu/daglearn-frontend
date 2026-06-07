'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { McqDto, AttemptResult, Concept, Document, Topic } from '@/types';
import McqCard from '@/components/McqCard';
import FormattedText from '@/components/FormattedText';
import { ChevronLeft, ChevronRight, GraduationCap, Loader2, Menu, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default function TopicModulePage({ params }: PageProps) {
  const { data: session, status } = useSession();
  const { topicId } = React.use(params);

  // Layout states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data states
  const [topic, setTopic] = useState<Topic | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [mcqs, setMcqs] = useState<McqDto[]>([]);

  // Loading states
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Load topic and its concepts on mount or topicId change
  useEffect(() => {
    async function loadTopicAndConcepts() {
      if (status !== 'authenticated' || !session) return;
      setIsLoadingConcepts(true);
      setError(null);
      try {
        // Fetch topic details (try unlocked topics first, fallback to all topics)
        let foundTopic: Topic | undefined;
        try {
          const unlocked = await apiService.getUnlockedTopics(session.user.id, session.accessToken);
          foundTopic = unlocked.find(t => t.id === topicId);
        } catch (e) {
          console.error("Failed to fetch unlocked topics:", e);
        }

        if (!foundTopic) {
          try {
            const allTopics = await apiService.getTopics(session.accessToken);
            foundTopic = allTopics.find(t => t.id === topicId);
          } catch (e) {
            console.error("Failed to fetch all topics:", e);
          }
        }

        if (foundTopic) {
          setTopic(foundTopic);
        } else {
          // Robust fallback to avoid empty screens
          setTopic({
            id: topicId,
            title: 'Topic Details',
            description: 'Topic resource hub',
            requiredProficiencyScore: 80,
            prerequisites: []
          });
        }

        // Fetch concepts under the topic
        const conceptsData = await apiService.getConceptsByTopic(topicId, session.accessToken);
        setConcepts(conceptsData);
        if (conceptsData.length > 0) {
          setSelectedConceptId(conceptsData[0].id);
        }
      } catch (err) {
        console.error("Failed to load topic or concepts:", err);
        setError("Failed to load topic details or concepts. Please try again later.");
      } finally {
        setIsLoadingConcepts(false);
      }
    }

    if (status === 'authenticated') {
      loadTopicAndConcepts();
    } else if (status === 'unauthenticated') {
      const timer = setTimeout(() => {
        setIsLoadingConcepts(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [topicId, session, status]);

  // Step 2: Load documents & MCQs parallelly when selectedConceptId changes
  useEffect(() => {
    async function loadConceptContent() {
      if (status !== 'authenticated' || !session || !selectedConceptId) return;
      setIsLoadingContent(true);
      try {
        const [docsData, mcqsData] = await Promise.all([
          apiService.getDocumentsByConcept(selectedConceptId, session.accessToken),
          apiService.getMcqsByConcept(selectedConceptId, session.accessToken)
        ]);
        setDocuments(docsData);
        setMcqs(mcqsData);
      } catch (err) {
        console.error("Failed to load concept content:", err);
      } finally {
        setIsLoadingContent(false);
      }
    }

    loadConceptContent();
  }, [selectedConceptId, session, status]);

  const handleResult = (result: AttemptResult) => {
    console.log(`Submission result for ${result.conceptId}:`, result);
  };

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 text-red-600 font-medium">
        Please sign in to view this module.
      </div>
    );
  }

  if (status === 'loading' || isLoadingConcepts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading concepts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 max-w-4xl mx-auto">
        {error}
      </div>
    );
  }

  const selectedConcept = concepts.find(c => c.id === selectedConceptId);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <Link href="/dashboard/explore" className="inline-flex items-center text-indigo-600 hover:underline mb-6 font-semibold gap-1 text-sm">
        <ChevronLeft className="w-4 h-4" /> Back to Topics
      </Link>
      
      {/* Topic header */}
      {topic && (
        <div className="flex items-center gap-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="bg-indigo-600 p-3.5 rounded-xl text-white shadow-sm shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-serif text-gray-900">{topic.title}</h1>
            <p className="text-gray-600 mt-1">{topic.description}</p>
          </div>
        </div>
      )}

      {/* Main split interactive layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Concept Navigation Sidebar */}
        <div
          className={cn(
            "w-full shrink-0 transition-all duration-300 ease-in-out md:sticky md:top-6 bg-white border border-gray-200 rounded-xl p-5 shadow-xs",
            isSidebarOpen ? "md:w-64 opacity-100 block" : "md:w-0 opacity-0 overflow-hidden hidden md:block"
          )}
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Concepts
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors hidden md:block"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {concepts.length === 0 ? (
            <p className="text-gray-400 italic text-sm py-4">No concepts available.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {concepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConceptId(concept.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-between gap-2",
                    selectedConceptId === concept.id
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200"
                      : "bg-white border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="truncate">{concept.name}</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 shrink-0 transition-transform",
                    selectedConceptId === concept.id ? "text-indigo-600 translate-x-0.5" : "text-gray-400"
                  )} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right workspace */}
        <div className="flex-grow min-w-0 w-full">
          {/* Sidebar Toggle Trigger (displayed when sidebar is collapsed) */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-sm font-semibold transition-colors mb-6 shadow-2xs"
            >
              <Menu className="w-4 h-4" />
              <span>Show Concepts</span>
            </button>
          )}

          {isLoadingContent ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-2xl shadow-2xs">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
              <p className="text-gray-500 font-semibold text-sm">Loading concept details...</p>
            </div>
          ) : selectedConceptId ? (
            <div className="space-y-10">
              {/* Active Concept Header */}
              <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Active Concept</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedConcept?.name}</h2>
                {selectedConcept?.description && (
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{selectedConcept.description}</p>
                )}
              </div>

              {/* Documents Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" /> Concept Reading
                </h3>
                {documents.length > 0 ? (
                  <div className="space-y-6">
                    {documents.map((doc) => (
                      <div key={doc.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs">
                        {doc.title && <h4 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-50 pb-2">{doc.title}</h4>}
                        <FormattedText text={doc.content} className="text-gray-800 leading-relaxed text-base prose prose-indigo max-w-none" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic py-6 bg-gray-50 rounded-xl px-6 text-sm border border-gray-100">
                    No reading materials available for this concept.
                  </p>
                )}
              </div>

              {/* MCQs Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-500" /> Practice & Reinforce
                </h3>
                {mcqs.length > 0 ? (
                  <div className="space-y-6">
                    {mcqs.map((mcq) => (
                      <McqCard
                        key={mcq.id}
                        mcq={mcq}
                        userId={session?.user?.id || ""}
                        token={session?.accessToken}
                        onResult={handleResult}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic py-6 bg-gray-50 rounded-xl px-6 text-sm border border-gray-100">
                    No practice questions available for this concept.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">Select a concept</h3>
              <p className="text-gray-500 text-sm mt-1">Pick a concept from the side menu to view documents and questions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}