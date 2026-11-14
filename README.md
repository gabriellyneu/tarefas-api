# API de Tarefas – CI com GitHub Actions

API REST (Node.js + Express + TypeScript) com banco de dados SQL (SQLite).

| Método | Rota         | Descrição            |
| ------ | ------------ | -------------------- |
| GET    | /health      | Verificação de saúde |
| GET    | /tarefas     | Lista tarefas        |
| GET    | /tarefas/:id | Busca uma tarefa     |
| POST   | /tarefas     | Cria tarefa          |
| PUT    | /tarefas/:id | Atualiza tarefa      |
| DELETE | /tarefas/:id | Remove tarefa        |

## Scripts

`npm run lint`, `lint:security`, `format:check`, `audit:deps`, `build`, `test:unit`, `test:integration`.

## Pipeline (`.github/workflows/ci.yml`)

Gatilho PR → análise estática (código, formatação, segurança) → build → teste unitário → teste de integração → criação da imagem Docker.
