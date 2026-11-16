import { useEffect, useRef } from 'react';
import type { GrammarRow } from '../../types';
import styles from './GrammarEditor.module.css';

interface Props {
  rows: GrammarRow[];
  rowErrors: Record<string, string>;
  onChange: (id: string, patch: Partial<Pick<GrammarRow, 'lhs' | 'rhs'>>) => void;
  onRemove: (id: string) => void;
  /** Cria uma linha depois de `afterId` e devolve o id da nova linha. */
  onAdd: (afterId?: string) => string;
}

export function GrammarEditor({ rows, rowErrors, onChange, onRemove, onAdd }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const pendingFocusId = useRef<string | null>(null);

  // quando a nova linha aparece, leva o cursor para o campo da esquerda dela
  useEffect(() => {
    const id = pendingFocusId.current;
    if (id === null) return;
    pendingFocusId.current = null;
    listRef.current?.querySelector<HTMLInputElement>(`[data-lhs-id="${id}"]`)?.focus();
  }, [rows]);

  function addAfter(id?: string): void {
    pendingFocusId.current = onAdd(id);
  }

  return (
    <div>
      <div className={styles.list} ref={listRef}>
        {rows.map((row, index) => {
          const error = rowErrors[row.id];
          const invalid = error ? ` ${styles.invalid}` : '';
          return (
            <div key={row.id}>
              <div className={styles.row}>
                <span className={styles.startTag}>{index === 0 ? 'início' : ''}</span>
                <input
                  data-lhs-id={row.id}
                  className={`${styles.lhs}${invalid}`}
                  type="text"
                  maxLength={1}
                  spellCheck={false}
                  aria-label="Não terminal (lado esquerdo)"
                  placeholder="S"
                  value={row.lhs}
                  onFocus={(event) => event.target.select()}
                  onChange={(event) => onChange(row.id, { lhs: event.target.value })}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addAfter(row.id);
                    }
                  }}
                />
                <span className={styles.arrow}>→</span>
                <input
                  className={`${styles.rhs}${invalid}`}
                  type="text"
                  spellCheck={false}
                  aria-label="Lado direito da produção"
                  placeholder="vazio = ε   ·   use | para alternativas"
                  value={row.rhs}
                  onChange={(event) => onChange(row.id, { rhs: event.target.value })}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addAfter(row.id);
                    }
                  }}
                />
                <button
                  className={styles.remove}
                  type="button"
                  title="Remover produção"
                  onClick={() => onRemove(row.id)}
                >
                  ✕
                </button>
              </div>
              {error && <div className={styles.error}>{error}</div>}
            </div>
          );
        })}
      </div>
      <div className={styles.footer}>
        <button className={styles.add} type="button" onClick={() => addAfter()}>
          + nova produção
        </button>
        <span className={styles.hint}>ou pressione Enter</span>
      </div>
    </div>
  );
}
