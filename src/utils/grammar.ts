import type {
  Grammar,
  GrammarClassification,
  GrammarRow,
  Production,
} from '../types';

/*
 * Notação (a mesma dos livros de LFTC):
 *  - letra maiúscula (A–Z)  -> não terminal
 *  - qualquer outro símbolo -> terminal (cada caractere é um símbolo)
 *  - "ε", "λ" ou vazio      -> cadeia vazia
 *  - "|" separa alternativas; espaços são ignorados
 */

export function isNonterminal(symbol: string): boolean {
  return /^[A-Z]$/.test(symbol);
}

// ---------------------------------------------------------------------------
// 1) Interpretar as linhas digitadas
// ---------------------------------------------------------------------------

export interface GrammarParseResult {
  /** null quando não há produções ou alguma linha tem erro. */
  grammar: Grammar | null;
  /** id da linha -> mensagem de erro. */
  rowErrors: Record<string, string>;
  /** Avisos que não impedem o teste. */
  warnings: string[];
}

function parseAlternative(alternative: string): string[] {
  return Array.from(alternative.replace(/\s+/g, '').replace(/[ελ]/g, ''));
}

export function parseGrammar(rows: GrammarRow[]): GrammarParseResult {
  const rowErrors: Record<string, string> = {};
  const productions: Production[] = [];
  const seen = new Set<string>();
  let start: string | null = null;

  for (const row of rows) {
    const lhs = row.lhs.trim();
    if (lhs === '' && row.rhs.trim() === '') continue; // linha em branco

    if (lhs === '') {
      rowErrors[row.id] = 'Preencha o não terminal à esquerda.';
      continue;
    }
    if (!isNonterminal(lhs)) {
      rowErrors[row.id] = 'O não terminal deve ser uma única letra maiúscula (A–Z).';
      continue;
    }

    if (start === null) start = lhs;

    for (const alternative of row.rhs.split('|')) {
      const rhs = parseAlternative(alternative);
      const key = `${lhs}→${rhs.join('')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      productions.push({ lhs, rhs });
    }
  }

  if (Object.keys(rowErrors).length > 0 || start === null || productions.length === 0) {
    return { grammar: null, rowErrors, warnings: [] };
  }

  const defined = new Set(productions.map((p) => p.lhs));
  const missing = new Set<string>();
  for (const production of productions) {
    for (const symbol of production.rhs) {
      if (isNonterminal(symbol) && !defined.has(symbol)) missing.add(symbol);
    }
  }
  const warnings = Array.from(missing)
    .sort()
    .map((symbol) => `O não terminal ${symbol} é usado, mas não tem produções (nada deriva dele).`);

  return { grammar: { start, productions }, rowErrors, warnings };
}

// ---------------------------------------------------------------------------
// 2) Informações para exibir
// ---------------------------------------------------------------------------

export interface ProductionGroup {
  lhs: string;
  alternatives: string[];
}

function bodyText(rhs: string[]): string {
  return rhs.length > 0 ? rhs.join('') : 'ε';
}

/** Agrupa pelo lado esquerdo, na ordem em que aparecem: S → aS | b | ε */
export function groupProductions(grammar: Grammar): ProductionGroup[] {
  const groups = new Map<string, string[]>();
  for (const { lhs, rhs } of grammar.productions) {
    const list = groups.get(lhs);
    if (list) list.push(bodyText(rhs));
    else groups.set(lhs, [bodyText(rhs)]);
  }
  return Array.from(groups, ([lhs, alternatives]) => ({ lhs, alternatives }));
}

// ---------------------------------------------------------------------------
// 3) É uma gramática regular?
// ---------------------------------------------------------------------------

/** A → wB ou A → w (w = terminais; no máximo um não terminal, e só no fim) */
function isRightLinear(rhs: string[]): boolean {
  const count = rhs.filter(isNonterminal).length;
  return count === 0 || (count === 1 && isNonterminal(rhs[rhs.length - 1]));
}

/** A → Bw ou A → w (no máximo um não terminal, e só no começo) */
function isLeftLinear(rhs: string[]): boolean {
  const count = rhs.filter(isNonterminal).length;
  return count === 0 || (count === 1 && isNonterminal(rhs[0]));
}

/**
 * Regular = TODAS as produções lineares à direita, ou TODAS lineares à esquerda.
 * (Misturar os dois lados pode gerar linguagens que não são regulares.)
 */
export function classifyGrammar(grammar: Grammar): GrammarClassification {
  const { productions } = grammar;
  const right = productions.every((p) => isRightLinear(p.rhs));
  const left = productions.every((p) => isLeftLinear(p.rhs));

  if (right && left) return { kind: 'both-linear', reason: null };
  if (right) return { kind: 'right-linear', reason: null };
  if (left) return { kind: 'left-linear', reason: null };

  const offender = productions.find((p) => !isRightLinear(p.rhs) && !isLeftLinear(p.rhs));
  const reason = offender
    ? `A produção ${offender.lhs} → ${bodyText(offender.rhs)} não é linear: tem mais de um não terminal ou um não terminal no meio do corpo.`
    : 'A gramática mistura produções lineares à direita (A → aB) e à esquerda (A → Ba). Todas precisam ser do mesmo lado.';
  return { kind: 'not-regular', reason };
}

// ---------------------------------------------------------------------------
// 4) Reconhecer cadeias — algoritmo de Earley
//    (aceita qualquer gramática livre de contexto: ambígua, recursiva à esquerda, com ε…)
// ---------------------------------------------------------------------------

interface Item {
  prod: number; // índice da produção
  dot: number; // posição do ponto no corpo
  origin: number; // posição da entrada onde a derivação começou
}

function computeNullable(grammar: Grammar): Set<string> {
  const nullable = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const { lhs, rhs } of grammar.productions) {
      if (!nullable.has(lhs) && rhs.every((s) => nullable.has(s))) {
        nullable.add(lhs);
        changed = true;
      }
    }
  }
  return nullable;
}

/** true se a gramática gera exatamente `input` (a cadeia vazia é permitida). */
export function recognize(grammar: Grammar, input: string): boolean {
  const chars = Array.from(input);
  const n = chars.length;
  const { productions } = grammar;

  const byLhs = new Map<string, number[]>();
  productions.forEach((production, index) => {
    const list = byLhs.get(production.lhs);
    if (list) list.push(index);
    else byLhs.set(production.lhs, [index]);
  });
  const nullable = computeNullable(grammar);

  const chart: Item[][] = Array.from({ length: n + 1 }, () => []);
  const seen: Set<string>[] = Array.from({ length: n + 1 }, () => new Set<string>());
  const add = (k: number, item: Item): void => {
    const key = `${item.prod}|${item.dot}|${item.origin}`;
    if (seen[k].has(key)) return;
    seen[k].add(key);
    chart[k].push(item);
  };

  for (const index of byLhs.get(grammar.start) ?? []) add(0, { prod: index, dot: 0, origin: 0 });

  for (let k = 0; k <= n; k++) {
    for (let i = 0; i < chart[k].length; i++) {
      // chart[k] pode crescer durante o laço
      const item = chart[k][i];
      const production = productions[item.prod];

      if (item.dot < production.rhs.length) {
        const symbol = production.rhs[item.dot];
        if (isNonterminal(symbol)) {
          // PREDIÇÃO
          for (const index of byLhs.get(symbol) ?? []) add(k, { prod: index, dot: 0, origin: k });
          // se o não terminal deriva ε, o ponto já pode avançar (Aycock–Horspool)
          if (nullable.has(symbol)) add(k, { ...item, dot: item.dot + 1 });
        } else if (k < n && chars[k] === symbol) {
          // LEITURA
          add(k + 1, { ...item, dot: item.dot + 1 });
        }
      } else {
        // COMPLETAMENTO
        const waiting = chart[item.origin];
        for (let j = 0; j < waiting.length; j++) {
          const parent = waiting[j];
          const parentProduction = productions[parent.prod];
          if (
            parent.dot < parentProduction.rhs.length &&
            parentProduction.rhs[parent.dot] === production.lhs
          ) {
            add(k, { ...parent, dot: parent.dot + 1 });
          }
        }
      }
    }
  }

  return chart[n].some((item) => {
    const { lhs, rhs } = productions[item.prod];
    return lhs === grammar.start && item.origin === 0 && item.dot === rhs.length;
  });
}