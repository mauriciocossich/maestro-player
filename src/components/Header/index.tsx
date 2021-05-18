import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link'

import styles from './styles.module.scss';

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  });

  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <button type="button">
          <img src="/logo.svg" alt="Maestro" />
        </button>
      </Link>
      
      <p>O melhor amigo da família</p>

      <span>{currentDate}</span>
    </header>
  );
}
