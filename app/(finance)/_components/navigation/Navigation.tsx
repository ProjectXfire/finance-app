'use client';

import { usePathname } from 'next/navigation';
import { routes } from '@/shared/constants';
import styles from './Navigation.module.css';
import { NavButton } from '..';

function Navigation(): JSX.Element {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation}>
      {routes.map((r) => (
        <NavButton key={r.href} href={r.href} active={pathname === r.href} label={r.label} />
      ))}
    </nav>
  );
}
export default Navigation;
