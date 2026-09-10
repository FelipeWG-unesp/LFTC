import type { MatchStatus } from '../../types';

interface Props {
  status: MatchStatus;
}

const SHARED_PROPS = {
  viewBox: '0 0 24 24',
  width: 16,
  height: 16,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function StatusIcon({ status }: Props) {
  if (status === 'pass') {
    return (
      <svg {...SHARED_PROPS} role="img" aria-label="Corresponde à expressão">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }

  if (status === 'fail') {
    return (
      <svg {...SHARED_PROPS} role="img" aria-label="Não corresponde à expressão">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }

  return (
    <svg {...SHARED_PROPS} role="img" aria-label="Ainda sem resultado">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
