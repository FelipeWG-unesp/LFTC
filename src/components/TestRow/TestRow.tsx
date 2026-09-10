import type { MatchStatus } from '../../types';
import { StatusIcon } from '../StatusIcon/StatusIcon';
import styles from './TestRow.module.css';

interface Props {
  index: number;
  value: string;
  status: MatchStatus;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function TestRow({ index, value, status, onChange, onRemove }: Props) {
  const boxClassName = [styles.box, status !== 'neutral' ? styles[status] : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.row}>
      <div className={styles.label}>Texto {index + 1}</div>
      <div className={boxClassName}>
        <input
          className={styles.input}
          type="text"
          spellCheck={false}
          placeholder="Digite um texto para testar…"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <div className={styles.status}>
          <StatusIcon status={status} />
        </div>
      </div>
      <button className={styles.remove} onClick={onRemove} title="Remover teste" type="button">
        ✕
      </button>
    </div>
  );
}
