export function convertAmountToMiliunits(amount: number): number {
  return Math.round(amount * 1000);
}

export function convertAmountFromMiliunits(amount: number): number {
  return Math.round(amount / 1000);
}
