'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subLabel?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

export function StatCard({
  icon,
  label,
  value,
  subLabel,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{icon}</span>
                <p className="text-sm text-gray-600">{label}</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {subLabel && <p className="text-xs text-gray-500 mt-2">{subLabel}</p>}
            </div>
            {trend && (
              <div className={cn(
                'text-sm font-medium px-2 py-1 rounded',
                trend === 'up' && 'text-green-700 bg-green-50',
                trend === 'down' && 'text-red-700 bg-red-50',
                trend === 'stable' && 'text-gray-700 bg-gray-50',
              )}>
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trend === 'stable' && '→'}
                {trendValue && ` ${trendValue}`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
