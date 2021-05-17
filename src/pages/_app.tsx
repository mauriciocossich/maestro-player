// Arquivo global: fica envolta de todas as páginas

// css importado direto no componente, então vai aplicar o css no componente
import "../styles/global.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";

import styles from "../styles/app.module.scss";
import { PlayerContextPorivoder } from "../contexts/playerContext";

function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextPorivoder>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} /> {/* Component da rota */}
        </main>
        <Player />
      </div>
    </PlayerContextPorivoder>
  );
}

export default MyApp;
