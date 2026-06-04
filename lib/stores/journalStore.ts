import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDate: (date: string) => JournalEntry[];
  searchEntries: (query: string) => JournalEntry[];
  setEntries: (entries: JournalEntry[]) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => set((state) => ({ entries: [...state.entries, entry] })),
      updateEntry: (id, updatedEntry) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...updatedEntry } : e)),
        })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      getEntriesByDate: (date) => get().entries.filter((e) => e.date === date),
      searchEntries: (query) =>
        get().entries.filter(
          (e) =>
            e.title.toLowerCase().includes(query.toLowerCase()) ||
            e.content.toLowerCase().includes(query.toLowerCase()) ||
            e.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        ),
      setEntries: (entries) => set({ entries }),
    }),
    { name: 'journal-storage' }
  )
);
