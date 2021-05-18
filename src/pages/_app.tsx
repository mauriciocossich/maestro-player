// Arquivo global: fica envolta de todas as páginas

// css importado direto no componente, então vai aplicar o css no componente
import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/playerContext';

function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} /> {/* Component da rota */}
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp
