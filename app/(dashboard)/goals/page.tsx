'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useGoalStore, type GoalType } from '@/lib/stores/goalStore';
import { formatDate, getToday } from '@/lib/utils/dates';

const goalTypes: { type: GoalType; label: string; icon: string }[] = [
  { type: 'daily', label: 'Daily', icon: '📅' },
  { type: 'weekly', label: 'Weekly', icon: '📊' },
  { type: 'monthly', label: 'Monthly', icon: '📈' },
  { type: 'yearly', label: 'Yearly', icon: '🎯' },
];

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoalStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: '',
    description: '',
    type: 'daily' as GoalType,
    targetValue: '1',
    currentValue: '0',
    unit: 'times',
    dueDate: getToday(),
    category: 'Personal',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    const targetValue = Math.max(Number(form.targetValue) || 1, 1);
    const currentValue = Math.max(Number(form.currentValue) || 0, 0);
    const isCompleted = currentValue >= targetValue;

    addGoal({
      id: crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
      targetValue,
      currentValue,
      unit: form.unit.trim() || 'times',
      dueDate: form.dueDate,
      category: form.category.trim() || 'Personal',
      createdAt: new Date().toISOString(),
      completedAt: isCompleted ? new Date().toISOString() : undefined,
      isCompleted,
    });

    setForm({
      title: '',
      description: '',
      type: 'daily',
      targetValue: '1',
      currentValue: '0',
      unit: 'times',
      dueDate: getToday(),
      category: 'Personal',
    });
    setIsFormOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Goals"
        icon="🎯"
        description="Set and track your personal goals"
	        action={
	          <Button onClick={() => setIsFormOpen((open) => !open)} className="bg-blue-600 hover:bg-blue-700">
	            + New Goal
	          </Button>
	        }
	      />

      {isFormOpen && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Goal</CardTitle>
            <CardDescription>Add a measurable target to track.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Goal title"
                required
              />
              <Input
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                placeholder="Category"
              />
              <select
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as GoalType }))}
                className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm"
              >
                {goalTypes.map((goalType) => (
                  <option key={goalType.type} value={goalType.type}>
                    {goalType.label}
                  </option>
                ))}
              </select>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                required
              />
              <Input
                type="number"
                min="1"
                value={form.targetValue}
                onChange={(event) => setForm((current) => ({ ...current, targetValue: event.target.value }))}
                placeholder="Target"
              />
              <Input
                value={form.unit}
                onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
                placeholder="Unit"
              />
              <Textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                className="md:col-span-2"
              />
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit">Save Goal</Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {goalTypes.map((gt) => (
          <div key={gt.type}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>{gt.icon}</span>
              {gt.label} Goals
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {goals
                .filter((g) => g.type === gt.type)
                .map((goal) => (
                  <Card key={goal.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base">{goal.title}</CardTitle>
                      <CardDescription>{goal.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {goal.description && (
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Progress</span>
	                          <span className="font-semibold">
	                            {Math.round((goal.currentValue / Math.max(goal.targetValue, 1)) * 100)}%
	                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
	                              width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </p>
                      </div>

	                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
	                        <span className="text-xs text-gray-500">
	                          Due: {formatDate(goal.dueDate)}
	                        </span>
                          <Input
                            type="number"
                            min="0"
                            value={goal.currentValue}
                            onChange={(event) => {
                              const currentValue = Math.max(Number(event.target.value) || 0, 0);
                              const isCompleted = currentValue >= goal.targetValue;
                              updateGoal(goal.id, {
                                currentValue,
                                isCompleted,
                                completedAt: isCompleted ? goal.completedAt || new Date().toISOString() : undefined,
                              });
                            }}
                            className="w-24"
                          />
                          <Button
                            variant={goal.isCompleted ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() =>
                              updateGoal(goal.id, {
                                currentValue: goal.isCompleted ? 0 : goal.targetValue,
                                isCompleted: !goal.isCompleted,
                                completedAt: goal.isCompleted ? undefined : new Date().toISOString(),
                              })
                            }
                          >
                            {goal.isCompleted ? 'Reopen' : 'Done'}
                          </Button>
	                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {goals.filter((g) => g.type === gt.type).length === 0 && (
	                  <Card className="bg-gray-50 border-dashed">
	                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
	                      <p className="text-gray-500 mb-3">No {gt.label.toLowerCase()} goals yet</p>
	                  <Button variant="outline" onClick={() => setIsFormOpen(true)}>Create one</Button>
	                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
