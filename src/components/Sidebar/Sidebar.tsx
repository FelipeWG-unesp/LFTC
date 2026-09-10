import styles from './Sidebar.module.css';

interface NavEntry {
  label: string;
  active?: boolean;
  comingSoon?: boolean;
}

const NAV_ENTRIES: NavEntry[] = [
  { label: 'Testador de Regex', active: true }//,
  //{ label: 'Conversor JSON', comingSoon: true },
  //{ label: 'Formatador de texto', comingSoon: true },
  //{ label: 'Contador de citações', comingSoon: true },
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        Kit de Trabalhos <span>v0.2</span>
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
        Este é o primeiro módulo do site. Novas ferramentas entram nesta barra lateral conforme
        forem adicionadas ao repositório.
      </p>
    </aside>
  );
}
