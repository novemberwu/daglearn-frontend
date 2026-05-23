'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/progress';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('next-learn', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg mb-4">
          <GraduationCap className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">Welcome to NEXTLearn</h2>
        <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
              placeholder="rachel@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" title="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-70 transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </form>

      <div className="text-center text-sm">
        <p className="text-gray-500 italic">
          Default credentials: rachel@example.com / password
        </p>
        <div className="mt-4">
          <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            Return to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
