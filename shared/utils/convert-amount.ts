export function convertAmountToMiliunits(amount: number): number {
  return Math.round(amount * 1000);
}

export function convertAmountFromMiliunits(amount: number): number {
  return amount / 1000;
}

export function formatCurrency(value: number) {
  const valueFormatted = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
  return valueFormatted;
}
