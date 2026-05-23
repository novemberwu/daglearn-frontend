'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { ConceptProficiency, Course } from '@/types';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Award, Loader2 } from 'lucide-react';

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const [proficiencies, setProficiencies] = useState<ConceptProficiency[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated' || !session) {
        if (status === 'unauthenticated') {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const [profData, courseData] = await Promise.all([
          apiService.getConceptProficiencies(session.user.id, session.accessToken),
          apiService.getCourseById('AP-CSA', session.accessToken)
        ]);
        setProficiencies(profData);
        setCourse(courseData);
      } catch (err) {
        setError('Failed to load progress. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-serif">My Learning Progress</h1>
        {course && (
          <p className="text-indigo-600 font-medium text-sm mt-1">Course: {course.name}</p>
        )}
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 flex items-center gap-6">
        <div className="bg-indigo-600 p-4 rounded-full text-white">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-indigo-900">Keep it up, {session?.user?.name || 'Student'}!</h2>
          <p className="text-indigo-700">You&apos;re making steady progress across {proficiencies.length} concepts.</p>
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
