export interface GrammarExample {
  label: string;
  rows: { lhs: string; rhs: string }[];
  tests: string[];
}

export const GRAMMAR_EXAMPLES: GrammarExample[] = [
  {
    label: 'termina em ab',
    rows: [
      { lhs: 'S', rhs: 'aS | bS | aA' },
      { lhs: 'A', rhs: 'b' },
    ],
    tests: ['abab', 'aba', 'bbab'],
  },
  {
    label: '(ab)*',
    rows: [{ lhs: 'S', rhs: 'abS | ε' }],
    tests: ['', 'abab', 'aba'],
  },
  {
    label: 'aⁿbⁿ (não regular)',
    rows: [{ lhs: 'S', rhs: 'aSb | ε' }],
    tests: ['', 'aabb', 'aab', 'abab'],
  },
];
