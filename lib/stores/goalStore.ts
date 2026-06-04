import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GoalType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  dueDate: string;
  category: string;
  createdAt: string;
  completedAt?: string;
  isCompleted: boolean;
}

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getGoalsByType: (type: GoalType) => Goal[];
  getTodayGoals: () => Goal[];
  setGoals: (goals: Goal[]) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, updatedGoal) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updatedGoal } : g)),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
      getGoalsByType: (type) => get().goals.filter((g) => g.type === type),
      getTodayGoals: () => {
        const today = new Date().toDateString();
        return get().goals.filter((g) => new Date(g.dueDate).toDateString() === today);
      },
      setGoals: (goals) => set({ goals }),
    }),
    { name: 'goal-storage' }
  )
);
