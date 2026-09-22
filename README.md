# Solicitações de Atendimento

Aplicação para cadastrar e acompanhar solicitações de atendimento a unidades públicas. O frontend React consome uma API Laravel, responsável pelas regras de negócio e pela persistência no PostgreSQL.

Utilize exclusivamente dados fictícios. O ambiente descrito aqui é destinado à avaliação local.

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

As faixas com `^` são as declaradas no `frontend/package.json`; as versões resolvidas estão no `frontend/package-lock.json`. O backend possui seu próprio `composer.lock`.

O cliente HTTP utiliza `fetch`, nativo do navegador. React Router atende à navegação entre as rotas do sidebar esquerdo e visualização de detalhes de uma solicitação; Tailwind e seu plugin de formulários ajudam na organização e estilização de cada componente, evitando que o código fique cheio de arquivos CSS.

## Funcionalidades implementadas

- Cadastro com nome, categoria, prioridade, descrição e justificativa de urgência.
- Protocolo automático no formato `APT-` seguido de dez caracteres alfanuméricos, com restrição de unicidade no banco.
- Status inicial `RECEBIDA` definido pelo backend.
- Listagem com 15 registros por página e filtros combináveis por status, categoria e prioridade.
- Resumo por status considerando todos os registros que correspondem aos filtros, independentemente da página.
- Consulta de detalhes e atualização de status com confirmação na interface.
- Bloqueio de transições inválidas e de alterações em solicitações finalizadas.
- Datas de criação e atualização gerenciadas pelo Eloquent.
- Estados de carregamento, sucesso no cadastro, vazio e erro, além de opções para tentar novamente.
- Layout com adaptações responsivas, rótulos de campos e diálogo de confirmação com controle de foco e teclado.

### Fluxo de status

| Status atual | Próximos status permitidos |
| --- | --- |
| `RECEBIDA` | `EM_ANALISE`, `CANCELADA` |
| `EM_ANALISE` | `AGENDADA`, `CANCELADA` |
| `AGENDADA` | `CONCLUIDA`, `CANCELADA` |
| `CONCLUIDA` | Nenhum |
| `CANCELADA` | Nenhum |

Repetir o status atual também é rejeitado. A prioridade `URGENTE` exige justificativa preenchida.

## Execução local com Docker Compose

### Pré-requisitos

- Docker Engine ou Docker Desktop em execução, com suporte a containers Linux.
- Docker Compose V2, acessível pelo comando `docker compose`.
- Portas `5173`, `8000` e `5432` disponíveis.
- Acesso à internet na primeira execução para obter imagens e dependências.

PHP, Composer e Node.js não precisam estar instalados no computador quando os comandos abaixo são executados pelos containers. Execute-os na raiz deste repositório.

### 1. Preparar as variáveis de ambiente

Em um clone novo, copie o exemplo para a raiz e para o backend.

**PowerShell:**

```powershell
Copy-Item .env.example .env
Copy-Item .env.example backend/.env
```

**Linux/macOS:**

```sh
cp .env.example .env
cp .env.example backend/.env
```

Se esses arquivos já existirem, preserve os valores locais em vez de sobrescrevê-los. Acrescente as seguintes linhas ao `backend/.env` caso ainda não existam:

```dotenv
APP_KEY=
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

`APP_KEY` será preenchida no passo seguinte. Os drivers de arquivo evitam depender de tabelas de sessões e cache que não fazem parte das migrations deste projeto.

| Configuração | Valor local | Observação |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Lida do `.env` da raiz pelo Compose e enviada ao frontend |
| `DB_CONNECTION` | `pgsql` | Conexão usada pela aplicação |
| `DB_HOST` | `db` | Nome do serviço na rede do Compose |
| `DB_PORT` | `5432` | Porta interna do PostgreSQL |
| `DB_DATABASE` | `solicitacao_atendimento` | Banco da aplicação |
| `DB_USERNAME` / `DB_PASSWORD` | `postgres` / `postgres` | Valores demonstrativos definidos no Compose |
| `APP_KEY` | Gerada localmente | Mantida no `backend/.env`, ignorado pelo Git |

**Configuração atual do Compose:** os valores de banco, `APP_ENV` e `APP_DEBUG` estão definidos diretamente em `docker-compose.yml` e prevalecem sobre o `backend/.env`. Alterar apenas o `.env` da raiz não modifica esses valores. Para mudar o acesso ao banco, ajuste de forma consistente os serviços `db` e `backend`. `FRONTEND_URL` está no exemplo, mas não é utilizada por uma configuração própria de CORS no projeto.

### 2. Construir a imagem e preparar o Laravel

```sh
docker compose build backend
docker compose run --rm --no-deps backend sh -c "mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache && composer install --no-interaction --prefer-dist --no-progress"
docker compose run --rm --no-deps backend php artisan key:generate
```

A criação dos diretórios é necessária em um clone novo porque `backend/storage` e `backend/bootstrap/cache` são ignorados pelo Git e o código local é montado sobre o diretório da imagem. O Composer instala as dependências no volume `backend_vendor`.

Gere a chave na configuração inicial; não é necessário regenerá-la a cada execução.

### 3. Iniciar o PostgreSQL e aplicar as migrations

```sh
docker compose up -d db
docker compose exec db pg_isready -U postgres -d solicitacao_atendimento
```

Aguarde a resposta `accepting connections`. Caso o banco ainda esteja inicializando, repita a verificação antes de continuar.

```sh
docker compose run --rm --no-deps backend php artisan migrate --force
```

As migrations criam a tabela `atendimentos`, suas restrições e índices. **Não existem seeders ou factories implementados:** o banco começa vazio, e os dados fictícios devem ser cadastrados pela interface ou pela API. Não é necessário executar `db:seed`.

### 4. Iniciar API e frontend

```sh
docker compose up -d backend frontend
docker compose ps
```

O frontend executa `npm install` antes de iniciar o Vite; a primeira inicialização pode demorar. Os serviços são indicados explicitamente para não iniciar o serviço de testes junto da aplicação.

| Serviço | Endereço |
| --- | --- |
| Interface | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:8000/api/v1/appointments](http://localhost:8000/api/v1/appointments) |
| Health check da API | [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health) |
| Documentação Swagger UI | [http://localhost:8000/docs](http://localhost:8000/docs) |

O health check executa uma consulta simples no PostgreSQL e retorna `{"status":"ok"}` quando a API e a conexão com o banco estão disponíveis.

Para acompanhar a inicialização:

```sh
docker compose logs --tail=100 backend frontend db
```

Para encerrar os serviços preservando os dados:

```sh
docker compose down
```

O banco é persistido no volume `pgdata`. Não remova os volumes se quiser preservar os registros.

### Problemas comuns

- **Conexão recusada pelo PostgreSQL:** verifique `pg_isready`; `depends_on` não garante que o banco esteja pronto para receber conexões.
- **Tabela `atendimentos` inexistente:** execute a migration do passo 3.
- **Chave da aplicação ausente:** confirme a linha `APP_KEY=` no `backend/.env` e execute `key:generate`.
- **Erro de escrita em `storage` ou `bootstrap/cache`:** confirme que os diretórios do passo 2 existem e que o usuário do container pode escrever neles. Em Linux, permissões dependem do proprietário dos diretórios montados.
- **Porta ocupada:** libere a porta ou ajuste o mapeamento no Compose. Se mudar a porta pública da API, atualize também `VITE_API_URL` e recrie o frontend.
- **Mudança de credenciais com banco já inicializado:** as variáveis `POSTGRES_*` inicializam um volume novo; alterá-las não muda automaticamente os usuários de um banco existente.

## Roteiro de avaliação manual

1. Abra a interface e confirme o estado de listagem vazia em um banco novo.
2. Cadastre uma solicitação fictícia, por exemplo, nome `Pessoa Fictícia A`, categoria `CONSULTA`, prioridade `MEDIA` e descrição `Solicitação fictícia para avaliação`.
3. Confirme o protocolo, o status `RECEBIDA`, as datas e os detalhes do registro.
4. Cadastre uma solicitação `URGENTE`: sem justificativa, o formulário deve impedir o envio; com justificativa fictícia, deve permitir.
5. Combine os filtros e confira listagem e resumo. Com mais de 15 registros, verifique a paginação.
6. Avance uma solicitação por `EM_ANALISE`, `AGENDADA` e `CONCLUIDA`. Confirme que não há novas ações após a conclusão.
7. Cancele outra solicitação e confirme que ela também não permite novas alterações.
8. Recarregue a página para conferir que os registros continuam disponíveis pela API.

## API e contratos

Base local: `http://localhost:8000/api/v1`. Envie `Accept: application/json` e, nas operações com corpo, `Content-Type: application/json`.

As rotas usam o nome `appointments`, correspondente a solicitações de atendimento. Os campos do domínio permanecem em português, como definido no desafio.

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

### Criação

```json
{
  "nome_solicitante": "Pessoa Fictícia A",
  "categoria": "EXAME",
  "prioridade": "URGENTE",
  "descricao": "Solicitação fictícia para avaliação da aplicação.",
  "justificativa_prioridade": "Justificativa fictícia para testar a regra de urgência."
}
```

- Categorias: `CONSULTA`, `EXAME`, `VACINACAO`, `OUTRO`.
- Prioridades: `BAIXA`, `MEDIA`, `ALTA`, `URGENTE`.
- Não é necessário enviar protocolo, status inicial ou datas: são definidos pela aplicação.
- A justificativa é obrigatória para `URGENTE`; nos demais casos pode ser omitida.

A resposta contém `id`, `protocolo`, `nome_solicitante`, `categoria`, `prioridade`, `status`, `descricao`, `justificativa_prioridade`, `data_criacao` e `data_atualizacao`. A justificativa pode ser `null`.

### Atualização de status

Corpo de `PATCH /appointments/{id}/status`:

```json
{
  "status": "EM_ANALISE"
}
```

A API retorna a solicitação atualizada. A listagem utiliza o formato paginado do Laravel, incluindo `data`, `current_page`, `last_page`, `per_page` e `total`. O resumo retorna uma lista de objetos com `status` e `total`.

### Erros e OpenAPI

- `404`: solicitação ou rota inexistente.
- `422`: campos rejeitados pela validação ou transição de status não permitida.
- Erros de validação de campos incluem `message` e `errors`; erros de transição retornam `message`.

A especificação **OpenAPI 3.0.3** está em [`docs/openapi.yaml`](docs/openapi.yaml). Ela descreve os seis endpoints da API, filtros, paginação, corpos de requisição, schemas das respostas, exemplos fictícios e os principais códigos HTTP (`200`, `201`, `404`, `422`, `500` e `503`).

Com o backend em execução, acesse [http://localhost:8000/docs](http://localhost:8000/docs) para consultar a documentação no Swagger UI e testar as operações da API. A interface carrega os recursos visuais de uma versão fixa do Swagger UI pela internet e lê a especificação local pelo endpoint `/docs/openapi.yaml`. O arquivo é versionado e deve ser atualizado quando o contrato mudar.

A documentação também registra diferenças entre o contrato esperado e a validação atual, incluindo limitações de tipos e tamanho, filtros sem validação de enum e os dois formatos de erro `422` usados pelo backend.

## Arquitetura e organização

```text
Navegador: React + TypeScript
    |
    | HTTP / JSON
    v
API Laravel: rotas -> controller -> serviço -> modelo Eloquent
    |
    v
PostgreSQL: tabela atendimentos
```

```text
backend/
  app/Http/Controllers/   Recebimento das requisições e respostas HTTP
  app/Services/          Validação de criação e regras de transição
  app/Models/            Mapeamento da persistência pelo Eloquent
  database/migrations/   Esquema e índices do banco
  routes/api.php         Rotas versionadas da API
  tests/Feature/         Testes HTTP e regras de negócio
frontend/src/
  components/appointment/ Componentes do domínio de atendimento
  components/ui/          Elementos visuais reutilizáveis
  components/layout/      Navegação
  pages/                  Listagem, formulário e detalhes
  hooks/                  Estado e operações de solicitações
  services/               Cliente HTTP
  interfaces/             Tipos dos dados e contratos
  constants/              Rótulos e transições usadas na interface
```

### Responsabilidades e escolhas da implementação

- **Backend como autoridade das regras:** o frontend apresenta ações compatíveis com o status, mas o serviço Laravel também valida as transições. A interface não substitui a validação do servidor.
- **Serviço injetado no controller:** `AppointmentService` reúne regras reutilizáveis; o controller coordena requisições e respostas. O status inicial ainda é definido no controller.
- **Eloquent sem camada de repositório adicional:** o domínio atual possui uma entidade principal, e o modelo atende às operações de persistência sem uma abstração intermediária.
- **Frontend separado da persistência:** `services/appointments.ts` centraliza o acesso à API, e `useAppointments` coordena estado, filtros e operações. As páginas e os componentes apresentam esses dados.
- **Modelo relacional:** a migration define campos obrigatórios, protocolo único e valores enumerados. Há índice composto em `status` e `prioridade`, além de índice em `categoria`; a eficiência de filtros isolados por prioridade ainda pode ser revisada.
- **Datas:** o modelo configura `data_criacao` e `data_atualizacao` como timestamps do Eloquent, que os atualiza nas operações de gravação.

Uma evolução possível é manter o módulo de solicitações como limite de domínio, automatizar a verificação de conformidade com o contrato OpenAPI e introduzir eventos para integrações que realmente precisem de processamento assíncrono. No estado atual, não há microserviços, filas de trabalho ou eventos de domínio implementados.

## Testes e build

Depois de preparar os arquivos de ambiente e diretórios descritos acima, execute os testes de backend em um container separado:

```sh
docker compose build tests
docker compose run --rm --no-deps tests
```

O serviço instala as dependências e executa `composer test`, que chama PHPUnit. Evite executá-lo simultaneamente com outra instalação do Composer, pois o volume de dependências é compartilhado.

A suíte em `backend/tests/Feature/AppointmentTest.php` possui 11 testes, incluindo criação, urgência, campos obrigatórios, filtros, resumo, detalhes, transições inválidas e estados finais. Usa `RefreshDatabase` e SQLite em memória, configurados em `backend/phpunit.xml`, com dados fictícios e chave exclusiva de teste. Não depende dos registros do PostgreSQL da aplicação e não substitui uma verificação de integração com esse banco.

Para verificar tipos e gerar o build do frontend com o serviço em execução:

```sh
docker compose exec frontend npm run build
```

O resultado é escrito em `frontend/dist`. Esse comando compila a aplicação; não executa testes de comportamento. **Ainda não existem testes automatizados de frontend ou E2E, nem comandos de lint e formatação configurados nos scripts do projeto.**

### Verificações realizadas nesta revisão

Na revisão de 21/09/2026, `npm run build` concluiu com sucesso no ambiente local. A execução por Docker Compose, o fluxo integrado com PostgreSQL e a suíte PHPUnit não foram validados nessa revisão, pois Docker e PHP não estavam disponíveis no ambiente de análise. Os comandos deste README foram conferidos em relação aos arquivos de configuração, mas ainda precisam ser executados em um ambiente com Docker.

## Limitações conhecidas e itens pendentes

- Ausência de testes de frontend/E2E, seeders, factories e pipeline de integração contínua.
- Migrations são executadas manualmente; o Compose não possui espera automática pela prontidão do banco.
- A validação do backend verifica obrigatoriedade e valores enumerados, mas ainda precisa validar rigorosamente os tipos e limites de tamanho dos textos e os parâmetros de filtro.
- Alterações simultâneas de status não possuem controle de concorrência; requisições podem validar um estado anterior e sobrescrever alterações.
- Na tela de detalhes, uma falha ao recarregar dados pode não ser apresentada quando já existe um registro em memória. Consultas do frontend também não possuem cancelamento para evitar respostas fora de ordem.
- O tipo TypeScript da justificativa opcional ainda não representa explicitamente o `null` retornado pela API.
- O health check não consulta o PostgreSQL.
- Não há autenticação ou autorização. Esses mecanismos são diferenciais opcionais do desafio, não funcionalidades desta versão.
- O Compose usa servidores de desenvolvimento, credenciais demonstrativas e `APP_DEBUG=true`. O controller de criação ainda registra o payload recebido nos logs. Antes de qualquer uso fora da avaliação local, é necessário remover esse registro, desativar o debug e revisar a configuração de acesso e segredos.

## Uso de inteligência artificial

Foi utilizado o Codex, ferramenta de IA da OpenAI, nesta etapa para analisar o repositório frente aos requisitos do desafio, elaborar este README e implementar a especificação OpenAPI. O apoio abrangeu leitura do código, comparação com a matriz do edital, identificação de limitações e organização das instruções e dos contratos documentados.

Esta declaração registra o uso confirmado nesta etapa; não atesta ausência de IA na implementação anterior. O histórico de uso de outras ferramentas ou de geração e revisão de código anterior a esta documentação não foi estabelecido nesta revisão e deve ser complementado pela pessoa candidata antes da entrega, caso aplicável.

A pessoa candidata permanece responsável por revisar a documentação, validar os comandos e compreender e explicar todo o código entregue, conforme a política do desafio.
