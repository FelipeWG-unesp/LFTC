import type { Grammar, GrammarKind } from '../../types';
import { groupProductions, nonterminalsOf, terminalsOf } from '../../utils/grammar';
import styles from './GrammarSummary.module.css';

interface Props {
  grammar: Grammar | null;
  kind: GrammarKind | null;
  warnings: string[];
  hasErrors: boolean;
}

interface KindInfo {
  label: string;
  description: string;
  regular: boolean;
}

const KIND_INFO: Record<GrammarKind, KindInfo> = {
  'right-linear': {
    label: 'Gramática regular — linear à direita',
    description:
      'Toda produção tem a forma A → wB ou A → w (w é uma sequência de terminais). Gramáticas assim geram exatamente as linguagens regulares.',
    regular: true,
  },
  'left-linear': {
    label: 'Gramática regular — linear à esquerda',
    description:
      'Toda produção tem a forma A → Bw ou A → w (w é uma sequência de terminais). Também gera apenas linguagens regulares.',
    regular: true,
  },
  'both-linear': {
    label: 'Gramática regular — cabe nas duas formas',
    description:
      'Cada produção é da forma A → w ou A → B, o que serve tanto à forma linear à direita quanto à esquerda.',
    regular: true,
  },
  'context-free': {
    label: 'Livre de contexto — fora da forma regular',
    description:
      'Há produções com mais de um não terminal, com o não terminal no meio, ou que misturam lados (direita e esquerda). A linguagem gerada ainda pode ser regular, mas a gramática não está na forma regular.',
    regular: false,
  },
};

export function GrammarSummary({ grammar, kind, warnings, hasErrors }: Props) {
  if (!grammar || !kind) {
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

  const info = KIND_INFO[kind];
  const badgeClass = `${styles.badge} ${info.regular ? styles.regular : styles.contextFree}`;
  const nonterminals = nonterminalsOf(grammar);
  const terminals = terminalsOf(grammar);

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

      <div className={styles.meta}>
        <span>
          símbolo inicial: <code>{grammar.start}</code>
        </span>
        <span>
          não terminais: <code>{nonterminals.join(', ')}</code>
        </span>
        <span>
          terminais: <code>{terminals.length > 0 ? terminals.join(', ') : '—'}</code>
        </span>
      </div>

      <div className={styles.kind}>
        <span className={badgeClass}>{info.label}</span>
        <p className={styles.description}>{info.description}</p>
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
