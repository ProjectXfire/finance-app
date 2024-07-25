import styles from './Loading.module.css';

interface Props {
  color?: string;
}

function Loading({ color }: Props): JSX.Element {
  return (
    <div className={styles['lds-ellipsis']} style={{ color }}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
export default Loading;
