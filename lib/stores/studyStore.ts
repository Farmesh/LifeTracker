import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StudySession {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  notes?: string;
  rating?: number; // 1-5
}

interface StudyState {
  sessions: StudySession[];
  addSession: (session: StudySession) => void;
  updateSession: (id: string, session: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  getSessionsByDate: (date: string) => StudySession[];
  getTotalHours: (startDate: string, endDate: string) => number;
  getSessionsBySubject: (subject: string) => StudySession[];
  setSessions: (sessions: StudySession[]) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      sessions: [],
      addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
      updateSession: (id, updatedSession) =>
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updatedSession } : s)),
        })),
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),
      getSessionsByDate: (date) => get().sessions.filter((s) => s.date === date),
      getTotalHours: (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return get().sessions
          .filter((s) => {
            const sessionTime = new Date(s.date).getTime();
            return sessionTime >= start && sessionTime <= end;
          })
          .reduce((total, s) => total + s.duration, 0) / 60;
      },
      getSessionsBySubject: (subject) => get().sessions.filter((s) => s.subject === subject),
      setSessions: (sessions) => set({ sessions }),
    }),
    { name: 'study-storage' }
  )
);
