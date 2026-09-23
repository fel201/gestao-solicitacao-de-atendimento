# Solicitações de Atendimento

Aplicação para cadastrar e acompanhar solicitações de atendimento a unidades públicas. O frontend React consome uma API Laravel, responsável pelas regras de negócio e pela persistência no PostgreSQL.

## Tecnologias

### Backend

| Tecnologia | Versão definida no projeto | Uso |
| --- | --- | --- |
| PHP | `^8.3` (imagem 8.3 Alpine) | Execução do backend |
| Laravel | `^11.0` (11.56.1 no `composer.lock`) | API REST, Eloquent e migrations |
| PostgreSQL | 16, imagem Alpine | Banco de dados principal da aplicação |
| Collision | `^8.0` (8.9.5 no `composer.lock`) | Exibição de erros no console |
| PHPUnit | `^11.0` (11.5.56 no `composer.lock`) | Testes de backend |
| SQLite | Extensão `pdo_sqlite` do PHP | Banco em memória utilizado apenas em conjunto com o PHPUnit para executar os testes |
| Mockery | `^1.6` (1.6.15 no `composer.lock`) | Criação de mocks nos testes |

### Frontend

| Tecnologia | Versão definida no projeto | Uso |
| --- | --- | --- |
| React | `^18.3.1` | Interface e componentes |
| React DOM | `^18.3.1` | Renderização da aplicação no navegador |
| TypeScript | `^5.6.2` | Tipagem do frontend e dos contratos da API |
| React Router | `^7.18.4` | Navegação entre listagem, cadastro e detalhes |
| Vite | `^5.4.10` | Servidor de desenvolvimento e build |
| Plugin React para Vite | `^4.3.1` | Integração do React com o Vite |
| Tailwind CSS | `^3.4.7` | Estilos e adaptação do layout a diferentes telas |
| Tailwind CSS Forms | `^0.5.4` | Estilização básica dos campos de formulário |
| PostCSS | `^8.4.27` | Processamento dos estilos |
| Autoprefixer | `^10.4.14` | Compatibilidade dos estilos entre navegadores |
| Vitest | `^2.1.9` | Execução dos testes do frontend |
| React Testing Library | `^16.3.3` | Testes dos componentes React |
| Testing Library Jest DOM | `^6.9.1` | Asserções para elementos do DOM |
| Testing Library User Event | `^14.6.7` | Simulação das interações do usuário |
| jsdom | `^25.0.1` | Ambiente de navegador para os testes |
| Node.js | 20, imagem Alpine | Execução das ferramentas do frontend |

Docker Compose V2 executa os serviços de forma integrada.

O cliente HTTP utiliza `fetch`, nativo do navegador. React Router atende à navegação entre as rotas do sidebar esquerdo e visualização de detalhes de uma solicitação; Tailwind e o plugin de formulários ajudam na organização e estilização de cada componente, também evitando que o código fique cheio de arquivos CSS.

## Funcionalidades implementadas

- Cadastro com nome, categoria, prioridade, descrição e justificativa de urgência, validando tipos e o limite de 255 caracteres do nome antes da persistência.
- Protocolo automático no formato `APT-` seguido de dez caracteres alfanuméricos, com restrição de unicidade no banco.
- Listagem com 15 registros por página, paginação com campos em português e filtros combináveis por status, categoria e prioridade.
- Resumo por status considerando todos os registros que correspondem aos filtros, independentemente da página.
- Consulta de detalhes e atualização de status com confirmação na interface.
- Carga inicial de 24 solicitações fictícias feita com seeder, com categorias, prioridades e status variados para demonstrar filtros e paginação.

## Limitações

- Não há sistema de autenticação e autorização na aplicação
- Não tem um sistema de lock que possa impedir que usuários façam atualizações simultâneas numa determinada solicitação. Por exemplo, se duas pessoas atualizarem a mesma solicitação ao mesmo tempo, a ultima gravação pode sobrescrever a primeira.

## Execução local com Docker Compose

### Pré-requisitos

- Docker Engine ou Docker Desktop em execução.
- Docker Compose V2, acessível pelo comando `docker compose`.

### 1. Preparando as variáveis de ambiente

Em um clone novo, copie os arquivos de exemplo da raiz e do `backend/`:

**PowerShell:**

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
```

**Linux/macOS:**

```sh
cp .env.example .env
cp backend/.env.example backend/.env
```


O comando `docker compose` lê o `.env` da raiz do projeto ao processar o arquivo `docker-compose.yml`. Ele configura a imagem do banco de dados com as informações das variáveis DB_* e envia ao backend somente as variáveis declaradas em `environment:` nesse arquivo.

#### `.env.example` da raiz do projeto

| Configuração | Valor local | Observação |
| --- | --- | --- |
| `APP_ENV` | `local` | Enviada ao backend pelo comando `docker compose` |
| `APP_DEBUG` | `false` | Enviada ao backend pelo comando `docker compose`; mantém desativada a exibição detalhada de erros |
| `DB_DATABASE` | `solicitacao_atendimento` | Nome do banco criado pelo serviço PostgreSQL e usado pelo backend |
| `DB_USERNAME` | `postgres` | Usuário demonstrativo enviado ao PostgreSQL e ao backend |
| `DB_PASSWORD` | `postgres` | Senha demonstrativa enviada ao PostgreSQL e ao backend, altere em outros ambientes |
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Lida pelo comando `docker compose` e enviada ao frontend |

O .env da pasta backend é lido pelo Laravel e serve para configurar e conectar ao banco de dados PostgreSQL da imagem, e alterar algumas informações de desenvolvimento.

#### `backend/.env.example`

| Configuração | Valor local | Observação |
| --- | --- | --- |
| `APP_NAME` | `Solicitação de Atendimento` | Nome da aplicação na configuração do Laravel |
| `APP_KEY` | Vazia no exemplo por segurança | É gerada localmente pelo comando de execução seguinte |
| `LOG_STACK` | `stderr` | Direciona os logs para a saída do contêiner, visível com `docker compose logs backend` |
| `DB_CONNECTION` | `pgsql` | Conexão PostgreSQL |
| `DB_HOST` | `db` | Host do banco da imagem |
| `DB_PORT` | `5432` | Porta interna do banco da imagem |
| `DB_DATABASE` | `solicitacao_atendimento` | Nome do banco de dados da imagem |
| `DB_USERNAME` | `postgres` | Usuário do banco de dados PostgreSQL da imagem |
| `DB_PASSWORD` | `postgres` | Senha do banco de dados PostgreSQL da imagem |
| `CACHE_STORE` | `file` | Usa arquivos para cache, sem exigir uma tabela adicional no banco |
| `SESSION_DRIVER` | `file` | Usa arquivos para sessões na aplicação, sem exigir uma tabela adicional no banco |

O .env da raiz fornece ao Docker Compose as credenciais usadas para iniciar o PostgreSQL. Durante o desenvolvimento, a API não conseguia se conectar ao banco porque essas variáveis não eram repassadas automaticamente ao contêiner do backend; por isso, a conexão do Laravel foi configurada em backend/.env. Portanto, Em uma instalação nova, alterações no nome do banco, usuário ou senha devem ser feitas nos dois arquivos .env, mantendo os valores correspondentes iguais.


### 2. Construir as imagens e executar a aplicação

O frontend utiliza a imagem pronta `node:20-alpine` para desenvolvimento, então é necessário apenas construir a imagem do backend e gerar a chave automatica APP_KEY para segurança e depois subir o backend e frontend.
Logo, no terminal:

```sh
docker compose build backend
docker compose run --rm --no-deps backend php artisan key:generate
docker compose up -d backend frontend 
```


O segundo comando preenche APP_KEY no backend/.env, e o terceiro inicia os serviços. Na inicialização do backend, o comando definido em docker-compose.yml também executa o container de banco de dados, as migrations e o seeder automaticamente.

OBS: O frontend em localhost:5173 demora um pouco para ser exibido após o terceiro comando pois ainda ocorre a instalação de dependências em segundo plano.

Para acompanhar, use
```sh
docker compose logs -f frontend
```
e aguarde a mensagem de que o Vite está pronto.

O seeder adiciona 24 registros demonstrativos com protocolos fixos `APT-DEMO000001` a `APT-DEMO000024` que evitam duplicatas e impedem que uma nova execução altere registros existentes. Se um registro demonstrativo for excluído, a próxima inicialização o recriará.


Para executar novamente apenas o seeder com o backend em funcionamento:

```sh
docker compose exec backend php artisan db:seed --force
```


| Serviço | Endereço |
| --- | --- |
| Interface | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:8000/api/v1/solicitacoes](http://localhost:8000/api/v1/solicitacoes) |
| Health check da API | [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health) |
| Documentação Swagger UI | [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs) |

Para encerrar os serviços preservando os dados:

```sh
docker compose down
```

## Testes e build

Depois de preparar os arquivos de ambiente e diretórios descritos acima, execute os testes de backend em um container separado:

```sh
docker compose build tests
docker compose run --rm --no-deps tests
```

Os testes de backend incluem 16 cenários de API em `backend/tests/Feature/AppointmentTest.php`, a documentação e a repetição segura do seeder em `backend/tests/Feature/AppointmentSeederTest.php`. Os testes utilizam SQLite em memória, configurado em `backend/phpunit.xml`, com dados fictícios e chave exclusiva de teste. Não dependem dos registros do PostgreSQL da aplicação e não substituem uma verificação de integração com esse banco.

Os testes do frontend ficam próximos aos módulos que verificam, dentro de `frontend/src`, e utilizam Vitest, React Testing Library e jsdom. Para executá-los uma vez:

```sh
cd frontend
npm install
npm test
```

Durante o desenvolvimento, você pode utilizar o modo contínuo, que executa novamente os testes afetados após cada alteração:

```sh
npm run test:watch
```

## API e contratos

Base local: `/api/v1`. 

As rotas usam `solicitacoes` para identificar o recurso. A rota de totais por status é `/solicitacoes/resumo`.

| Método | Rota | Comportamento |
| --- | --- | --- |
| `GET` | `/health` | Disponibilidade HTTP da API |
| `POST` | `/solicitacoes` | Criar solicitação; sucesso `201` |
| `GET` | `/solicitacoes` | Listar com paginação; sucesso `200` |
| `GET` | `/solicitacoes/resumo` | Totais por status; sucesso `200` |
| `GET` | `/solicitacoes/{id}` | Consultar detalhes; sucesso `200` |
| `PATCH` | `/solicitacoes/{id}/status` | Atualizar status; sucesso `200` |

A listagem aceita `status`, `categoria`, `prioridade` e `pagina`. O resumo aceita os mesmos filtros, exceto paginação. Exemplo:

```text
/solicitacoes?status=RECEBIDA&categoria=CONSULTA&prioridade=MEDIA&pagina=1
```

A resposta de listagem contém `dados` (solicitações da página), `pagina_atual`, `ultima_pagina`, `itens_por_pagina` (15) e `total` (quantidade de solicitações que correspondem aos filtros). Para avançar ou voltar, envie outro valor em `pagina` junto dos filtros desejados. Os endpoints antigos com `/appointments` não são mantidos.

### Documentação com OpenAPI

A especificação OpenAPI está em [`backend/docs/openapi.yaml`](backend/docs/openapi.yaml). Ela descreve os endpoints principais da API e suas funcionalidades, e também permite que o usuário execute cada um dos endpoints.

Com o backend em execução, acesse [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs) para consultar a documentação no Swagger UI e testar as operações da API. A interface carrega os recursos visuais de uma versão fixa do Swagger UI pela internet e lê a especificação local pelo endpoint `/api/v1/docs/openapi.yaml`. O arquivo é versionado e deve ser atualizado quando o contrato mudar.

## Arquitetura e organização

```text
backend/
  app/Http/Controllers/             Recebimento das requisições e respostas HTTP
  app/Http/Requests/                Validação dos dados de criação
  app/Services/                     Criação e regras de transição
  app/Models/                       Mapeamento da persistência pelo Eloquent
  database/migrations/              Esquema e índices do banco
  database/seeders/                 Dados fictícios iniciais
  routes/api.php                    Rotas versionadas da API
  tests/Feature/                    Testes HTTP e regras de negócio
frontend/src/
  components/appointment/           Componentes do domínio de atendimento
  components/ui/                    Elementos visuais reutilizáveis
  components/layout/                Navegação do sidebar esquerdo
  pages/                            Página de listagem, formulário e detalhes
  hooks/                            Estado e operações de solicitações
  services/                         Cliente HTTP
  interfaces/                       Tipos dos dados e contratos
  constants/                        Rótulos e transições usadas na interface
```

### Responsabilidades e escolhas da implementação

#### Backend

- **Backend define o status inicial:** `AppointmentService` atribui `RECEBIDA` ao criar uma solicitação, sem confiar em um status enviado pelo frontend.
- **Validação e serviço:** `StoreAppointmentRequest` separa a validação dos dados recebidos no cadastro. `AppointmentService` reúne a criação, o protocolo e as transições de status. O controller coordena requisições e respostas.
- **Arquitetura em camadas no backend:** O backend utiliza o fluxo Controller -> Service -> Model, um padrão comum em aplicações Laravel que ajuda na separação de responsabilidades e na depuração de cada módulo.
- **Persistência com Eloquent:** o model `Appointment` representa a tabela `atendimentos`; a migration define os campos, a unicidade do protocolo e índices para os filtros. Não foi criada uma camada de repositório porque o Eloquent atende às operações deste módulo.

#### Frontend

- **Frontend separado da persistência:** No frontend, `services/appointments.ts` centraliza a comunicação com a API, e o hook `useAppointments` coordena os filtros, os dados e os estados de carregamento, sucesso e erro. Essa divisão facilita a depuração de problemas, pois permite uma separação clara de responsabilidades.
- **Criação de componentes reutilizáveis no frontend:** Para manter os módulos de toda a interface da aplicação web consistentes, foi feita uma extração geral de componentes de UI que podiam ser reutilizados posteriormente em outros componentes maiores.
- **Contrato tipado:** os tipos em `interfaces/Appointment.ts` descrevem os dados enviados e recebidos da API, incluindo filtros e paginação, para manter o frontend alinhado ao contrato do backend.

O fluxo principal da aplicação: Requisição HTTP -> Routes -> Controller -> Services -> Models -> PostgreSQL.


## Uso de inteligência artificial

Foi utilizada a IA do ChatGPT Codex para:
- Inicialização do projeto e configuração do esqueleto do backend e front-end, utilizando arquitetura em camadas no backend.
- Desenvolvimento e configuração do docker-compose.yml e DockerFile, com checagem constante para evitar quaisquer deslizes.
- Formular testes no backend e no frontend, com vigilância constante e especificações corretas.
- Auxiliar na documentação da API com OpenAPI, criando todo o módulo de Swagger UI.
- Auxiliar na depuração de problemas de inicialização.
