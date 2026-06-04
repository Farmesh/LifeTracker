'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/timeline', label: 'Timeline', icon: '📅' },
  { href: '/goals', label: 'Goals', icon: '🎯' },
  { href: '/habits', label: 'Habits', icon: '✓' },
  { href: '/journal', label: 'Journal', icon: '📝' },
  { href: '/study', label: 'Study', icon: '📚' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
  { href: '/life-areas', label: 'Life Areas', icon: '🌍' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:overflow-y-auto md:flex md:flex-col md:bg-white md:border-r md:border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Life Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Track. Reflect. Grow.</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
              pathname === item.href
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 text-xs text-gray-500">
        <p>© 2026 Life Dashboard</p>
        <p className="mt-2">Track your progress, improve your life.</p>
      </div>
    </div>
  );
}
