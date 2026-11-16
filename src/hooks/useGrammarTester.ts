import { useMemo, useState } from 'react';
import { GRAMMAR_EXAMPLES, type GrammarExample } from '../data/grammarExamples';
import type { GrammarRow, MatchStatus, TestCase } from '../types';
import { classifyGrammar, parseGrammar, recognize } from '../utils/grammar';

const MAX_TESTS = 5;

type RowPatch = Partial<Pick<GrammarRow, 'lhs' | 'rhs'>>;

const newId = (): string => crypto.randomUUID();
const blankRow = (): GrammarRow => ({ id: newId(), lhs: '', rhs: '' });
const rowsFrom = (source: GrammarExample['rows']): GrammarRow[] =>
  source.map((row) => ({ id: newId(), ...row }));
const testsFrom = (values: string[]): TestCase[] =>
  values.slice(0, MAX_TESTS).map((value) => ({ id: newId(), value }));

const DEFAULT_EXAMPLE = GRAMMAR_EXAMPLES[0];

export function useGrammarTester() {
  const [rows, setRows] = useState<GrammarRow[]>(() => rowsFrom(DEFAULT_EXAMPLE.rows));
  const [tests, setTests] = useState<TestCase[]>(() => testsFrom(DEFAULT_EXAMPLE.tests));

  const parsed = useMemo(() => parseGrammar(rows), [rows]);
  const classification = useMemo(
    () => (parsed.grammar ? classifyGrammar(parsed.grammar) : null),
    [parsed.grammar],
  );

  // ----- produções -----

  /** Insere uma linha em branco depois de `afterId` (ou no fim) e devolve o id dela. */
  function addRow(afterId?: string): string {
    const row = blankRow();
    setRows((prev) => {
      const index = afterId === undefined ? -1 : prev.findIndex((r) => r.id === afterId);
      if (index === -1) return [...prev, row];
      return [...prev.slice(0, index + 1), row, ...prev.slice(index + 1)];
    });
    return row.id;
  }

  function updateRow(id: string, patch: RowPatch): void {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeRow(id: string): void {
    setRows((prev) => {
      const next = prev.filter((row) => row.id !== id);
      return next.length > 0 ? next : [blankRow()];
    });
  }

  function loadExample(example: GrammarExample): void {
    setRows(rowsFrom(example.rows));
    setTests(testsFrom(example.tests));
  }

  function clearGrammar(): void {
    setRows([blankRow()]);
  }

  // ----- testes (mesmo padrão do testador de regex) -----

  function addTest(): void {
    setTests((prev) => {
      if (prev.length >= MAX_TESTS) return prev;
      return [...prev, { id: newId(), value: '' }];
    });
  }

  function updateTest(id: string, value: string): void {
    setTests((prev) => prev.map((test) => (test.id === id ? { ...test, value } : test)));
  }

  function removeTest(id: string): void {
    setTests((prev) => prev.filter((test) => test.id !== id));
  }

  /** A cadeia vazia (ε) é um teste válido; só fica "neutro" se a gramática ainda não está pronta. */
  function statusFor(value: string): MatchStatus {
    if (!parsed.grammar) return 'neutral';
    return recognize(parsed.grammar, value) ? 'pass' : 'fail';
  }

  return {
    rows,
    rowErrors: parsed.rowErrors,
    warnings: parsed.warnings,
    grammar: parsed.grammar,
    classification,
    addRow,
    updateRow,
    removeRow,
    loadExample,
    clearGrammar,
    tests,
    addTest,
    updateTest,
    removeTest,
    statusFor,
    MAX_TESTS,
  };
}
