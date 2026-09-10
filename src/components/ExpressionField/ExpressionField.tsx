import styles from './ExpressionField.module.css';

interface Props {
  pattern: string;
  error: string | null;
  onChange: (value: string) => void;
}

export function ExpressionField({ pattern, error, onChange }: Props) {
  return (
    <div>
      <label className={styles.label} htmlFor="expression">
        Expressão
      </label>
      <div className={`${styles.wrap} ${error ? styles.invalid : ''}`}>
        <span className={styles.slash}>/</span>
        <input
          id="expression"
          className={styles.input}
          type="text"
          spellCheck={false}
          placeholder="^([A-Z][0-9]){3}$"
          value={pattern}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className={styles.slash}>/</span>
      </div>
      <div className={styles.error}>{error ? `Expressão inválida: ${error}` : ''}</div>
    </div>
  );
}
