'use client';

import { useUser } from '@clerk/nextjs';
import styles from './Header.module.css';

function WelcomeMsg(): JSX.Element {
  const { user, isLoaded } = useUser();

  return (
    <div className={styles['welcome-msg']}>
      <h2 className={styles['welcome-msg__title']}>
        Welcome Back{isLoaded ? ', ' : ' '}
        {user?.firstName}
      </h2>
      <p className={styles['welcome-msg__subtitle']}>This is your Financial Overview Report</p>
    </div>
  );
}
export default WelcomeMsg;
