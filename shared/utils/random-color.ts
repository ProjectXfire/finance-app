const hexCharacters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

export function generateHexRandomColor(): string {
  const hexValue = [];

  for (let i = 0; i < 6; i++) {
    const value = Math.floor(Math.random() * 16);
    hexValue.push(hexCharacters[value]);
  }
  return `#${hexValue.join('')}`;
}
