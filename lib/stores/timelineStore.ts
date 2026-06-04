import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description?: string;
  category: string;
  color: string;
  duration?: number; // in minutes
  notes?: string;
}

interface TimelineState {
  events: TimelineEvent[];
  addEvent: (event: TimelineEvent) => void;
  updateEvent: (id: string, event: Partial<TimelineEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => TimelineEvent[];
  setEvents: (events: TimelineEvent[]) => void;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e)),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
      getEventsByDate: (date) =>
        get().events.filter((e) => e.date === date).sort((a, b) => a.time.localeCompare(b.time)),
      setEvents: (events) => set({ events }),
    }),
    { name: 'timeline-storage' }
  )
);
