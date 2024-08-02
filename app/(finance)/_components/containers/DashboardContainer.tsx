import styles from './Container.module.css';

interface Props {
  children: React.ReactNode;
}

function DashboardContainer({ children }: Props): JSX.Element {
  return <div className={styles['dashboard-container']}>{children}</div>;
}
export default DashboardContainer;
