'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/common/page-header';
import { ProgressRing } from '@/components/common/progress-ring';
import { StatCard } from '@/components/common/stat-card';
import { Card, CardContent } from '@/components/ui/card';
import { useGoalStore } from '@/lib/stores/goalStore';
import { useHabitStore } from '@/lib/stores/habitStore';
import { useJournalStore } from '@/lib/stores/journalStore';
import { useStudyStore } from '@/lib/stores/studyStore';
import { getToday, formatDate } from '@/lib/utils/dates';

export default function Dashboard() {
  const goals = useGoalStore((state) => state.getTodayGoals());
  const habits = useHabitStore((state) => state.habits);
  const journalEntries = useJournalStore((state) => state.getEntriesByDate(getToday()));
  const studySessions = useStudyStore((state) => state.getSessionsByDate(getToday()));

  const todayDate = new Date();
  const greeting = todayDate.getHours() < 12 ? 'Good Morning' : todayDate.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';
  
  const quotes = [
    'The only way to do great work is to love what you do.',
    'Progress is progress, no matter how small.',
    'Every expert was once a beginner.',
    'Your future self will thank you for the work you do today.',
    'Small daily improvements lead to extraordinary results.',
  ];
  
  const dayOfYear = Math.floor(
    (Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()) -
      Date.UTC(todayDate.getFullYear(), 0, 0)) /
      86_400_000
  );
  const dailyQuote = quotes[dayOfYear % quotes.length];

  const completedGoals = goals.filter((g) => g.isCompleted).length;
  const completedHabits = habits.filter((h) => {
    const todayEntry = h.entries.find((e) => e.date === getToday());
    return todayEntry?.completed;
  }).length;

  const todayProgress = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <>
      <PageHeader
        title={`${greeting}! 👋`}
        description={formatDate(todayDate)}
      />

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <blockquote className="text-lg italic text-gray-700">
              &ldquo;{dailyQuote}&rdquo;
            </blockquote>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Progress Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <ProgressRing
                percentage={todayProgress}
                label={`${completedGoals}/${goals.length} Goals`}
                subLabel="Today's Completion"
              />
            </div>
          </Card>
        </motion.div>

        {/* Today's Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon="🎯"
            label="Goals"
            value={completedGoals}
            subLabel={`${goals.length} total today`}
            trend={completedGoals > 0 ? 'up' : 'stable'}
          />
          <StatCard
            icon="✓"
            label="Habits"
            value={completedHabits}
            subLabel={`${habits.length} tracked`}
          />
          <StatCard
            icon="📚"
            label="Study Hours"
            value={studySessions.reduce((acc, s) => acc + s.duration, 0) / 60}
            subLabel={`${studySessions.length} sessions`}
          />
          <StatCard
            icon="📝"
            label="Entries"
            value={journalEntries.length}
            subLabel="Today's journals"
          />
        </div>
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { href: '/goals', icon: '🎯', label: 'Goals', color: 'bg-blue-50 hover:bg-blue-100' },
          { href: '/habits', icon: '✓', label: 'Habits', color: 'bg-green-50 hover:bg-green-100' },
          { href: '/journal', icon: '📝', label: 'Journal', color: 'bg-purple-50 hover:bg-purple-100' },
          { href: '/study', icon: '📚', label: 'Study', color: 'bg-yellow-50 hover:bg-yellow-100' },
        ].map((link) => (
          <a key={link.href} href={link.href}>
            <button className={`w-full p-4 rounded-lg ${link.color} transition-colors text-center`}>
              <div className="text-2xl mb-2">{link.icon}</div>
              <div className="text-sm font-medium text-gray-900">{link.label}</div>
            </button>
          </a>
        ))}
      </motion.div>
    </>
  );
}
