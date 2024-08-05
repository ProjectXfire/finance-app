import { Filter } from '..';
import styles from './Container.module.css';

interface Props {
  children: React.ReactNode;
}

function MainContainer({ children }: Props) {
  return <main className={styles['main-container']}>{children}</main>;
}
export default MainContainer;
