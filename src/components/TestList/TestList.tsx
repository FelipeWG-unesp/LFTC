import type { MatchStatus, TestCase } from '../../types';
import { TestRow } from '../TestRow/TestRow';
import styles from './TestList.module.css';

interface Props {
  tests: TestCase[];
  statusFor: (value: string) => MatchStatus;
  onChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export function TestList({ tests, statusFor, onChange, onRemove, onAdd }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h2>Testes</h2>
      </div>
      <div className={styles.list}>
        {tests.map((test, index) => (
          <TestRow
            key={test.id}
            index={index}
            value={test.value}
            status={statusFor(test.value)}
            onChange={(value) => onChange(test.id, value)}
            onRemove={() => onRemove(test.id)}
          />
        ))}
      </div>
      <button className={styles.add} onClick={onAdd} type="button">
        + adicionar teste
      </button>
    </div>
  );
}
