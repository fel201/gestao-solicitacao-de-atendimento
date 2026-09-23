# Solicitações de Atendimento

Aplicação para cadastrar e acompanhar solicitações de atendimento a unidades públicas. O frontend React consome uma API Laravel, responsável pelas regras de negócio e pela persistência no PostgreSQL.

## Tecnologias

| Tecnologia | Versão definida no projeto | Uso |
| --- | --- | --- |
| React | `^18.3.1` | Interface e componentes |
| TypeScript | `^5.6.2` | Tipagem do frontend e dos contratos da API |
| React Router | `^7.18.4` | Navegação entre listagem, cadastro e detalhes |
| Vite | `^5.4.10` | Servidor de desenvolvimento e build |
| Tailwind CSS | `^3.4.7` | Estilos e adaptação do layout a diferentes telas |
| PHP | 8.3, imagem Alpine | Execução do backend |
| Laravel | 11.56.1 no `composer.lock` | API REST, Eloquent e migrations |
| PostgreSQL | 16, imagem Alpine | Banco da aplicação |
| PHPUnit | 11.5.56 no `composer.lock` | Testes de backend |
| Node.js | 20, imagem Alpine | Execução das ferramentas do frontend |
| Docker Compose | V2 | Execução integrada dos serviços |

O cliente HTTP utiliza `fetch`, nativo do navegador. React Router atende à navegação entre as rotas do sidebar esquerdo e visualização de detalhes de uma solicitação; Tailwind e o plugin de formulários ajudam na organização e estilização de cada componente, evitando que o código fique cheio de arquivos CSS.

## Funcionalidades implementadas

- Cadastro com nome, categoria, prioridade, descrição e justificativa de urgência, validando tipos e o limite de 255 caracteres do nome antes da persistência.
- Protocolo automático no formato `APT-` seguido de dez caracteres alfanuméricos, com restrição de unicidade no banco.
- Listagem com 15 registros por página e filtros combináveis por status, categoria e prioridade.
- Resumo por status considerando todos os registros que correspondem aos filtros, independentemente da página.
- Consulta de detalhes e atualização de status com confirmação na interface.
- Carga inicial de 24 solicitações fictícias, com categorias, prioridades e status variados para demonstrar filtros e paginação.

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

O comando `docker compose` lê o `.env` da raiz ao processar o arquivo `docker-compose.yml`. Ele envia ao backend somente as variáveis declaradas em `environment:` nesse arquivo.

#### `.env.example` da raiz do projeto

| Configuração | Valor local | Observação |
| --- | --- | --- |
| `APP_ENV` | `local` | Enviada ao backend pelo comando `docker compose` |
| `APP_DEBUG` | `false` | Enviada ao backend pelo comando `docker compose`; mantém desativada a exibição detalhada de erros |
| `DB_HOST` | `db` | Nome do serviço PostgreSQL na rede definida em `docker-compose.yml` |
| `DB_PORT` | `5432` | Porta interna do PostgreSQL |
| `DB_DATABASE` | `solicitacao_atendimento` | Nome do banco criado pelo serviço PostgreSQL e usado pelo backend |
| `DB_USERNAME` | `postgres` | Usuário demonstrativo enviado ao PostgreSQL e ao backend |
| `DB_PASSWORD` | `postgres` | Senha demonstrativa enviada ao PostgreSQL e ao backend; altere em outros ambientes |
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Lida pelo comando `docker compose` e enviada ao frontend |

O .env do backend é lido pelo Laravel. Ao iniciar o backend com docker compose, as variáveis de banco desse arquivo são substituídas pelas declaradas em docker-compose.yml, que recebem os valores do .env da raiz. Elas também permitem configurar o backend fora do Docker.

#### `backend/.env.example`

| Configuração | Valor local | Observação |
| --- | --- | --- |
| `APP_NAME` | `Solicitação de Atendimento` | Nome da aplicação na configuração do Laravel |
| `APP_KEY` | Vazia no exemplo | Pode ser gerada localmente pelo comando do passo seguinte; permanece no `backend/.env`, ignorado pelo Git |
| `APP_URL` | `http://localhost:8000` | URL usada pelo Laravel para gerar endereços; não altera a porta publicada em `docker-compose.yml` |
| `LOG_STACK` | `stderr` | Direciona os logs do Laravel para a saída do contêiner, visível com `docker logs` |
| `DB_CONNECTION` | `pgsql` | Conexão PostgreSQL; `docker-compose.yml` também define esse valor para o backend |
| `DB_HOST` | `db` | Host do banco; no contêiner prevalece o valor do `.env` da raiz |
| `DB_PORT` | `5432` | Porta interna do banco; no contêiner prevalece o valor do `.env` da raiz |
| `DB_DATABASE` | `solicitacao_atendimento` | Nome do banco; no contêiner prevalece o valor do `.env` da raiz |
| `DB_USERNAME` | `postgres` | Usuário demonstrativo; no contêiner prevalece o valor do `.env` da raiz |
| `DB_PASSWORD` | `postgres` | Senha demonstrativa; no contêiner prevalece o valor do `.env` da raiz |
| `CACHE_STORE` | `file` | Usa arquivos para cache, sem exigir uma tabela adicional no banco |
| `SESSION_DRIVER` | `file` | Usa arquivos para sessões, sem exigir uma tabela adicional no banco |

### 2. Construir as imagens e executar a aplicação

O frontend utiliza a imagem pronta `node:20-alpine` para desenvolvimento, então é necessário apenas construir a imagem do backend e gerar a chave automatica APP_KEY para segurança e depois subir o backend e frontend.
Logo, no terminal:

```sh
docker compose build backend
docker compose run --rm --no-deps backend php artisan key:generate
docker compose up -d backend frontend 
```

O segundo comando preenche APP_KEY no backend/.env, e o terceiro inicia os serviços. Na inicialização do backend, o comando definido em docker-compose.yml executa as migrations e o seeder automaticamente.

O seeder adiciona 24 registros demonstrativos com protocolos fixos `APT-DEMO000001` a `APT-DEMO000024` que evitam duplicatas e impedem que uma nova execução altere registros existentes. Se um registro demonstrativo for excluído, a próxima inicialização o recriará.


Para executar novamente apenas o seeder com o backend em funcionamento:

```sh
docker compose exec backend php artisan db:seed --force
```


| Serviço | Endereço |
| --- | --- |
| Interface | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:8000/api/v1/appointments](http://localhost:8000/api/v1/appointments) |
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

Os testes de backend incluem 15 cenários de API em `backend/tests/Feature/AppointmentTest.php`, a documentação e a repetição segura do seeder em `backend/tests/Feature/AppointmentSeederTest.php`. Os testes utilizam SQLite em memória, configurado em `backend/phpunit.xml`, com dados fictícios e chave exclusiva de teste. Não dependem dos registros do PostgreSQL da aplicação e não substituem uma verificação de integração com esse banco.

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

As rotas usam o nome `appointments`, correspondente a solicitações de atendimento. 

| Método | Rota | Comportamento |
| --- | --- | --- |
| `GET` | `/health` | Disponibilidade HTTP da API |
| `POST` | `/appointments` | Criar solicitação; sucesso `201` |
| `GET` | `/appointments` | Listar com paginação; sucesso `200` |
| `GET` | `/appointments/summary` | Totais por status; sucesso `200` |
| `GET` | `/appointments/{id}` | Consultar detalhes; sucesso `200` |
| `PATCH` | `/appointments/{id}/status` | Atualizar status; sucesso `200` |

A listagem aceita `status`, `categoria`, `prioridade` e `page`. O resumo aceita os mesmos filtros, exceto paginação. Exemplo:

```text
/appointments?status=RECEBIDA&categoria=CONSULTA&prioridade=MEDIA&page=1
```

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
  components/layout/                Navegação
  pages/                            Listagem, formulário e detalhes
  hooks/                            Estado e operações de solicitações
  services/                         Cliente HTTP
  interfaces/                       Tipos dos dados e contratos
  constants/                        Rótulos e transições usadas na interface
```

### Responsabilidades e escolhas da implementação

- **Backend define o status inicial:** `AppointmentService` atribui `RECEBIDA` ao criar uma solicitação, sem confiar em um status enviado pelo frontend.
- **Validação e serviço:** `StoreAppointmentRequest` valida a entrada; `AppointmentService` reúne a criação, o protocolo e as transições de status. O controller coordena requisições e respostas.
- **Frontend separado da persistência:** `services/appointments.ts` centraliza o acesso à API, e `useAppointments` coordena estado, filtros e operações. As páginas e os componentes apresentam esses dados.
- **Arquitetura em Camadas no Backend** O Backend utiliza uma arquitetura em camadas com fluxo Controller -> Service -> Models, um padrão bem comum nas aplicações de Laravel que ajuda bastante na separação de responsabilidades e debug de cada módulo separadamente.

O fluxo principal da aplicação:
  Requisição HTTP -> Routes -> Controller -> Services -> Models -> PostgreSQL

## Limitações conhecidas

- Não há autenticação ou autorização; o ambiente demonstrativo deve usar somente dados fictícios.
- Não há controle de concorrência entre atualizações simultâneas de status.


## Uso de inteligência artificial

Foi utilizada a IA para:
- Inicialização do projeto e configuração do esqueleto do backend e front-end, utilizando arquitetura em camadas no backend.
- Desenvolvimento e configuração do docker-compose.yml e DockerFile, com checagem constante para evitar quaisquer deslizes.
- Formular testes no backend e no frontend com especificações já enviadas.


