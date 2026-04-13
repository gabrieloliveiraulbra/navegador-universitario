# Campus Route Visualizer

Uma aplicação web interativa desenvolvida para visualizar e ensinar o funcionamento de algoritmos clássicos de busca em grafos. O projeto utiliza um mapa de campus universitário como cenário para demonstrar como computadores calculam as melhores rotas entre diferentes complexos e salas.

## Funcionalidades

* **Simulação em Tempo Real:** Visualize o passo a passo da exploração de cada algoritmo.
* **Múltiplos Algoritmos:**
    * **BFS (Busca em Largura):** Encontra o caminho com menos conexões.
    * **DFS (Busca em Profundidade):** Explora caminhos exaustivamente até o fim.
    * **Dijkstra:** Garante o caminho mais rápido com base no tempo de caminhada.
    * **A\* (A-Estrela):** Otimização do Dijkstra usando heurística de distância euclidiana.
* **Controle Dinâmico:** Ajuste a velocidade da animação e alterne os pontos de origem e destino diretamente no mapa ou pelo painel.
* **Log de Eventos:** Feedback textual detalhado sobre as decisões tomadas pelo algoritmo (ex: "Visitando nó X", "Calculando heurística", "Retrocedendo").
* **Visualização de Pesos:** Exibição clara do tempo de deslocamento (custo) entre os nós.

## Tecnologias Utilizadas

* **Frontend:** React 18 com TypeScript para tipagem estática e segurança.
* **Estilização:** Tailwind CSS v4 para uma interface moderna e responsiva.
* **Bundler:** Vite para um ambiente de desenvolvimento ultrarrápido.
* **Estrutura de Dados:** Grafos ponderados e listas de adjacência.

## Estrutura do Projeto

* `/src/algorithms`: Implementação pura dos algoritmos de busca.
* `/src/data`: Definição do grafo do campus (nós, coordenadas e arestas).
* `/src/components`: Componentes de interface (Canvas do Grafo, Painel de Controle, Logs).
* `/src/types.ts`: Interfaces e tipos centrais da aplicação.
* `/src/graphUtils.ts`: Funções auxiliares matemáticas (Distância Euclidiana, Adjacência).

## Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/campus-visualizer.git](https://github.com/seu-usuario/campus-visualizer.git)
   cd campus-visualizer
   ```
2. **Instale as dependências:**
  ```bash
   npm install
   ```
3. **Inicie o servidor de desenvolvimento:**
  ```bash
   npm run dev
   ```
4. **Acesse no navegador:**
Abra o endereço exibido no terminal (geralmente http://localhost:5173).
