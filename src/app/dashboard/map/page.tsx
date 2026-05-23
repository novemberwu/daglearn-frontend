'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Topic, Course } from '@/types';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import { Loader2, Map as MapIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function KnowledgeMapPage() {
  const { data: session, status } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (status !== 'authenticated' || !session) return;
      try {
        setIsLoading(true);
        const [topicData, courseData] = await Promise.all([
          apiService.getTopics(session.accessToken),
          apiService.getCourseById('AP-CSA', session.accessToken)
        ]);
        setTopics(topicData);
        setCourse(courseData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Could not load the knowledge graph. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      loadData();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [session, status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-12 text-red-600">Please sign in to view the knowledge map.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <MapIcon className="w-5 h-5 text-indigo-600" />
        <h1 className="text-2xl font-bold font-serif">Learning Path</h1>
      </div>
      {course && (
        <p className="text-indigo-600 font-medium text-sm mb-4 ml-8">Course: {course.name}</p>
      )}

      <p className="text-gray-600 mb-8">
        This interactive map shows the prerequisites for each topic in the curriculum. 
        Follow the arrows to see your path to mastery.
      </p>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      ) : (
        <div className="flex-grow">
          <KnowledgeGraph topics={topics} />
        </div>
      )}
    </div>
  );
}
