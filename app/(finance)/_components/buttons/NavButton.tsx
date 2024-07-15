import NextLink from 'next/link';
import styles from './Button.module.css';

interface Props {
  href: string;
  label: string;
  active: boolean;
}

function NavButton({ href, label, active }: Props): JSX.Element {
  return (
    <NextLink
      className={`${styles['nav-button']} ${active && styles['nav-button--active']}`}
      href={href}
    >
      <p>{label}</p>
    </NextLink>
  );
}
export default NavButton;
