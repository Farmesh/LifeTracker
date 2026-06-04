'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLifeAreasStore, type LifeArea } from '@/lib/stores/lifeAreasStore';
import { getWeekString } from '@/lib/utils/dates';
import { Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AREA_CONFIG: Record<LifeArea, { label: string; icon: string; color: string }> = {
  study: { label: 'Study', icon: '📚', color: '#3b82f6' },
  fitness: { label: 'Fitness', icon: '💪', color: '#10b981' },
  reading: { label: 'Reading', icon: '📖', color: '#8b5cf6' },
  career: { label: 'Career', icon: '🎯', color: '#f59e0b' },
  'personal-dev': { label: 'Personal Dev', icon: '🌱', color: '#06b6d4' },
  health: { label: 'Health', icon: '❤️', color: '#ef4444' },
  finances: { label: 'Finances', icon: '💰', color: '#6366f1' },
};

export default function LifeAreasPage() {
  const { getWeeklyScores, updateScore } = useLifeAreasStore();
  const currentWeek = getWeekString();
  const weeklyScores = getWeeklyScores(currentWeek);

  // Prepare radar chart data
  const radarData = Array.from(weeklyScores.entries()).map(([area, score]) => ({
    area: AREA_CONFIG[area].label,
    score: score,
    fullMark: 100,
  }));

  return (
    <>
      <PageHeader
        title="Life Areas Dashboard"
        icon="🌍"
        description="Balance across all important areas of your life"
      />

      {/* Current Week Score Gauge */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week&apos;s Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Array.from(weeklyScores.entries()).map(([area, score]) => {
            const config = AREA_CONFIG[area];
            const scoreColor =
              score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';

            return (
              <Card key={area} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-2">{config.icon}</div>
                  <p className="text-xs text-gray-600 mb-2 font-medium">{config.label}</p>
	                  <p className={`text-3xl font-bold ${scoreColor}`}>{score}</p>
	                  <p className="text-xs text-gray-500 mt-2">out of 100</p>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(event) => updateScore(area, currentWeek, Number(event.target.value))}
                      className="mt-4 w-full"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(event) =>
                        updateScore(area, currentWeek, Math.min(Math.max(Number(event.target.value) || 0, 0), 100))
                      }
                      className="mt-3 h-9 w-full rounded-lg border border-gray-300 px-3 text-center text-sm"
                    />
	                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Balance</CardTitle>
            <CardDescription>Score distribution across life areas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="area" stroke="#6b7280" />
                <PolarRadiusAxis stroke="#6b7280" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Score */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Life Score</CardTitle>
            <CardDescription>Average across all areas</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {Math.round(
                Array.from(weeklyScores.values()).reduce((a, b) => a + b, 0) /
                  weeklyScores.size || 0
              )}
            </div>
            <p className="text-gray-600">out of 100</p>
            <p className="text-sm text-gray-500 mt-4 text-center">
              {weeklyScores.size} areas tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Areas</CardTitle>
          <CardDescription>Areas that need improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from(weeklyScores.entries())
              .filter(([, score]) => score < 60)
              .sort(([, a], [, b]) => a - b)
              .map(([area, score]) => {
                const config = AREA_CONFIG[area];
                return (
                  <div key={area} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{config.label}</p>
                        <p className="text-sm text-gray-600">Current score: {score}/100</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Needs Improvement</Badge>
                  </div>
                );
              })}
            {Array.from(weeklyScores.values()).every((score) => score >= 60) && (
              <p className="text-center text-gray-500 py-8">
                Great job! All areas are performing well. 🎉
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
