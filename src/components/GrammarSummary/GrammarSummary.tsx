import type { Grammar, GrammarClassification, GrammarKind } from '../../types';
import { groupProductions } from '../../utils/grammar';
import styles from './GrammarSummary.module.css';

interface Props {
  grammar: Grammar | null;
  classification: GrammarClassification | null;
  warnings: string[];
  hasErrors: boolean;
}

const KIND_INFO: Record<GrammarKind, { label: string; description: string }> = {
  'right-linear': {
    label: 'Gramática regular — linear à direita',
    description:
      'Toda produção tem a forma A → wB ou A → w (w é uma sequência de terminais). Gramáticas assim geram exatamente as linguagens regulares.',
  },
  'left-linear': {
    label: 'Gramática regular — linear à esquerda',
    description:
      'Toda produção tem a forma A → Bw ou A → w (w é uma sequência de terminais). Também gera apenas linguagens regulares.',
  },
  'both-linear': {
    label: 'Gramática regular',
    description: 'Cada produção cabe nas duas formas lineares (A → w ou A → B).',
  },
  'not-regular': {
    label: 'Não é uma gramática regular',
    description: '', // o motivo vem de classification.reason
  },
};

export function GrammarSummary({ grammar, classification, warnings, hasErrors }: Props) {
  if (!grammar || !classification) {
    return (
      <div className={styles.box}>
        <span className={styles.empty}>
          {hasErrors
            ? 'Corrija as produções marcadas em vermelho para ver a verificação.'
            : 'Digite ao menos uma produção para começar.'}
        </span>
      </div>
    );
  }

  const isRegular = classification.kind !== 'not-regular';
  const info = KIND_INFO[classification.kind];
  const description = isRegular
    ? info.description
    : `${classification.reason ?? ''} Os testes abaixo continuam funcionando, mas esta gramática não está na forma regular.`;

  return (
    <div className={styles.box}>
      <div className={styles.productions}>
        {groupProductions(grammar).map(({ lhs, alternatives }) => (
          <div key={lhs}>
            {lhs}
            <span className={styles.arrow}>→</span>
            {alternatives.join(' | ')}
          </div>
        ))}
      </div>

      <div className={styles.verdict}>
        <span className={`${styles.badge} ${isRegular ? styles.regular : styles.notRegular}`}>
          {info.label}
        </span>
        <p className={styles.description}>{description}</p>
      </div>

      {warnings.length > 0 && (
        <ul className={styles.warnings}>
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
