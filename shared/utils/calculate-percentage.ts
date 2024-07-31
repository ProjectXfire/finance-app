export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return previous === current ? 0 : 100;
  return ((current - previous) / previous) * 100;
}
