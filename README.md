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

- Cadastro com nome, categoria, prioridade, descrição e justificativa de urgência.
- Protocolo automático no formato `APT-` seguido de dez caracteres alfanuméricos, com restrição de unicidade no banco.
- Listagem com 15 registros por página e filtros combináveis por status, categoria e prioridade.
- Resumo por status considerando todos os registros que correspondem aos filtros, independentemente da página.
- Consulta de detalhes e atualização de status com confirmação na interface.

## Execução local com Docker Compose

### Pré-requisitos

- Docker Engine ou Docker Desktop em execução.
- Docker Compose V2, acessível pelo comando `docker compose`.

### 1. Preparando as variáveis de ambiente

Em um clone novo, copie o exemplo da raiz e do /backend:

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

| Configuração | Valor local | Observação |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Lida do `.env` da raiz pelo Compose e enviada ao frontend |
| `DB_CONNECTION` | `pgsql` | Conexão usada pela aplicação |
| `DB_HOST` | `db` | Nome do serviço na rede do Compose |
| `DB_PORT` | `5432` | Porta interna do PostgreSQL |
| `DB_DATABASE` | `solicitacao_atendimento` | Banco da aplicação |
| `DB_USERNAME` / `DB_PASSWORD` | `postgres` / `postgres` | Valores demonstrativos definidos no Compose |
| `APP_KEY` | Gerada localmente | Mantida no `backend/.env`, ignorado pelo Git |

### 2. Construir as imagens e executar a aplicação

No terminal: 

```sh
docker compose build backend
docker compose up -d backend frontend 
```

Aqui você só precisa construir a imagem do backend, pois o serviço de frontend utiliza diretamente a imagem pronta node:20-alpine para desenvolvimento.


| Serviço | Endereço |
| --- | --- |
| Interface | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:8000/api/v1/appointments](http://localhost:8000/api/v1/appointments) |
| Health check da API | [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health) |
| Documentação Swagger UI | [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs) |

O domínio localhost:8000 é o padrão, mas você pode modificar isso nas variáveis de ambiente da raiz do projeto.

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

A suíte em `backend/tests/Feature/AppointmentTest.php` possui 14 testes e usa SQLite em memória, configurados em `backend/phpunit.xml`, com dados fictícios e chave exclusiva de teste. Não depende dos registros do PostgreSQL da aplicação e não substitui uma verificação de integração com esse banco.

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
  app/Services/                     Validação de criação e regras de transição
  app/Models/                       Mapeamento da persistência pelo Eloquent
  database/migrations/              Esquema e índices do banco
  routes/api.php                    Rotas versionadas da API
  tests/Feature/                    Testes HTTP e regras de negócio
frontend/src/
  components/appointments/          Componentes do domínio de atendimento
  components/ui/                    Elementos visuais reutilizáveis
  components/layout/                Navegação
  pages/                            Listagem, formulário e detalhes
  hooks/                            Estado e operações de solicitações
  services/                         Cliente HTTP
  interfaces/                       Tipos dos dados e contratos
  constants/                        Rótulos e transições usadas na interface
```

### Responsabilidades e escolhas da implementação

- **Backend define o status inicial de uma solicitação** o Backend faz a atribuição manual do status de uma solicitação nova para RECEBIDA em vez do front-end.
- **Serviço injetado no controller:** `AppointmentService` reúne regras reutilizáveis; o controller coordena requisições e respostas. O status inicial ainda é definido no controller.
- **Frontend separado da persistência:** `services/appointments.ts` centraliza o acesso à API, e `useAppointments` coordena estado, filtros e operações. As páginas e os componentes apresentam esses dados.
- **Arquitetura em Camadas no Backend** O Backend utiliza uma arquitetura em camadas com fluxo Controller -> Service -> Models, um padrão bem comum nas aplicações de Laravel que ajuda bastante na separação de responsabilidades e debug de cada módulo separadamente.

O fluxo principal da aplicação:
  Requisição HTTP -> Routes -> Controller -> Services -> Models -> PostgreSQL



## Uso de inteligência artificial

Foi utilizada a IA para:
- Inicialização do projeto e configuração do esqueleto do backend e front-end, utilizando arquitetura em camadas no backend.
- Desenvolvimento e configuração do docker-compose.yml e DockerFile, com checagem constante para evitar quaisquer deslizes.
- Formular testes no backend com especificações já enviadas.

