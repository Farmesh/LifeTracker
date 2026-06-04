'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoalStore } from '@/lib/stores/goalStore';
import { useHabitStore } from '@/lib/stores/habitStore';
import { useStudyStore } from '@/lib/stores/studyStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDateRange } from '@/lib/utils/dates';

export default function AnalyticsPage() {
  const goals = useGoalStore((state) => state.goals);
  const habits = useHabitStore((state) => state.habits);
  const { getTotalHours } = useStudyStore();

  const weekRange = getDateRange(7);
  // Daily completion data
  const completionData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const completedGoals = goals.filter(
      (g) => g.isCompleted && new Date(g.completedAt || '').toISOString().split('T')[0] === dateStr
    ).length;
    
    const completedHabits = habits.filter((h) => 
      h.entries.some((e) => e.date === dateStr && e.completed)
    ).length;

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      goals: completedGoals,
      habits: completedHabits,
      total: completedGoals + completedHabits,
    };
  });

  // Habit consistency data
  const habitConsistency = habits.map((habit) => ({
    name: habit.name.substring(0, 10),
    streak: habit.currentStreak,
    best: habit.longestStreak,
  }));

  const goalCompletionRate = goals.length > 0 
    ? Math.round((goals.filter((g) => g.isCompleted).length / goals.length) * 100)
    : 0;

  const habitCompletionRate = habits.length > 0
    ? Math.round(
        (habits.filter((h) => {
          const todayEntry = h.entries.find((e) => e.date === new Date().toISOString().split('T')[0]);
          return todayEntry?.completed;
        }).length / habits.length) * 100
      )
    : 0;

  const studyHours = getTotalHours(weekRange.start, weekRange.end);

  return (
    <>
      <PageHeader
        title="Analytics & Insights"
        icon="📈"
        description="Track your progress and identify patterns"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardDescription>Goal Completion</CardDescription>
            <CardTitle className="text-3xl">{goalCompletionRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Habit Completion</CardDescription>
            <CardTitle className="text-3xl">{habitCompletionRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>This Week&apos;s Study</CardDescription>
            <CardTitle className="text-3xl">{studyHours.toFixed(1)}h</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Streaks</CardDescription>
            <CardTitle className="text-3xl">
              {habits.filter((h) => h.currentStreak > 0).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Completion */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <CardDescription>Completed goals and habits</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
                <Legend />
                <Bar dataKey="goals" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="habits" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Habit Streaks */}
        {habitConsistency.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Habit Streaks</CardTitle>
              <CardDescription>Current vs best streaks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={habitConsistency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  <Bar dataKey="streak" name="Current" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="best" name="Best" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
          <CardDescription>Your accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm font-medium text-gray-900">Goals Created</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">✓</div>
              <p className="text-sm font-medium text-gray-900">Habits Tracked</p>
              <p className="text-2xl font-bold text-gray-900">{habits.length}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-sm font-medium text-gray-900">Longest Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...habits.map((h) => h.longestStreak), 0)}
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm font-medium text-gray-900">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {goals.filter((g) => g.isCompleted).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
