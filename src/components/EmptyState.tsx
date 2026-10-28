import { Link } from 'react-router-dom';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message: string;
  actionLabel: string;
  actionHref: string;
}

/** 空状态：说明现状 + 给下一步 */
export function EmptyState({ message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <p className={styles.text}>{message}</p>
      <Link to={actionHref} className="btn btnSecondary">
        {actionLabel}
      </Link>
    </div>
  );
}
