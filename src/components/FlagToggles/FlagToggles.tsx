import type { RegexFlags } from '../../types';
import styles from './FlagToggles.module.css';

interface Props {
  flags: RegexFlags;
  onToggle: (flag: keyof RegexFlags) => void;
}

interface FlagInfo {
  key: keyof RegexFlags;
  title: string;
}

const FLAG_INFO: FlagInfo[] = [
  { key: 'g', title: 'global — encontra todas as ocorrências' },
  { key: 'i', title: 'ignora maiúsculas/minúsculas' },
  { key: 'm', title: 'multilinha: ^ e $ por linha' },
  { key: 's', title: 'ponto (.) também casa quebras de linha' },
];

export function FlagToggles({ flags, onToggle }: Props) {
  return (
    <div className={styles.flags}>
      {FLAG_INFO.map(({ key, title }) => (
        <button
          key={key}
          type="button"
          title={title}
          className={`${styles.btn} ${flags[key] ? styles.on : ''}`}
          onClick={() => onToggle(key)}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
