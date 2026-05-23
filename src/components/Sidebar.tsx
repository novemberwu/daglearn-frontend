'use client';

import Link from 'next/link';
import { LayoutDashboard, BookOpen, BarChart3, GraduationCap, LogIn, LogOut, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signIn, signOut } from 'next-auth/react';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Explore Topics', href: '/dashboard/explore', icon: BookOpen },
  { name: 'Knowledge Map', href: '/dashboard/map', icon: Map },
  { name: 'My Progress', href: '/dashboard/progress', icon: BarChart3 },
];

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-50 border-r">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-indigo-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40 flex items-center gap-2">
          <GraduationCap className="w-10 h-10" />
          <span className="text-xl font-bold">NEXTLearn</span>
        </div>
      </Link>
      <div className="flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 mt-4">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
        
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        
        {session ? (
          <button 
            onClick={() => signOut()}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-50 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LogOut className="w-6" />
            <p className="hidden md:block">Sign Out ({session.user?.name || 'User'})</p>
          </button>
        ) : (
          <button 
            onClick={() => signIn()}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LogIn className="w-6" />
            <p className="hidden md:block">Sign In</p>
          </button>
        )}
      </div>
    </div>
  );
}
