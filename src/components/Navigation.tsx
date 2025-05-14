'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Users } from 'lucide-react';
import { cn } from '#lib/utils';
import Calendar from '#app/[locale]/diary/components/Calendar';

interface NavigationProps {
  entries?: {
    id: string;
    date: Date;
  }[];
}

const navigation = [
  {
    name: 'Diary',
    href: '/diary',
    icon: BookOpen,
  },
  {
    name: 'People',
    href: '/people',
    icon: Users,
  },
];

export default function Navigation({ entries }: NavigationProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Life Tracker
              </Link>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? 'text-gray-500'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            {entries && (
              <div className="px-4 pb-4">
                <Calendar entries={entries} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="fixed inset-x-0 bottom-0 z-10 bg-white border-t border-gray-200">
          <nav className="flex justify-around">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-900',
                    'flex flex-col items-center px-3 py-2 text-sm font-medium'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-blue-600' : 'text-gray-400',
                      'h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  <span className="mt-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
