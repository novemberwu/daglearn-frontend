'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Topic } from '@/types';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import { Loader2, Map as MapIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function KnowledgeMapPage() {
  const { data: session, status } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopics() {
      if (status !== 'authenticated' || !session) return;
      try {
        setIsLoading(true);
        const data = await apiService.getTopics(session.accessToken);
        setTopics(data);
      } catch (err) {
        console.error('Failed to load topics:', err);
        setError('Could not load the knowledge graph. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      loadTopics();
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
      <div className="flex items-center gap-3 mb-6">
        <MapIcon className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold font-serif">AP CSA Learning Path</h1>
      </div>

      <p className="text-gray-600 mb-8">
        This interactive map shows the prerequisites for each topic in the AP Computer Science A curriculum. 
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
