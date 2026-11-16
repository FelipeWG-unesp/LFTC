import type { Grammar, GrammarKind, GrammarRow, Production } from '../types';

/*
 * Convenção de notação (a mesma usada nos livros de LFTC):
 *  - letra maiúscula (A–Z)  -> não terminal
 *  - qualquer outro símbolo -> terminal (cada caractere é um símbolo)
 *  - "ε", "λ" ou vazio      -> cadeia vazia
 *  - "|" separa alternativas; espaços são ignorados
 */

const NONTERMINAL = /^[A-Z]$/;

export function isNonterminal(symbol: string): boolean {
  return NONTERMINAL.test(symbol);
}

// ---------------------------------------------------------------------------
// Interpretação das linhas digitadas pelo usuário
// ---------------------------------------------------------------------------

export interface GrammarParseResult {
  /** null quando não há produções ou quando alguma linha tem erro. */
  grammar: Grammar | null;
  /** Erros por linha (id da linha -> mensagem). Impedem o teste. */
  rowErrors: Record<string, string>;
  /** Avisos que não impedem o teste. */
  warnings: string[];
}

function parseAlternative(alternative: string): string[] {
  const cleaned = alternative.replace(/\s+/g, '').replace(/[ελ]/g, '');
  return Array.from(cleaned);
}

export function parseGrammar(rows: GrammarRow[]): GrammarParseResult {
  const rowErrors: Record<string, string> = {};
  const productions: Production[] = [];
  const seen = new Set<string>();
  let start: string | null = null;

  for (const row of rows) {
    const lhs = row.lhs.trim();

    // linha totalmente em branco: ignora
    if (lhs === '' && row.rhs.trim() === '') continue;

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

  const hasErrors = Object.keys(rowErrors).length > 0;
  if (hasErrors || start === null || productions.length === 0) {
    return { grammar: null, rowErrors, warnings: [] };
  }

  const defined = new Set(productions.map((p) => p.lhs));
  const undefinedSymbols = new Set<string>();
  for (const production of productions) {
    for (const symbol of production.rhs) {
      if (isNonterminal(symbol) && !defined.has(symbol)) undefinedSymbols.add(symbol);
    }
  }
  const warnings = Array.from(undefinedSymbols)
    .sort()
    .map((symbol) => `O não terminal ${symbol} é usado, mas não tem produções (nada deriva dele).`);

  return { grammar: { start, productions }, rowErrors, warnings };
}

// ---------------------------------------------------------------------------
// Informações para exibição
// ---------------------------------------------------------------------------

export interface ProductionGroup {
  lhs: string;
  alternatives: string[];
}

/** Agrupa as produções pelo lado esquerdo, na ordem em que aparecem: S → aS | b | ε */
export function groupProductions(grammar: Grammar): ProductionGroup[] {
  const groups = new Map<string, string[]>();
  for (const production of grammar.productions) {
    const body = production.rhs.length > 0 ? production.rhs.join('') : 'ε';
    const list = groups.get(production.lhs);
    if (list) list.push(body);
    else groups.set(production.lhs, [body]);
  }
  return Array.from(groups, ([lhs, alternatives]) => ({ lhs, alternatives }));
}

export function nonterminalsOf(grammar: Grammar): string[] {
  const set = new Set<string>();
  for (const production of grammar.productions) {
    set.add(production.lhs);
    for (const symbol of production.rhs) if (isNonterminal(symbol)) set.add(symbol);
  }
  return Array.from(set).sort();
}

export function terminalsOf(grammar: Grammar): string[] {
  const set = new Set<string>();
  for (const production of grammar.productions) {
    for (const symbol of production.rhs) if (!isNonterminal(symbol)) set.add(symbol);
  }
  return Array.from(set).sort();
}

// ---------------------------------------------------------------------------
// Classificação: a gramática tem a forma de uma gramática regular?
// ---------------------------------------------------------------------------

/** A → wB ou A → w  (w = sequência de terminais; no máximo um não terminal, e no fim) */
function isRightLinearBody(rhs: string[]): boolean {
  const nonterminals = rhs.filter(isNonterminal);
  if (nonterminals.length === 0) return true;
  return nonterminals.length === 1 && isNonterminal(rhs[rhs.length - 1]);
}

/** A → Bw ou A → w  (no máximo um não terminal, e no início) */
function isLeftLinearBody(rhs: string[]): boolean {
  const nonterminals = rhs.filter(isNonterminal);
  if (nonterminals.length === 0) return true;
  return nonterminals.length === 1 && isNonterminal(rhs[0]);
}

/**
 * Uma gramática é regular quando TODAS as produções são lineares à direita
 * ou TODAS são lineares à esquerda (misturar os dois lados pode gerar
 * linguagens que não são regulares).
 */
export function classifyGrammar(grammar: Grammar): GrammarKind {
  const right = grammar.productions.every((p) => isRightLinearBody(p.rhs));
  const left = grammar.productions.every((p) => isLeftLinearBody(p.rhs));
  if (right && left) return 'both-linear';
  if (right) return 'right-linear';
  if (left) return 'left-linear';
  return 'context-free';
}

// ---------------------------------------------------------------------------
// Reconhecimento de cadeias — algoritmo de Earley
// (aceita qualquer gramática livre de contexto: ambígua, recursiva à esquerda, com ε...)
// ---------------------------------------------------------------------------

interface Item {
  prod: number; // índice da produção
  dot: number; // posição do ponto dentro do corpo
  origin: number; // posição de entrada onde a derivação começou
}

function computeNullable(grammar: Grammar): Set<string> {
  const nullable = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const production of grammar.productions) {
      if (!nullable.has(production.lhs) && production.rhs.every((s) => nullable.has(s))) {
        nullable.add(production.lhs);
        changed = true;
      }
    }
  }
  return nullable;
}

/** Retorna true se a gramática gera exatamente a cadeia `input` (a cadeia vazia é permitida). */
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

  for (const index of byLhs.get(grammar.start) ?? []) {
    add(0, { prod: index, dot: 0, origin: 0 });
  }

  for (let k = 0; k <= n; k++) {
    // chart[k] pode crescer durante o laço, por isso o índice
    for (let i = 0; i < chart[k].length; i++) {
      const item = chart[k][i];
      const production = productions[item.prod];

      if (item.dot < production.rhs.length) {
        const symbol = production.rhs[item.dot];

        if (isNonterminal(symbol)) {
          // PREDIÇÃO
          for (const index of byLhs.get(symbol) ?? []) {
            add(k, { prod: index, dot: 0, origin: k });
          }
          // se o não terminal deriva ε, o ponto já pode avançar (Aycock–Horspool)
          if (nullable.has(symbol)) {
            add(k, { prod: item.prod, dot: item.dot + 1, origin: item.origin });
          }
        } else if (k < n && chars[k] === symbol) {
          // LEITURA
          add(k + 1, { prod: item.prod, dot: item.dot + 1, origin: item.origin });
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
            add(k, { prod: parent.prod, dot: parent.dot + 1, origin: parent.origin });
          }
        }
      }
    }
  }

  return chart[n].some((item) => {
    const production = productions[item.prod];
    return (
      production.lhs === grammar.start &&
      item.origin === 0 &&
      item.dot === production.rhs.length
    );
  });
}
