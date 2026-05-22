'use client';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Topic } from '@/types';
import Link from 'next/link';
import { ArrowRight, BookOpen, Lock } from 'lucide-react';

export default function ExplorePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded user for MVP
  const userId = 'user-1';

  useEffect(() => {
    const fetchUnlockedTopics = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUnlockedTopics(userId);
        setTopics(data);
      } catch (err) {
        setError('Failed to load unlocked topics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnlockedTopics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
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
      <h1 className="text-2xl font-bold mb-6 font-serif">Explore Topics</h1>
      
      {topics.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-xl text-center">
          <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-amber-800 mb-2">No Topics Unlocked Yet</h2>
          <p className="text-amber-700">
            Complete prerequisite topics to unlock more advanced material.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">{topic.title}</h2>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{topic.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">
                  Threshold: {topic.requiredProficiencyScore}%
                </span>
                <Link 
                  href={`/dashboard/topics/${topic.id}`}
                  className="flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:underline"
                >
                  Learn <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

