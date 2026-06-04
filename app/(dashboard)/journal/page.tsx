'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useJournalStore } from '@/lib/stores/journalStore';
import { formatDate, getToday } from '@/lib/utils/dates';

export default function JournalPage() {
  const { entries, addEntry, deleteEntry } = useJournalStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: '',
    date: getToday(),
    mood: '',
    tags: '',
    content: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      return;
    }

    const now = new Date().toISOString();

    addEntry({
      id: crypto.randomUUID(),
      title: form.title.trim(),
      date: form.date,
      mood: form.mood.trim() || undefined,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      content: form.content.trim(),
      createdAt: now,
      updatedAt: now,
    });

    setForm({
      title: '',
      date: getToday(),
      mood: '',
      tags: '',
      content: '',
    });
    setIsFormOpen(false);
  };

  const entriesByDate = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const sortedDates = Object.keys(entriesByDate).sort().reverse();

  return (
    <>
      <PageHeader
        title="Daily Journal"
        icon="📝"
        description="Reflect, remember, and grow"
	        action={
	          <Button onClick={() => setIsFormOpen((open) => !open)} className="bg-blue-600 hover:bg-blue-700">
	            + New Entry
	          </Button>
	        }
	      />

      {isFormOpen && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Write Entry</CardTitle>
            <CardDescription>Capture today&apos;s reflection.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Entry title"
                required
              />
              <Input
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                required
              />
              <Input
                value={form.mood}
                onChange={(event) => setForm((current) => ({ ...current, mood: event.target.value }))}
                placeholder="Mood"
              />
              <Input
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                placeholder="Tags separated by commas"
              />
              <Textarea
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                placeholder="What happened today?"
                className="md:col-span-2 min-h-40"
                required
              />
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit">Save Entry</Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {formatDate(date)}
              </h3>
              
              <div className="space-y-4">
                {entriesByDate[date].map((entry) => (
                  <Card key={entry.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{entry.title}</CardTitle>
                          {entry.mood && (
                            <CardDescription className="mt-2">
                              Mood: {entry.mood}
                            </CardDescription>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
	              <p className="text-gray-500 mb-3">No journal entries yet. Start writing!</p>
	              <Button variant="outline" onClick={() => setIsFormOpen(true)}>Write your first entry</Button>
	            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
