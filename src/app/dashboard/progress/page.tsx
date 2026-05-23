'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { ConceptProficiency } from '@/types';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { BarChart3, Award, Loader2 } from 'lucide-react';

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const [proficiencies, setProficiencies] = useState<ConceptProficiency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProficiencies = async () => {
      if (status !== 'authenticated' || !session) return;

      try {
        setLoading(true);
        const data = await apiService.getConceptProficiencies(session.user.id, session.accessToken);
        setProficiencies(data);
      } catch (err) {
        setError('Failed to load progress. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchProficiencies();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-12 text-red-600">Please sign in to view your progress.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-serif">My Learning Progress</h1>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 flex items-center gap-6">
        <div className="bg-indigo-600 p-4 rounded-full text-white">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-indigo-900">Keep it up, {session?.user?.name || 'Student'}!</h2>
          <p className="text-indigo-700">You're making steady progress across {proficiencies.length} concepts.</p>
        </div>
      </div>

      {proficiencies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 italic">No progress data available yet. Start a topic to see your stats!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {proficiencies.map((item) => (
            <div key={item.conceptId} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">{item.conceptName}</h3>
                <span className={cn(
                  "text-sm font-bold px-2 py-1 rounded",
                  item.percentage >= 90 ? "text-blue-900 bg-blue-100" :
                  item.percentage >= 60 ? "text-blue-700 bg-blue-50" : "text-blue-400 bg-blue-50/50"
                )}>
                  {item.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-500",
                    item.percentage >= 90 ? "bg-blue-800" :
                    item.percentage >= 60 ? "bg-blue-500" : "bg-blue-200"
                  )} 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
