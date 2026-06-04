'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStudyStore } from '@/lib/stores/studyStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getToday, getDateRange } from '@/lib/utils/dates';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function StudyPage() {
  const { sessions, addSession, deleteSession, getSessionsByDate, getTotalHours } = useStudyStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    subject: '',
    date: getToday(),
    startTime: '09:00',
    endTime: '10:00',
    duration: '60',
    notes: '',
    rating: '4',
  });
  const todaySessions = getSessionsByDate(getToday());
  const monthRange = getDateRange(30);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.subject.trim()) {
      return;
    }

    addSession({
      id: crypto.randomUUID(),
      subject: form.subject.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      duration: Math.max(Number(form.duration) || 0, 1),
      notes: form.notes.trim() || undefined,
      rating: Math.min(Math.max(Number(form.rating) || 0, 1), 5),
    });

    setForm({
      subject: '',
      date: getToday(),
      startTime: '09:00',
      endTime: '10:00',
      duration: '60',
      notes: '',
      rating: '4',
    });
    setIsFormOpen(false);
  };

  // Prepare chart data
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const hours = getTotalHours(dateStr, dateStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: parseFloat(hours.toFixed(1)),
    };
  });

  const subjectData = Array.from(
    new Set(sessions.map((s) => s.subject))
  ).map((subject) => {
    const subjectSessions = sessions.filter((s) => s.subject === subject);
    const totalMinutes = subjectSessions.reduce((acc, s) => acc + s.duration, 0);
    return {
      name: subject,
      value: parseFloat((totalMinutes / 60).toFixed(1)),
    };
  });

  return (
    <>
      <PageHeader
        title="Study Tracker"
        icon="📚"
        description="Monitor your learning progress"
	        action={
	          <Button onClick={() => setIsFormOpen((open) => !open)} className="bg-blue-600 hover:bg-blue-700">
	            + New Session
	          </Button>
	        }
	      />

      {isFormOpen && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Log Study Session</CardTitle>
            <CardDescription>Record focused learning time.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={form.subject}
                onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                placeholder="Subject"
                required
              />
              <Input
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                required
              />
              <Input
                type="time"
                value={form.startTime}
                onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))}
              />
              <Input
                type="time"
                value={form.endTime}
                onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))}
              />
              <Input
                type="number"
                min="1"
                value={form.duration}
                onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
                placeholder="Duration in minutes"
              />
              <Input
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
                placeholder="Rating 1-5"
              />
              <Textarea
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Notes"
                className="md:col-span-2"
              />
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit">Save Session</Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardDescription>Today&apos;s Hours</CardDescription>
            <CardTitle className="text-3xl">
              {(todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60).toFixed(1)}h
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Sessions Today</CardDescription>
            <CardTitle className="text-3xl">{todaySessions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Hours (30 days)</CardDescription>
            <CardTitle className="text-3xl">
              {getTotalHours(monthRange.start, monthRange.end).toFixed(1)}h
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        {subjectData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Study by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}h`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subjectData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <div className="space-y-2">
              {sessions.slice(-5).reverse().map((session) => (
	                <div
	                  key={session.id}
	                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
	                >
                  <div>
                    <p className="font-medium text-gray-900">{session.subject}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.date).toLocaleDateString()} • {session.duration} mins
                    </p>
                  </div>
                    <div className="flex items-center gap-3">
                      {session.rating && (
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < session.rating! ? '★' : '☆'}</span>
                          ))}
                        </div>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteSession(session.id)}>
                        Delete
                      </Button>
                    </div>
	                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No study sessions yet</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
