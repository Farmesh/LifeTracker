import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LifeArea = 'study' | 'fitness' | 'reading' | 'career' | 'personal-dev' | 'health' | 'finances';

export interface AreaScore {
  area: LifeArea;
  week: string; // ISO week string
  score: number; // 0-100
  notes?: string;
  lastUpdated: string;
}

interface LifeAreasState {
  scores: AreaScore[];
  addScore: (score: AreaScore) => void;
  updateScore: (area: LifeArea, week: string, score: number) => void;
  getWeeklyScores: (week: string) => Map<LifeArea, number>;
  getAreaHistory: (area: LifeArea, weeks: number) => AreaScore[];
  setScores: (scores: AreaScore[]) => void;
}

export const useLifeAreasStore = create<LifeAreasState>()(
  persist(
    (set, get) => ({
      scores: [],
      addScore: (score) => set((state) => ({ scores: [...state.scores, score] })),
      updateScore: (area, week, score) =>
        set((state) => {
          const existing = state.scores.find((s) => s.area === area && s.week === week);
          if (existing) {
            return {
              scores: state.scores.map((s) =>
                s.area === area && s.week === week ? { ...s, score, lastUpdated: new Date().toISOString() } : s
              ),
            };
          }
          return {
            scores: [
              ...state.scores,
              {
                area,
                week,
                score,
                lastUpdated: new Date().toISOString(),
              },
            ],
          };
        }),
      getWeeklyScores: (week) => {
        const scores = new Map<LifeArea, number>();
        const areas: LifeArea[] = ['study', 'fitness', 'reading', 'career', 'personal-dev', 'health', 'finances'];

        areas.forEach((area) => {
          const score = get().scores.find((s) => s.area === area && s.week === week)?.score ?? 0;
          scores.set(area, score);
        });

        return scores;
      },
      getAreaHistory: (area, weeks) => {
        return get()
          .scores.filter((s) => s.area === area)
          .slice(-weeks)
          .sort((a, b) => a.week.localeCompare(b.week));
      },
      setScores: (scores) => set({ scores }),
    }),
    { name: 'life-areas-storage' }
  )
);
