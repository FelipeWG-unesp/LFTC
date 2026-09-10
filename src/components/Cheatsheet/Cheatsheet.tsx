import styles from './Cheatsheet.module.css';

interface Entry {
  label: string;
  token: string;
}

const ENTRIES: Entry[] = [
  { label: 'Início da string', token: '^' },
  { label: 'Fim da string', token: '$' },
  { label: 'Qualquer dígito', token: '\\d' },
  { label: 'Qualquer letra/número/_', token: '\\w' },
  { label: 'Espaço em branco', token: '\\s' },
  { label: 'Qualquer caractere', token: '.' },
  { label: '0 ou mais', token: '*' },
  { label: '1 ou mais', token: '+' },
  { label: '0 ou 1', token: '?' },
  { label: 'Exatamente N vezes', token: '{n}' },
  { label: 'Entre N e M vezes', token: '{n,m}' },
  { label: 'Conjunto de caracteres', token: '[A-Z0-9]' },
  { label: 'Negação de conjunto', token: '[^abc]' },
  { label: 'Alternativa (ou)', token: 'a|b' },
  { label: 'Grupo de captura', token: '(abc)' },
];

export function Cheatsheet() {
  return (
    <details className={styles.details}>
      <summary>Referência rápida de regex</summary>
      <div className={styles.grid}>
        {ENTRIES.map(({ label, token }) => (
          <div key={token}>
            <span>{label}</span>
            <code>{token}</code>
          </div>
        ))}
      </div>
    </details>
  );
}
