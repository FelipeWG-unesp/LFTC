import styles from './Sidebar.module.css';

interface NavEntry {
  label: string;
  active?: boolean;
  comingSoon?: boolean;
}

const NAV_ENTRIES: NavEntry[] = [
  { label: 'Testador de Regex', active: true }
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        LFTC <span>v0.2</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ENTRIES.map((entry) => (
          <div
            key={entry.label}
            className={`${styles.navItem} ${entry.active ? styles.active : ''}`}
          >
            {entry.label}
            {entry.comingSoon && <span className={styles.tag}>em breve</span>}
          </div>
        ))}
      </nav>
      <p className={styles.note}>
        Site para desenvolvimento das atividades da disciplina Linguagens Formais e Teoria da Computação.
      </p>
    </aside>
  );
}
