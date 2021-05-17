// Arquivo existe para não ter que carregar as fontes toda vez que troca de rota no app
// Só carrega uma vez - qualquer coisa que seja global
// Consegue configurar/customizar qual documento/formato do HTML que fica envolta da app

import Document, { Html, Head, Main, NextScript } from "next/document";

// Classe porque a documentação do next solicita esse padrão
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap"
            rel="stylesheet"
          />
          {/* <link rel="shortcut icon" href="/favicon.png" type="image/png" /> */}
        </Head>
        {/* tag html então início minúsculo */}
        <body>
          {/* Main é onde vai ficar a aplicação */}
          <Main />
          {/* São os scripts que o next precisa injetar na aplicação */}
          <NextScript />
        </body>
      </Html>
    );
  }
}
