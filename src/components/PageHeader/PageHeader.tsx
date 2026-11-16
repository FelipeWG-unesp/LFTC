import styles from './PageHeader.module.css';

interface Props {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: Props) {
  return (
    <header>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
}
