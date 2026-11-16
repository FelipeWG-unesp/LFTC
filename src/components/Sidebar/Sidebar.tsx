import type { ToolId } from '../../types';
import styles from './Sidebar.module.css';

interface NavEntry {
  id: ToolId;
  label: string;
}

const NAV_ENTRIES: NavEntry[] = [
  { id: 'regex', label: 'Testador de Regex' },
  { id: 'grammar', label: 'Gramática Regular' },
];

interface Props {
  active: ToolId;
  onSelect: (id: ToolId) => void;
}

export function Sidebar({ active, onSelect }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        LFTC <span>v0.3</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ENTRIES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`${styles.navItem} ${styles.navButton} ${entry.id === active ? styles.active : ''}`}
            aria-current={entry.id === active ? 'page' : undefined}
            onClick={() => onSelect(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <p className={styles.note}>
        Site para desenvolvimento das atividades da disciplina Linguagens Formais e Teoria da Computação.
      </p>
    </aside>
  );
}
