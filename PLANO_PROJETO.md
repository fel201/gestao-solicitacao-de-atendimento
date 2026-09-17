# Plano do Projeto - Solicitações de Atendimento

## 1. Visão geral
Este projeto tem como objetivo desenvolver uma aplicação full stack para registrar, consultar, filtrar e atualizar solicitações de atendimento encaminhadas a unidades públicas. A solução deve funcionar com frontend em React + TypeScript, backend em PHP/Laravel, banco de dados PostgreSQL e infraestrutura em Docker Compose.

O foco principal é entregar um fluxo funcional ponta a ponta, com integração real entre frontend, API e banco, respeitando as regras de negócio e os critérios do desafio técnico.

## 2. Objetivo do desafio
Avaliar a capacidade da equipe/candidata de:
- construir uma solução completa de ponta a ponta
- integrar frontend, backend e banco de dados
- usar React, Laravel e PostgreSQL de forma coerente
- organizar o código por responsabilidades e domínio
- justificar decisões técnicas e manter documentação clara
- entregar um ambiente reproduzível com Docker

## 3. Requisitos obrigatórios
A solução deve cumprir, no mínimo:
- React com TypeScript no frontend
- PHP com Laravel no backend
- PostgreSQL no banco
- comunicação real entre frontend e API
- persistência no PostgreSQL via Laravel
- fluxo funcional de criação, listagem e atualização de status
- regras obrigatórias de protocolo, prioridade urgente e transição de status
- execução integrada com Docker Compose
- uso exclusivo de dados fictícios
- documentação para execução e avaliações

## 4. Regras de negócio centrais
### 4.1. Modelo de dados
Cada solicitação deve possuir:
- id
- protocolo
- nome_solicitante
- categoria: CONSULTA, EXAME, VACINACAO ou OUTRO
- prioridade: BAIXA, MEDIA, ALTA ou URGENTE
- status: RECEBIDA, EM_ANALISE, AGENDADA, CONCLUIDA ou CANCELADA
- descricao
- justificativa_prioridade (obrigatória quando prioridade = URGENTE)
- data_criacao
- data_atualizacao

### 4.2. Regras principais
- Toda solicitação inicia com status RECEBIDA
- Todo registro deve receber um protocolo único gerado pela aplicação
- Prioridade URGENTE exige justificativa
- A data de criação deve ser automátic a
- A data de atualização deve mudar sempre que a solicitação for alterada
- Requisições inválidas devem retornar erro claro e HTTP adequado
- O status deve seguir a transição abaixo:
  - RECEBIDA -> EM_ANALISE ou CANCELADA
  - EM_ANALISE -> AGENDADA ou CANCELADA
  - AGENDADA -> CONCLUIDA ou CANCELADA
  - CONCLUIDA e CANCELADA são finais e não podem sofrer novas alterações

## 5. Back-end (Laravel)
### 5.1. Endpoints esperados
- POST /api/v1/solicitacoes
- GET /api/v1/solicitacoes
- GET /api/v1/solicitacoes/{id}
- PATCH /api/v1/solicitacoes/{id}/status

### 5.2. Requisitos técnicos
- validação rigorosa de dados de entrada
- regras de negócio centralizadas e testáveis
- respostas HTTP consistentes
- uso de Eloquent e migrations
- tratamento de exceções adequado
- documentação OpenAPI para endpoints principais

## 6. Front-end (React + TypeScript)
### 6.1. Funcionalidades esperadas
- tela inicial com resumo por status ou prioridade
- listagem paginada das solicitações
- filtros por status, categoria e prioridade
- formulário para criar nova solicitação
- visualização de detalhes
- ação de atualização de status
- estados visuais de carregamento, erro, vazio e sucesso
- layout responsivo e navegação compreensível

### 6.2. Integração
- o frontend deve consumir a API Laravel como fonte principal
- não deve depender exclusivamente de dados estáticos
- manter contratos de dados claros entre frontend e backend

## 7. Banco de dados e infraestrutura
### 7.1. Banco
- PostgreSQL como base principal
- estrutura versionada com migrations do Laravel
- restrições de integridade e campos obrigatórios
- índices para filtros mais comuns

### 7.2. Infraestrutura
- Docker Compose para subir:
  - frontend
  - backend Laravel
  - PostgreSQL
- variáveis de ambiente configuráveis
- arquivo .env.example com exemplo sem segredos reais

## 8. Testes e qualidade
### 8.1. Backend
- testes PHPUnit/Pest para regra de negócio relevante
- validar transição de status e regras obrigatórias

### 8.2. Frontend
- teste relevante com Vitest/Jest + Testing Library
- validar comportamento principal da interface

## 9. Documentação
O README deve conter, no mínimo:
- tecnologias e versões utilizadas
- instruções completas para rodar o projeto com Docker
- comandos de migrations e seeders
- decisões arquiteturais
- organização por domínio/responsabilidade
- funcionalidades implementadas e não implementadas
- como executar testes
- local da especificação OpenAPI
- como foram usadas ferramentas de IA, quando aplicável

## 10. Entregáveis por fase
### Fase 1 — Levantamento e arquitetura
- requisitos validados
- modelo de dados definido
- stack e infraestrutura escolhidos

### Fase 2 — Backend
- migrations
- models
- controllers/services
- validação e regras de transição de status
- endpoints REST implementados

### Fase 3 — Frontend
- telas principais
- filtros e paginação
- formulário de criação
- detalhes de solicitação
- atualização de status

### Fase 4 — Integração e testes
- integração real entre camadas
- Docker Compose operacional
- testes automatizados
- ajustes de UX e erro

### Fase 5 — Documentação e entrega
- README final
- OpenAPI
- validação de requisitos eliminatórios
- revisão final para entrega

## 11. Critérios de avaliação
A nota final considera:
- funcionamento e integração ponta a ponta
- qualidade do backend
- qualidade do frontend
- organização e arquitetura
- cobertura de testes e confiabilidade
- validação, segurança e privacidade
- documentação e execução reproduzível

A pontuação mínima necessária para aprovação é 60/100 na base, além de no mínimo 6/15 em backend e 6/15 em frontend.

## 12. Priorização recomendada
Dado o desafio, a ordem correta de execução é:
1. modelagem do banco e regras de negócio
2. API Laravel com testes básicos
3. frontend consumindo a API
4. Docker Compose e ambiente
5. documentação e refinamentos

## 13. Observações finais
- O foco deve estar em qualidade e transparência, e não apenas em quantidade de telas ou endpoints.
- É melhor entregar um fluxo principal estável e integrado do que um projeto amplo com erros.
- Limitações devem ser documentadas explicitamente no README.
- Os dados devem ser exclusivamente fictícios e sem informações sensíveis.

## 14. Próximo passo
Iniciar a implementação a partir desta base, priorizando a criação do banco de dados, as regras de negócio e a API REST, seguido do frontend e da integração completa.
