import styles from './Button.module.css';
import { Button } from '@/shared/components';

interface Props {
  href: string;
  label: string;
  active: boolean;
  onClick: (href: string) => void;
}

function SideButton({ href, label, active, onClick }: Props): JSX.Element {
  return (
    <Button
      className={`${styles['side-button']} ${active && styles['side-button--active']}`}
      variant='ghost'
      onClick={() => onClick(href)}
    >
      {label}
    </Button>
  );
}
export default SideButton;
