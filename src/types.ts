export interface RegexFlags {
  g: boolean;
  i: boolean;
  m: boolean;
  s: boolean;
}

export interface TestCase {
  id: string;
  value: string;
}

export type MatchStatus = 'pass' | 'fail' | 'neutral';

/** Ferramentas disponíveis na barra lateral. */
export type ToolId = 'regex' | 'grammar';

/** Uma linha do editor de gramática: "lhs → rhs" (o rhs pode ter várias alternativas separadas por "|"). */
export interface GrammarRow {
  id: string;
  lhs: string;
  rhs: string;
}

/** Uma produção já interpretada. Um corpo (rhs) vazio representa ε. */
export interface Production {
  lhs: string;
  rhs: string[];
}

export interface Grammar {
  start: string;
  productions: Production[];
}

export type GrammarKind = 'right-linear' | 'left-linear' | 'both-linear' | 'not-regular';

export interface GrammarClassification {
  kind: GrammarKind;
  /** Quando a gramática não é regular: o motivo, em português. */
  reason: string | null;
}