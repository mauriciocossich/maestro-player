//hook/função do react de efeitos colaterais
// quando algo alterar, quero que algo aconteça, monitoramento. Existem várias biblios de side effect
import { useEffect } from "react" //usa no SPA


export default function Home(props) {
// SPA os dados são carregados apenas no momento em que a pessoa acessa a tela da aplicação
// Estratégia não serve para os crowlers, porque o crowler não aguarda a requisição
// é só desativar o javascript para ver o que o crowler ve no site, pq o js roda no browser com delay
// o problema é que assim que a página é mostrada para o usuário as informações ainda não estão prontas.
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
    .then(response => response.json())
    .then(data => console.log(data))
  }, [])  // se couchetes vazio, vai disparar apenas na abertura do app assim que o componente for exibido
  
  
  return (
    <h1>Index</h1>
  )
}