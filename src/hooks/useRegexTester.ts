import { useMemo, useState } from 'react';
import type { MatchStatus, RegexFlags, TestCase } from '../types';
import { compileRegex, testValue } from '../utils/regex';

const INITIAL_FLAGS: RegexFlags = { g: false, i: false, m: false, s: false };

function createTest(value: string): TestCase {
  return { id: crypto.randomUUID(), value };
}

const INITIAL_TESTS: TestCase[] = [createTest('A0C4G4'), createTest('a1b2c3')];

export function useRegexTester() {
  const [pattern, setPattern] = useState('^([A-Z][0-9]){3}$');
  const [flags, setFlags] = useState<RegexFlags>(INITIAL_FLAGS);
  const [tests, setTests] = useState<TestCase[]>(INITIAL_TESTS);

  const { error } = useMemo(() => compileRegex(pattern, flags), [pattern, flags]);

  function toggleFlag(flag: keyof RegexFlags): void {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }

  function addTest(): void {
    setTests((prev) => [...prev, createTest('')]);
  }

  function updateTest(id: string, value: string): void {
    setTests((prev) => prev.map((test) => (test.id === id ? { ...test, value } : test)));
  }

  function removeTest(id: string): void {
    setTests((prev) => prev.filter((test) => test.id !== id));
  }

  function statusFor(value: string): MatchStatus {
    if (error || pattern === '' || value === '') return 'neutral';
    return testValue(pattern, flags, value) ? 'pass' : 'fail';
  }

  return {
    pattern,
    setPattern,
    flags,
    toggleFlag,
    tests,
    addTest,
    updateTest,
    removeTest,
    error,
    statusFor,
  };
}
