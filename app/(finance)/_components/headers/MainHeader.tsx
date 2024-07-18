import styles from './Header.module.css';
import { Logo, ToggleTheme } from '@/shared/components';
import { Loader2 } from 'lucide-react';
import { Navigation, SidebarMenu, WelcomeMsg } from '..';
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';

function MainHeader(): JSX.Element {
  return (
    <header className={styles['main-header']}>
      <div className={styles['main-header__content']}>
        <div className={styles['main-header__navbar']}>
          <SidebarMenu />
          <div className={styles['main-header__navigation']}>
            <Logo />
            <Navigation />
          </div>
          <div className={styles['main-header__actions']}>
            <ToggleTheme />
            <ClerkLoaded>
              <UserButton afterSwitchSessionUrl='/sign-in' />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className='size-8 animate-spin' />
            </ClerkLoading>
          </div>
        </div>
        <WelcomeMsg />
      </div>
    </header>
  );
}
export default MainHeader;
