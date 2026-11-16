import { Cheatsheet } from './components/Cheatsheet/Cheatsheet';
import { ExpressionField } from './components/ExpressionField/ExpressionField';
import { FlagToggles } from './components/FlagToggles/FlagToggles';
import { Sidebar } from './components/Sidebar/Sidebar';
import { TestList } from './components/TestList/TestList';
import { useRegexTester } from './hooks/useRegexTester';
import styles from './App.module.css';

export function App() {
  const {
    pattern,
    setPattern,
    flags,
    toggleFlag,
    tests,
    addTest,
    updateTest,
    removeTest,
    error,
    statusFor,
    MAX_TESTS,
  } = useRegexTester();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <h1>Testador de Regex</h1>
        <p className={styles.subtitle}>
          Digite uma expressão regular e veja, em tempo real, quais textos ela aceita.
        </p>

        <div className={styles.exprRow}>
          <div className={styles.exprField}>
            <ExpressionField pattern={pattern} error={error} onChange={setPattern} />
          </div>
          <FlagToggles flags={flags} onToggle={toggleFlag} />
        </div>

        <TestList
          tests={tests}
          statusFor={statusFor}
          onChange={updateTest}
          onRemove={removeTest}
          onAdd={addTest}
          canAdd={tests.length < MAX_TESTS}
        />

        <Cheatsheet />
      </main>
    </div>
  );
}
