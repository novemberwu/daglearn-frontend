'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Topic, Course } from '@/types';
import Link from 'next/link';
import { ArrowRight, BookOpen, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated' || !session) return;
      
      try {
        setLoading(true);
        // Using session.user.id which maps to our Neo4j user ID
        const [unlockedTopics, courseData] = await Promise.all([
          apiService.getUnlockedTopics(session.user.id, session.accessToken),
          apiService.getCourseById('AP-CSA', session.accessToken)
        ]);
        setTopics(unlockedTopics);
        setCourse(courseData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    } else if (status === 'unauthenticated') {
      setLoading(false);
      setError('Please sign in to view unlocked topics.');
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-serif">Explore Topics</h1>
        {course && (
          <p className="text-indigo-600 font-medium text-sm mt-1">Course: {course.name}</p>
        )}
      </div>
      
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
