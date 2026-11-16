import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { GrammarPage } from './pages/GrammarPage';
import { RegexPage } from './pages/RegexPage';
import type { ToolId } from './types';
import styles from './App.module.css';

/** A aba aberta fica no endereço (#regex ou #grammar): dá para favoritar e o F5 não perde a aba. */
function toolFromHash(): ToolId {
  return window.location.hash === '#grammar' ? 'grammar' : 'regex';
}

export function App() {
  const [tool, setTool] = useState<ToolId>(toolFromHash);

  useEffect(() => {
    window.location.hash = tool;
  }, [tool]);

  useEffect(() => {
    const onHashChange = () => setTool(toolFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar active={tool} onSelect={setTool} />
      <main className={styles.main}>
        {/* As duas páginas ficam montadas (só escondidas) para não perder o que foi digitado ao trocar de aba. */}
        <section hidden={tool !== 'regex'}>
          <RegexPage />
        </section>
        <section hidden={tool !== 'grammar'}>
          <GrammarPage />
        </section>
      </main>
    </div>
  );
}