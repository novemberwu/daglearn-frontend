import Link from 'next/link';
import { LayoutDashboard, BookOpen, BarChart3, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Explore Topics', href: '/dashboard/explore', icon: BookOpen },
  { name: 'My Progress', href: '/dashboard/progress', icon: BarChart3 },
];

export default function Sidebar() {
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
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
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
      </div>
    </div>
  );
}
