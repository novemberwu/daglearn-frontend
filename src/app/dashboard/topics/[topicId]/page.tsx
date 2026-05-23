'use client';

export const dynamic = 'force-dynamic';

import { use, useEffect, useState } from 'react';
import { MOCK_TOPICS } from '@/lib/mock-data';
import { McqDto, AttemptResult } from '@/types';
import McqCard from '@/components/McqCard';
import { ChevronLeft, GraduationCap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useSession } from 'next-auth/react';

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default function TopicModulePage({ params }: PageProps) {
  const { data: session, status } = useSession();
  const { topicId } = use(params);
  const [mcqs, setMcqs] = useState<McqDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const topic = MOCK_TOPICS.find(t => t.id === topicId) || MOCK_TOPICS[1]; // Default to Linked Lists
  
  useEffect(() => {
    async function loadMcqs() {
      if (status !== 'authenticated' || !session) return;
      try {
        const data = await apiService.getMcqsByTopic(topicId, session.accessToken);
        setMcqs(data);
      } catch (error) {
        console.error("Failed to load MCQs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (status === 'authenticated') {
      loadMcqs();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [topicId, session, status]);

  const handleResult = (result: AttemptResult) => {
    console.log(`Submission result for ${result.conceptId}:`, result);
  };

  if (status === 'unauthenticated') {
    return <div className="text-center py-12 text-red-600">Please sign in to view this module.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/explore" className="flex items-center text-indigo-600 hover:underline mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Topics
      </Link>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-serif">{topic.title}</h1>
          <p className="text-gray-600">{topic.description}</p>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-semibold border-b pb-2">Proficiency Test</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : mcqs.length > 0 ? (
          mcqs.map((mcq) => (
            <McqCard 
              key={mcq.id} 
              mcq={mcq} 
              userId={session?.user?.id || ""} 
              token={session?.accessToken}
              onResult={handleResult} 
            />
          ))
        ) : (
          <p className="text-gray-500 italic py-8">No questions available for this topic yet.</p>
        )}
      </div>
    </div>
  );
}
