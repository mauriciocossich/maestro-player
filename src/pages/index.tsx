// Arquivo da home

import { GetStaticProps } from 'next'; //tipagem da função: parâmetros e retorno.
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import { usePlayer } from '../contexts/playerContext';

import styles from './home.module.scss';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    publishedAt: string;
    durationAsString: string;
    url: string;
}

type HomeProps = { //tipagem das props de home, porque props fica any sem isso
  // recebe propriedade episodes
  // episodes: Array<Episode> // ou Episode[]; atualizamos para vir episódios separados
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}
// quando declara array na prototipagem tem que falar qual é o tipo}

export default function Home({ latestEpisodes, allEpisodes }:HomeProps) {
  const { playList } = usePlayer()

  // operador spread: ..., permite distribuir o conteúdo de qualquer objeto iterável em múltiplos
  // elementos. No caso será utilizado para combinar arrays.
  const episodeList = [...latestEpisodes, ...allEpisodes]

// map é utilizado para percorrer algo retornando algo, diferente do foreach que percorre sem retorno
  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Maestro</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            // por conta do .map que gera uma repetição no html,
            // tem que ter a key no primeiro elemento para o React poder editar apenas um elemento
            // se não ele teria que apagar tudo e recriar do zero, ex: quando excluir algum item
            return (
              <li key={episode.id}>
                {/* Componente image recebe a largura e altura que quero carregar a imagem*/}
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href ={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                {/* onClick={ play(episode) }> está errado porque o onClick deve receber
                como parâmetro uma função e não o retorno da função que seria esse caso*/}
                <button type="button" onClick = { () => playList(episodeList, index) }>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}

        </ul>
      </section>
      <section className={styles.allEpisodes}>
          <h2>Todas as músicas</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Música</th>
                <th>Autores</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                    <Image 
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                    </td> {/*representa cada coluna*/}
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="Tocar episódio" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
      {/*<p>{JSON.stringify(props.episodes)}</p> 
      <p>{new Date(props.episodes[0].published_at).toLocaleDateString}</p>
      Mas é melhor fazer a formatação antes dos dados chegarem no componente
      */}
      </div>
  )
}

// SSR - dentro de qualquer arquivo na pasta pages basta exportar a função getServerSideProps
// Então o Next já vai entender que precisa executar a função antes de exibir a página para o usuário

export const getStaticProps: GetStaticProps = async () => {
  // fetch api que vem dentro do browser e funciona bem, mas para aplicações grandes melhor axios
  // const response = await fetch('http://localhost:3333/episodes?_limit=12')
  // const data = await response.json()

  // axios consegue receber a url de base - http://localhost:3333/
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode. thumbnail,
      members: episode.members,
      // alterou para publishedAt por ser informação alterada
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      // Number() converteu para número
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, // tempo em segundos para gerar uma nova versão da página
  }
}