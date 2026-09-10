import type { RegexFlags } from '../types';

/** Converte o objeto de flags em uma string aceita pelo construtor RegExp, ex.: { g: true, i: true } -> "gi" */
export function flagsToString(flags: RegexFlags): string {
  return (Object.keys(flags) as (keyof RegexFlags)[]).filter((key) => flags[key]).join('');
}

export interface CompiledRegex {
  regex: RegExp | null;
  error: string | null;
}

/** Tenta compilar o padrão. Um padrão vazio não é um erro — apenas não há o que testar ainda. */
export function compileRegex(pattern: string, flags: RegexFlags): CompiledRegex {
  if (pattern === '') {
    return { regex: null, error: null };
  }
  try {
    return { regex: new RegExp(pattern, flagsToString(flags)), error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Expressão inválida';
    return { regex: null, error: message };
  }
}

/**
 * Testa um valor contra o padrão. Uma instância nova de RegExp é criada a cada
 * chamada para evitar o efeito colateral do `lastIndex` quando a flag "g" está
 * ativa e a mesma instância é reutilizada entre chamadas.
 */
export function testValue(pattern: string, flags: RegexFlags, value: string): boolean {
  const fresh = new RegExp(pattern, flagsToString(flags));
  return fresh.test(value);
}
