'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface CalendarProps {
  entries: {
    id: string;
    date: Date;
  }[];
}

export default function Calendar({ entries }: CalendarProps) {
  const t = useTranslations();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const hasEntry = (date: Date) => {
    return entries.some((entry) => isSameDay(new Date(entry.date), date));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title={t('calendar.previousMonth')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title={t('calendar.nextMonth')}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const entry = entries.find((e) => isSameDay(new Date(e.date), day));
          return (
            <div
              key={day.toString()}
              className={`
                relative aspect-square p-2 text-center rounded-lg min-w-0
                ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : ''}
                ${isToday(day) ? 'bg-blue-50' : ''}
                ${hasEntry(day) ? 'hover:bg-blue-100 cursor-pointer' : ''}
              `}
            >
              {entry ? (
                <Link
                  href={`/diary/${entry.id}`}
                  className="block h-full w-full flex items-center justify-center"
                  title={format(day, 'MMMM d, yyyy')}
                >
                  <span className="relative">
                    {format(day, 'd')}
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  </span>
                </Link>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  {format(day, 'd')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
