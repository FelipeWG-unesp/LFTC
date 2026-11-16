import { Cheatsheet } from '../components/Cheatsheet/Cheatsheet';
import { ExpressionField } from '../components/ExpressionField/ExpressionField';
import { FlagToggles } from '../components/FlagToggles/FlagToggles';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { TestList } from '../components/TestList/TestList';
import { useRegexTester } from '../hooks/useRegexTester';
import styles from './RegexPage.module.css';

export function RegexPage() {
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
  } = useRegexTester();

  return (
    <>
      <PageHeader
        title="Testador de Regex"
        subtitle="Digite uma expressão regular e veja, em tempo real, quais textos ela aceita."
      />

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
      />

      <Cheatsheet />
    </>
  );
}
