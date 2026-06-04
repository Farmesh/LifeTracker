'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useHabitStore } from '@/lib/stores/habitStore';
import { getToday } from '@/lib/utils/dates';

export default function HabitsPage() {
  const { habits, addHabit, checkHabit, deleteHabit } = useHabitStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  // const [form, setForm] = React.useState({
  //   name: '',
  //   description: '',
  //   category: 'Health',
  //   color: '#10b981',
  //   frequency: 'daily' as const,
  // });


  const [form, setForm] = useState({
  name: '',
  description: '',
  category: '',
  color: '',
  frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
});
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      return;
    }

    addHabit({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      category: form.category.trim() || 'General',
      color: form.color,
      frequency: form.frequency,
      createdAt: new Date().toISOString(),
      entries: [],
      currentStreak: 0,
      longestStreak: 0,
    });

    setForm({
      name: '',
      description: '',
      category: 'Health',
      color: '#10b981',
      frequency: 'daily',
    });
    setIsFormOpen(false);
  };

  const habitsByCategory = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) acc[habit.category] = [];
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, typeof habits>);

  return (
    <>
      <PageHeader
        title="Habits"
        icon="✓"
        description="Build consistency with daily habits"
	        action={
	          <Button onClick={() => setIsFormOpen((open) => !open)} className="bg-blue-600 hover:bg-blue-700">
	            + New Habit
	          </Button>
	        }
	      />

      {isFormOpen && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Habit</CardTitle>
            <CardDescription>Track a repeatable behavior.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Habit name"
                required
              />
              <Input
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                placeholder="Category"
              />
              <select
                value={form.frequency}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    frequency: event.target.value as 'daily' | 'weekly' | 'monthly',
                  }))
                }
                className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <Input
                type="color"
                value={form.color}
                onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                className="px-2"
              />
              <Textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                className="md:col-span-2"
              />
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit">Save Habit</Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8">
        {Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
              {category}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryHabits.map((habit) => {
                const todayEntry = habit.entries.find((e) => e.date === getToday());
                const isCompletedToday = todayEntry?.completed ?? false;

                return (
                  <Card
                    key={habit.id}
                    className={`transition-all ${
                      isCompletedToday ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{habit.name}</CardTitle>
                          {habit.description && (
                            <CardDescription>{habit.description}</CardDescription>
                          )}
                        </div>
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Streaks */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Current Streak</p>
                          <p className="text-2xl font-bold text-orange-600">
                            🔥 {habit.currentStreak}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Best Streak</p>
                          <p className="text-2xl font-bold text-green-600">
                            🏆 {habit.longestStreak}
                          </p>
                        </div>
                      </div>

                      {/* Check Button */}
                      <Button
                        onClick={() => checkHabit(habit.id, getToday())}
                        className={`w-full ${
                          isCompletedToday
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }`}
                      >
	                        {isCompletedToday ? 'Completed Today' : 'Mark Complete'}
	                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteHabit(habit.id)}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {habits.length === 0 && (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
	              <p className="text-gray-500 mb-3">No habits yet. Start building consistency!</p>
	              <Button variant="outline" onClick={() => setIsFormOpen(true)}>Create your first habit</Button>
	            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
