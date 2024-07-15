'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { routes } from '@/shared/constants';
import styles from './Menu.module.css';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components';
import { SideButton } from '..';

function SidebarMenu(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const onClick = (href: string): void => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <aside className={styles['sidebar-menu']}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Menu className={styles['sidebar-menu__trigger']} />
        </SheetTrigger>
        <SheetContent aria-describedby='el pepe' className='px-2 pt-6' side='left'>
          <SheetHeader>
            <SheetTitle>Finance</SheetTitle>
            <SheetDescription>Welcome to Finance</SheetDescription>
          </SheetHeader>
          <nav className={styles['sidebar-menu__content']}>
            {routes.map((r) => (
              <SideButton
                key={r.href}
                href={r.href}
                active={pathname === r.href}
                label={r.label}
                onClick={onClick}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </aside>
  );
}
export default SidebarMenu;
