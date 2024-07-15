import NextLink from 'next/link';
import NextImage from 'next/image';
import styles from './Logo.module.css';

function Logo(): JSX.Element {
  return (
    <NextLink className={styles.logo} href='/'>
      <NextImage src='/images/logo.png' alt='logo' width={35} height={35} />
      <p>Finance</p>
    </NextLink>
  );
}
export default Logo;
