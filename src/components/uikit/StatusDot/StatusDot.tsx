import styles from './StatusDot.module.css';

export type DotStatus = 'ok' | 'process' | 'inactive';

export const StatusDot = ({ status }: { status: DotStatus }) => {
  return <div className={`${styles.container} ${styles[status]}`} />;
};
