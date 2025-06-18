# Projeto E-commerce Devnology

Este `README` detalha o Projeto E-commerce Devnology, suas funcionalidades, decisões técnicas e como executá-lo.

---

## Descrição do Projeto

O E-commerce Devnology integra frontend e backend para consumir e normalizar dados de múltiplas APIs de produtos.

No **backend**, um serviço NestJS com MongoDB busca, normaliza e persiste produtos de duas APIs externas. Ele expõe endpoints para listar produtos e finalizar pedidos.

No **frontend**, a aplicação React gerencia a navegação (Home, Produtos, Detalhes, Carrinho, Checkout) via `react-router-dom` e o estado do carrinho com `CartContext`. Adicionei um painel administrativo simples para visualização de pedidos.

---

## Status do Projeto

Projeto **Concluído** para fins de desafio técnico, com as funcionalidades essenciais implementadas e testadas. Pronto para ser executado localmente.

---

## Funcionalidades e Demonstração da Aplicação

* `Listagem de Produtos`: Exibição de produtos normalizados, provenientes de duas APIs externas, com detalhes como nome, descrição, preço e categoria.
* `Detalhes do Produto`: Visualização aprofundada de um produto específico ao clicar em seu card, mostrando todas as informações disponíveis e úteis para o usuário.
* `Carrinho de Compras`: Funcionalidade de adicionar, remover e ajustar a quantidade de produtos no carrinho, com cálculo dinâmico do total.
* `Processo de Checkout`: Fluxo completo de finalização de compra, coletando dados básicos para simular um pedido.
* `Painel Administrativo Básico`: Uma interface simples (com login `admin`/`admin123`) para visualizar os pedidos finalizados e persistidos no backend. O link/botão de administrador no header está visível apenas para facilitar a análise do teste e demonstrar a persistência dos dados; em um ambiente de produção, ele seria acessível apenas para usuários autorizados.
* `Filtro por Categoria (Frontend)`: Opção de filtrar produtos por categorias através de um dropdown, adaptado à natureza dos dados externos.
* `Normalização de Dados (Backend)`: Processo robusto no backend para unificar e padronizar dados de produtos vindos de fontes com estruturas heterogêneas.
* `Deduplicação de Produtos (Backend)`: Lógica implementada para garantir a unicidade dos produtos persistidos, mesmo com IDs sobrepostos entre diferentes fornecedores.

---

## Acesso ao Projeto

Para executar este projeto localmente, siga os passos abaixo:

* **Pré-requisitos:** Certifique-se de ter **Node.js** e **npm** (ou Yarn) instalados em sua máquina.
* **Clonar e Navegar:** Clone o repositório (https://github.com/hubertbrito/ecommerce-devnology.git) e navegue para a pasta do projeto (`cd devnology-ecommerce`).
* **Configurar e Iniciar o Backend:** Navegue até a pasta `backend` (`cd backend`), instale as dependências (`npm install`), crie um arquivo `.env` na raiz da pasta `backend` - Configuração do Banco de Dados
Para a persistência de dados do backend, utilizamos o MongoDB Atlas (Free Tier).
Você precisará criar um cluster no MongoDB Atlas. Dentro do seu banco de dados, a aplicação utiliza as coleções products (para armazenar produtos) e orders (para registrar os pedidos).
A string de conexão do MongoDB Atlas deve ser configurada em um arquivo .env na raiz da pasta backend/ (ex: MONGODB_URI="sua_string_de_conexao").(`MONGODB_URI=sua_string_de_conexao_mongodb_atlas`). Em seguida, inicie o servidor de desenvolvimento com `npm run start:dev`. Ele rodará em `http://localhost:3000` e populará o banco de dados.
* **Configurar e Iniciar o Frontend:** Em um novo terminal, navegue até a pasta `frontend` do projeto (`cd ../frontend`), instale as dependências (`npm install`). Por fim, inicie o aplicativo React com `npm run dev`. Ele estará disponível em `http://localhost:5173`.

Após seguir esses passos, acesse `http://localhost:5173` no seu navegador. Para o painel administrativo, vá em `http://localhost:5173/admin-login` (usuário: `admin`, senha: `admin123`).

---

## Tecnologias Utilizadas

### Backend

* **Node.js**: Ambiente de execução.
* **NestJS**: Framework para construção da API RESTful.
* **TypeScript**: Linguagem de desenvolvimento.
* **MongoDB (com Mongoose)**: Banco de dados NoSQL para persistência de dados.
* **Axios**: Cliente HTTP para requisições a APIs externas.
* **RxJS**: Para tratamento de Observables em requisições assíncronas.
* **npm**: Gerenciador de pacotes.

### Frontend

* **React**: Biblioteca para construção da interface de usuário.
* **TypeScript**: Linguagem de desenvolvimento.
* **Vite**: Ferramenta de build para projetos React.
* **React Router DOM**: Para roteamento de SPA.
* **Context API**: Para gerenciamento de estado global (Carrinho).
* **Axios**: Cliente HTTP para comunicação com o backend.
* **npm**: Gerenciador de pacotes.

---

## Decisões Técnicas e a Jornada de Desenvolvimento: Investigação e Raciocínio

Minha abordagem foi pragmática, focando em entregar os requisitos essenciais com qualidade, sempre atento ao escopo e cronograma de um desafio técnico. As decisões de arquitetura e organização de código foram cruciais para a manutenibilidade e escalabilidade do projeto.

### Backend: Desafios de Integração e Persistência

Utilizei **NestJS** e **TypeScript** (para tipagem rigorosa), com **MongoDB** (flexibilidade de esquema para dados heterogêneos) e `npm`. A estrutura do backend seguiu um padrão modular, com organização em **módulos, serviços, controladores e DTOs**.

O projeto utiliza o **MongoDB Atlas**, com um **único cluster** chamado `cluster0` e um **único banco de dados** chamado `devnology-ecommerce`. Dentro desse banco de dados, existem **duas coleções**:

* **`products`**: Para persistir os produtos. A persistência dos produtos foi uma decisão estratégica para garantir:

    * **Normalização e Limpeza de Dados:** As APIs externas tinham inconsistências. A persistência permite limpar, padronizar e deduzir os dados.
    * **Performance:** Carregamento rápido dos produtos para o frontend, buscando do nosso banco, e não das APIs externas.
    * **Disponibilidade:** Mesmo que uma das APIs externas estivesse fora do ar, teríamos os produtos no nosso banco.
    * **Escalabilidade Futura:** Abre portas para funcionalidades como busca avançada e filtros complexos.
* **`orders`**: Para persistir os pedidos finalizados pelos usuários, permitindo o histórico de compras no painel administrativo.

#### Problemas e Minhas Soluções Diretas

* **Tipagem Mongoose/TypeScript:** Propriedades como `string | null` geravam erros de inferência de tipo no Mongoose. Resolvi isso explicitando o tipo BSON via `@Prop({ type: () => String })` no schema.
* **Falha na População de Produtos (Duplicidade):** Ocorreu um erro `E11000 duplicate key` ao popular produtos europeus devido a IDs sobrepostos entre fornecedores. A solução foi **remover manualmente o índice `supplierProductId_1` no MongoDB Atlas**, permitindo a inserção dos 143 produtos únicos.
* **Consumo de APIs Assíncronas:** Adaptei o `HttpService` do NestJS, trocando o `.toPromise()` depreciado por `lastValueFrom` com `pipe(map())` para um fluxo de dados moderno e tipado.

### Frontend: Arquitetura Orientada a Componentes e Escopo Definido

Construído com **React**, `react-router-dom` e **Axios** para requisições. A organização do frontend seguiu uma estrutura clara com pastas para **páginas (`pages`)** e **componentes reutilizáveis (`components`)**. O estado do carrinho é gerenciado através de um **contexto (`CartContext`)** localizado em uma pasta `context`. **Interfaces e tipos** foram definidos diretamente nos arquivos onde são utilizados, o que otimiza a clareza e a coesão para o **tamanho atual do projeto**. Em aplicações de maior escala, eu optaria por uma arquitetura com módulos de tipos globais ou por domínio, para uma gestão centralizada e mais eficiente da tipagem. O fluxo de usuário essencial (Página de Produtos -> Adicionar ao Carrinho -> Página do Carrinho -> Finalizar Compra -> Página de Checkout) foi totalmente implementado, e adicionei um painel administrativo básico.

#### Desafios e Escolhas Estratégicas

* **Inconsistência de Dados da API Externa:** Os dados dos produtos (nome, descrição, categoria) eram logicamente incoerentes. Optei por uma filtragem **exclusivamente por categoria** via dropdown, adaptando a funcionalidade à realidade dos dados e demonstrando pragmatismo.
* **Gestão de Escopo:** Para este desafio, priorizei a entrega dos requisitos centrais com robustez e dentro do cronograma. Conscientemente, **contive implementações** como autenticação JWT para usuários e administradores (essencial para persistir carrinhos e gerenciar acessos), e cadastro de clientes. Essa decisão estratégica reflete a capacidade de focar no essencial para um teste técnico, mantendo o código conciso e preparado para futuras expansões sem comprometer a entrega.
