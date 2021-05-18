import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void; // função que recebe um episode sem retorno
    playList: (list: Episode[], index:number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
};

type PlayerContextProviderProps = {
    // Qualquer coisa que o React aceitaria como conteúdo de um JSX - ex tags html
    children: ReactNode;
}

// Dentro do parênteses apenas mostra qual o formato dos dados do contexto
export const PlayerContext = createContext( {} as PlayerContextData); 

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  // Estados:
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0); // forçar valor para zero caso ainda não esteja
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  // Função destinada a ouvir o play/pause que vem dos teclados modernos
  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {
    if (isShuffling) {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }      
  }

  function playPrevious() {
      if (hasPrevious) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
  }

  // A funcionalidade do player ficou toda aqui, porque aqui temos acesso ao Provider
  // Que é onde passamos todos os métodos, mas isso só é válido porque só tem o contexto do player
  return (
    <PlayerContext.Provider 
        value={{
            episodeList, 
            currentEpisodeIndex, 
            play,
            playList,
            playNext,
            playPrevious,
            isPlaying,
            isLooping,
            isShuffling,
            setPlayingState,
            hasNext,
            hasPrevious,
            togglePlay, 
            toggleLoop,
            toggleShuffle,
            clearPlayerState
        }}
    >
        {children} {/*Repassa todo conteúdo passado no app para dentro da tag aqui*/}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}