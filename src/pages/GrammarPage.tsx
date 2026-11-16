import { GrammarEditor } from '../components/GrammarEditor/GrammarEditor';
import { GrammarSummary } from '../components/GrammarSummary/GrammarSummary';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { TestList } from '../components/TestList/TestList';
import { GRAMMAR_EXAMPLES } from '../data/grammarExamples';
import { useGrammarTester } from '../hooks/useGrammarTester';
import styles from './GrammarPage.module.css';

export function GrammarPage() {
  const tester = useGrammarTester();
  const hasErrors = Object.keys(tester.rowErrors).length > 0;

  return (
    <>
      <PageHeader
        title="Gramática"
        subtitle="Escreva as produções de uma gramática e veja quais textos ela gera. Funciona para gramáticas regulares e livres de contexto."
      />

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Produções</h2>
          <div className={styles.examples}>
            <span>exemplos:</span>
            {GRAMMAR_EXAMPLES.map((example) => (
              <button
                key={example.label}
                type="button"
                className={styles.chip}
                onClick={() => tester.loadExample(example)}
              >
                {example.label}
              </button>
            ))}
            <button type="button" className={styles.chip} onClick={tester.clearGrammar}>
              limpar
            </button>
          </div>
        </div>
        <GrammarEditor
          rows={tester.rows}
          rowErrors={tester.rowErrors}
          onChange={tester.updateRow}
          onRemove={tester.removeRow}
          onAdd={tester.addRow}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Verificação</h2>
        </div>
        <GrammarSummary
          grammar={tester.grammar}
          kind={tester.kind}
          warnings={tester.warnings}
          hasErrors={hasErrors}
        />
      </section>

      <TestList
        tests={tester.tests}
        statusFor={tester.statusFor}
        onChange={tester.updateTest}
        onRemove={tester.removeTest}
        onAdd={tester.addTest}
      />

      <details className={styles.help}>
        <summary>Como escrever a gramática</summary>
        <ul>
          <li>
            Letra <strong>maiúscula</strong> (<code>A</code>–<code>Z</code>) é não terminal; qualquer
            outro caractere é terminal. Cada caractere conta como um símbolo.
          </li>
          <li>O símbolo inicial é o não terminal da primeira produção.</li>
          <li>
            Use <code>|</code> para alternativas. Campo vazio ou <code>ε</code> significa a cadeia
            vazia.
          </li>
          <li>Espaços são ignorados.</li>
          <li>
            Nos testes, um campo vazio é a cadeia vazia <code>ε</code>.
          </li>
          <li>
            O reconhecimento usa o algoritmo de Earley, que aceita qualquer gramática livre de
            contexto (inclusive ambígua ou recursiva à esquerda).
          </li>
        </ul>
      </details>
    </>
  );
}
