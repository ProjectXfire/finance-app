'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { QueryProvider } from '..';

function Providers({ children, ...props }: ThemeProviderProps): JSX.Element {
  return (
    <QueryProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </QueryProvider>
  );
}
export default Providers;
