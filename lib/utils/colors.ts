export const colors = [
  { name: 'blue', value: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-200' },
  { name: 'red', value: '#ef4444', bg: 'bg-red-50', border: 'border-red-200' },
  { name: 'green', value: '#10b981', bg: 'bg-green-50', border: 'border-green-200' },
  { name: 'purple', value: '#a855f7', bg: 'bg-purple-50', border: 'border-purple-200' },
  { name: 'pink', value: '#ec4899', bg: 'bg-pink-50', border: 'border-pink-200' },
  { name: 'yellow', value: '#f59e0b', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { name: 'indigo', value: '#6366f1', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { name: 'cyan', value: '#06b6d4', bg: 'bg-cyan-50', border: 'border-cyan-200' },
];

export const categoryColors: Record<string, typeof colors[0]> = {
  productivity: colors[0],
  health: colors[5],
  learning: colors[3],
  fitness: colors[1],
  reading: colors[2],
  career: colors[6],
  personal: colors[7],
  default: colors[0],
};

export const getColorByCategory = (category: string) => {
  return categoryColors[category.toLowerCase()] || categoryColors.default;
};
