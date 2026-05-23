import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-indigo-600 p-4 md:h-52">
        <div className="text-white text-3xl font-bold flex items-center gap-2">
          <GraduationCap className="w-10 h-10 md:w-16 md:h-16" />
          NEXTLearn
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal font-serif`}>
            <strong>Master New Skills.</strong> Explore the knowledge and unlock your potential with our adaptive learning platform.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 md:text-base"
          >
            <span>Start Learning</span> <ArrowRight className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <div className="w-full aspect-video bg-indigo-100 rounded-xl shadow-lg border-2 border-indigo-200 flex items-center justify-center text-indigo-400 font-medium italic">
             [Dashboard Screenshot Placeholder]
          </div>
        </div>
      </div>
    </main>
  );
}
