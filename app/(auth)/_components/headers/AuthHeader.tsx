import styles from './Header.module.css';

interface Props {
  title: string;
  subtitle: string;
}

function AuthHeader({ title, subtitle }: Props): JSX.Element {
  return (
    <header className={styles['auth-header']}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
export default AuthHeader;
