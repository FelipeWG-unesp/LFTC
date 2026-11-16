import type { ToolId } from '../../types';
import styles from './Sidebar.module.css';

interface NavEntry {
  label: string;
  /** Sem id = ainda não existe (aparece como "em breve"). */
  id?: ToolId;
}

const NAV_ENTRIES: NavEntry[] = [
  { id: 'regex', label: 'Testador de Regex' },
  { id: 'grammar', label: 'Gramática' },
  { label: 'Conversor JSON' },
  { label: 'Formatador de texto' },
];

interface Props {
  active: ToolId;
  onSelect: (id: ToolId) => void;
}

export function Sidebar({ active, onSelect }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        Kit de Trabalhos <span>v0.3</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ENTRIES.map((entry) => {
          const { id } = entry;
          if (id === undefined) {
            return (
              <div key={entry.label} className={`${styles.navItem} ${styles.disabled}`}>
                {entry.label}
                <span className={styles.tag}>em breve</span>
              </div>
            );
          }
          return (
            <button
              key={id}
              type="button"
              className={`${styles.navItem} ${styles.navButton} ${id === active ? styles.active : ''}`}
              aria-current={id === active ? 'page' : undefined}
              onClick={() => onSelect(id)}
            >
              {entry.label}
            </button>
          );
        })}
      </nav>
      <p className={styles.note}>
        Novas ferramentas entram nesta barra lateral conforme forem adicionadas ao repositório.
      </p>
    </aside>
  );
}
