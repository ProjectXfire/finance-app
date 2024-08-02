export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return previous === current ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

export function formatPercentage(value: number, options?: { addPrefix?: boolean }) {
  const result = new Intl.NumberFormat('en-US', {
    style: 'percent',
  }).format(value / 100);

  if (options?.addPrefix && value > 0) return `+${result}`;

  return result;
}
