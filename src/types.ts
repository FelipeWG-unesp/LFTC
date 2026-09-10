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
