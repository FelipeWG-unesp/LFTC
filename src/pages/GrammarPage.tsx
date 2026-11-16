import { GrammarEditor } from '../components/GrammarEditor/GrammarEditor';
import { GrammarSummary } from '../components/GrammarSummary/GrammarSummary';
import { TestList } from '../components/TestList/TestList';
import { GRAMMAR_EXAMPLES } from '../data/grammarExamples';
import { useGrammarTester } from '../hooks/useGrammarTester';
import styles from './GrammarPage.module.css';

export function GrammarPage() {
  const g = useGrammarTester();
  const hasErrors = Object.keys(g.rowErrors).length > 0;

  return (
    <>
      <h1>Gramática Regular</h1>
      <p className={styles.subtitle}>
        Escreva as produções e veja quais textos a gramática gera. A verificação mostra se ela tem
        a forma de uma gramática regular.
      </p>

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
                onClick={() => g.loadExample(example)}
              >
                {example.label}
              </button>
            ))}
            <button type="button" className={styles.chip} onClick={g.clearGrammar}>
              limpar
            </button>
          </div>
        </div>
        <GrammarEditor
          rows={g.rows}
          rowErrors={g.rowErrors}
          onChange={g.updateRow}
          onRemove={g.removeRow}
          onAdd={g.addRow}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Verificação</h2>
        </div>
        <GrammarSummary
          grammar={g.grammar}
          classification={g.classification}
          warnings={g.warnings}
          hasErrors={hasErrors}
        />
      </section>

      <TestList
        tests={g.tests}
        statusFor={g.statusFor}
        onChange={g.updateTest}
        onRemove={g.removeTest}
        onAdd={g.addTest}
        canAdd={g.tests.length < g.MAX_TESTS}
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
            Use <code>|</code> para alternativas. Campo vazio ou <code>ε</code> é a cadeia vazia.
          </li>
          <li>Espaços são ignorados.</li>
          <li>
            Nos testes, um campo vazio é a cadeia vazia <code>ε</code>.
          </li>
          <li>
            Regular = todas as produções lineares à direita (<code>A → aB</code>) ou todas lineares
            à esquerda (<code>A → Ba</code>).
          </li>
        </ul>
      </details>
    </>
  );
}