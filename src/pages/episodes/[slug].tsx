import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import ptBR from 'date-fns/locale/pt-BR';
import { format, parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';

import { api } from '../../services/api';
import { usePlayer } from '../../contexts/playerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    publishedAt: string;
    durationAsString: string;
    url: string;
    description: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Maestro</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                //só utilizar esse conversor para html quando conhecer a base de dados
                dangerouslySetInnerHTML={{ __html: episode.description}}
            />
            
            {/*{episode.description}                  Não renderizou como html*/}
        </div>
    )
}
    
// método obrigatório em toda a rota que está usando geração estática (GetStaticProps) e
// que tem parâmetros dinâmicos (que têm couchete no nome do arquivo) [slug]
export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        // paths: [], quando fica vazio o next entende que não vou gerar de forma estática nenhum episódio no momento da build
        paths, // como no getStaticProps espera slug, preciso passar um slug aqui que está dentro de params
            // { // exemplo de uma página gerada de forma estática
            //     params: {
            //         slug: 'a-importancia-da-contribuicao-em-open-source'
            //     }
            // }

            // para ser mais performático posso pegar os 50 itens mais acessados e gerar a pág estática deles

        // fallback é o que determina o que acontece quando o browser acessa uma página de um episódio que
        // não foi gerado estaticamente
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    
    const { data } = await api.get(`/episodes/${slug}`)
    
    // formatação dos dados:
    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data. thumbnail,
        members: data.members,
        // alterou para publishedAt por ser informação alterada
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
        // Number() converteu para número
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, // 24 hours

    }
}