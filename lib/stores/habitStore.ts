import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HabitEntry {
  date: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  entries: HabitEntry[];
  currentStreak: number;
  longestStreak: number;
}

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  checkHabit: (habitId: string, date: string) => void;
  setHabits: (habits: Habit[]) => void;
  getHabitCompletion: (habitId: string, startDate: string, endDate: string) => number;
}

function calculateStreaks(entries: HabitEntry[]) {
  const completedDates = new Set(
    entries.filter((entry) => entry.completed).map((entry) => entry.date)
  );
  let currentStreak = 0;
  const cursor = new Date();

  while (completedDates.has(cursor.toISOString().split('T')[0])) {
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sortedDates = Array.from(completedDates).sort();
  let longestStreak = 0;
  let runningStreak = 0;
  let previousDate: Date | null = null;

  sortedDates.forEach((dateString) => {
    const date = new Date(dateString);
    const isNextDay =
      previousDate &&
      Math.round((date.getTime() - previousDate.getTime()) / 86_400_000) === 1;

    runningStreak = isNextDay ? runningStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, runningStreak);
    previousDate = date;
  });

  return { currentStreak, longestStreak };
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
      updateHabit: (id, updatedHabit) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updatedHabit } : h)),
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),
      checkHabit: (habitId, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id === habitId) {
              const existingEntry = h.entries.find((e) => e.date === date);
              const entries = h.entries.filter((e) => e.date !== date);

              if (!existingEntry?.completed) {
                entries.push({ date, completed: true });
              }

              const streaks = calculateStreaks(entries);
              return { ...h, entries, ...streaks };
            }
            return h;
          }),
        })),
      setHabits: (habits) => set({ habits }),
      getHabitCompletion: (habitId, startDate, endDate) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return 0;

        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        const relevantEntries = habit.entries.filter((e) => {
          const entryTime = new Date(e.date).getTime();
          return entryTime >= start && entryTime <= end && e.completed;
        });

        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return Math.round((relevantEntries.length / totalDays) * 100);
      },
    }),
    { name: 'habit-storage' }
  )
);
