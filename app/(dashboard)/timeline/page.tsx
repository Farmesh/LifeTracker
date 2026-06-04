'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTimelineStore } from '@/lib/stores/timelineStore';
import { getToday, formatTime } from '@/lib/utils/dates';

export default function TimelinePage() {
  const { addEvent, deleteEvent, getEventsByDate } = useTimelineStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    date: getToday(),
    time: '09:00',
    title: '',
    description: '',
    category: 'General',
    color: '#3b82f6',
    duration: '',
    notes: '',
  });
  const todayEvents = getEventsByDate(getToday());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    addEvent({
      id: crypto.randomUUID(),
      date: form.date,
      time: form.time,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category.trim() || 'General',
      color: form.color,
      duration: form.duration ? Math.max(Number(form.duration) || 0, 1) : undefined,
      notes: form.notes.trim() || undefined,
    });

    setForm({
      date: getToday(),
      time: '09:00',
      title: '',
      description: '',
      category: 'General',
      color: '#3b82f6',
      duration: '',
      notes: '',
    });
    setIsFormOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Daily Timeline"
        icon="📅"
        description="Track what you're doing throughout the day"
	        action={
	          <Button onClick={() => setIsFormOpen((open) => !open)} className="bg-blue-600 hover:bg-blue-700">
	            + Log Activity
	          </Button>
	        }
	      />

      {isFormOpen && (
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Log Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Activity title"
                required
              />
              <Input
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                placeholder="Category"
              />
              <Input
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
              <Input
                type="time"
                value={form.time}
                onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
              />
              <Input
                type="number"
                min="1"
                value={form.duration}
                onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
                placeholder="Duration in minutes"
              />
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
              <Textarea
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Notes"
                className="md:col-span-2"
              />
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit">Save Activity</Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="max-w-2xl mx-auto">
        {todayEvents.length > 0 ? (
          <div className="space-y-4">
            {todayEvents.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-4 h-4 rounded-full mt-2"
                    style={{ backgroundColor: event.color }}
                  />
                  {index < todayEvents.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                  )}
                </div>

                {/* Event card */}
                <Card className="flex-1 mb-4">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {formatTime(event.time)}
                        </p>
                        <CardTitle className="text-lg mt-1">{event.title}</CardTitle>
                      </div>
	                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
	                        {event.category}
	                      </span>
                        <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
                          Delete
                        </Button>
	                    </div>
                  </CardHeader>
                  {event.description && (
                    <CardContent>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                      {event.duration && (
                        <p className="text-xs text-gray-500 mt-2">
                          Duration: {event.duration} minutes
                        </p>
                      )}
                      {event.notes && (
                        <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded">
                          {event.notes}
                        </p>
                      )}
                    </CardContent>
                  )}
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
	              <p className="text-gray-500 mb-3">No timeline events yet. Start logging your day!</p>
	              <Button variant="outline" onClick={() => setIsFormOpen(true)}>Log your first activity</Button>
	            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
