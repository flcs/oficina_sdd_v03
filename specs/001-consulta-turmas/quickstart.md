# Quickstart: Consulta de Turmas Acadêmicas

**Branch**: `001-consulta-turmas` | **Date**: 2026-03-13

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js | 20.x |
| npm | 10.x |
| PostgreSQL | 15.x |
| TypeScript | 5.x (instalado localmente via npm) |

---

## Estrutura do Repositório

```
001-consulta-turmas/
├── backend/          ← API Node.js + Express
└── frontend/         ← SPA React + Vite
```

---

## Setup: Backend

### 1. Instalar dependências

```bash
cd backend
npm install
```

Dependências de produção:
```json
{
  "express": "^4.18.0",
  "pg": "^8.11.0",
  "jsonwebtoken": "^9.0.0"
}
```

Dependências de desenvolvimento:
```json
{
  "typescript": "^5.0.0",
  "@types/express": "^4.17.0",
  "@types/pg": "^8.10.0",
  "@types/jsonwebtoken": "^9.0.0",
  "vitest": "^1.0.0",
  "supertest": "^6.3.0",
  "@types/supertest": "^6.0.0"
}
```

### 2. Configurar variáveis de ambiente

Crie `backend/.env` (não commitar):
```dotenv
DATABASE_URL=postgresql://usuario:senha@localhost:5432/oficina_sdd
JWT_SECRET=sua_chave_secreta_longa_e_aleatoria
PORT=3000
```

> **Segurança**: `JWT_SECRET` deve ter no mínimo 32 caracteres aleatórios.
> Nunca use um valor previsível ou hardcoded.

### 3. Criar schema do banco

```bash
psql -d oficina_sdd -f backend/src/infrastructure/database/schema.sql
```

Ou manualmente via `psql`:
```sql
\i backend/src/infrastructure/database/schema.sql
```

### 4. Compilar TypeScript

```bash
cd backend
npx tsc --noEmit   # verificar tipos sem gerar output
npx tsc            # gerar output em dist/
```

### 5. Iniciar servidor

```bash
cd backend
node dist/main.js
# → Servidor rodando em http://localhost:3000
```

### 6. Rodar testes (backend)

```bash
cd backend

# Testes unitários (sem banco de dados)
npx vitest run tests/unit

# Testes de integração (requer banco de testes)
DATABASE_URL=postgresql://usuario:senha@localhost:5432/oficina_sdd_test \
  npx vitest run tests/integration
```

---

## Setup: Frontend

### 1. Instalar dependências

```bash
cd frontend
npm install
```

Dependências de produção:
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

Dependências de desenvolvimento:
```json
{
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "jsdom": "^23.0.0"
}
```

### 2. Configurar URL da API

Crie `frontend/.env.local` (não commitar):
```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Iniciar servidor de desenvolvimento

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

### 4. Build de produção

```bash
cd frontend
npm run build     # gera dist/
npm run preview   # serve o build localmente
```

### 5. Rodar testes (frontend)

```bash
cd frontend

# Testes unitários de domínio e application
npx vitest run tests/unit

# Testes de componentes (jsdom + React Testing Library)
npx vitest run tests/components
```

---

## Fluxo de Desenvolvimento TDD (Red-Green-Refactor)

Siga esta ordem para não quebrar o ciclo:

```
[BACKEND]
1. Escrever testes de value objects (RED) → implementar (GREEN) → refatorar
2. Escrever testes de entities compostas    (RED) → implementar (GREEN) → refatorar
3. Escrever testes de PoliticaNotasMedia    (RED) → implementar (GREEN) → refatorar
4. Escrever testes de domain services       (RED) → implementar (GREEN) → refatorar
5. Escrever testes de CompositorRelatorio   (RED) → implementar (GREEN) → refatorar
6. Escrever testes de ServicoConsultaTurmas com IRepositorioTurmas mockado (RED → GREEN)
7. Escrever testes de integração de RepositorioTurmasPg (RED → GREEN)
8. Escrever testes de TurmasController + autenticacaoJwt via Supertest (RED → GREEN)

[FRONTEND] (pode ser paralelo ao backend após etapa 1-2)
1. Escrever testes de value objects / entities (RED) → implementar (GREEN)
2. Escrever testes de domain services (GeradorAlertas*) (RED) → implementar (GREEN)
3. Escrever testes de ClienteHttpTurmas com fetch mockado (RED) → implementar (GREEN)
4. Escrever testes de componentes Badge* / LinhaAluno / TabelaAlunos (RED) → implementar (GREEN)
5. Escrever testes de useConsultaTurmas (RED) → implementar (GREEN)
6. Escrever testes de PaginaConsultaTurmas (RED) → implementar (GREEN)
```

> **Regra de ouro**: NUNCA escreva código de produção sem um teste falhando que o justifique.

---

## Verificação de Conformidade com a Constituição

Antes de abrir PR, execute o checklist completo:

```bash
# Backend: TypeScript sem erros
cd backend && npx tsc --noEmit

# Backend: todos os testes passando
cd backend && npx vitest run

# Frontend: TypeScript sem erros
cd frontend && npx tsc --noEmit

# Frontend: todos os testes passando
cd frontend && npx vitest run
```

Checklist manual (ver Constituição v1.0.0, seção "Development Workflow"):
- [ ] Todas as classes respeitam Object Calisthenics Regras 1–9
- [ ] SOLID demonstrável no design proposto
- [ ] Nenhum `any` ou assertion insegura sem justificativa documentada
- [ ] Todas as exportações com anotações TypeScript explícitas
- [ ] Testes escritos antes da implementação (evidência no histórico de commits)
- [ ] Todos os testes verdes sem regressão de cobertura

---

## Exemplo de Requisição à API

```bash
# Gerar token JWT de teste (use apenas em desenvolvimento)
node -e "
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { professorId: 'seu-professor-uuid-aqui' },
    process.env.JWT_SECRET || 'dev-secret-nao-use-em-producao',
    { expiresIn: '1h' }
  );
  console.log(token);
"

# Listar alunos de uma disciplina
curl -X GET \
  http://localhost:3000/api/disciplinas/3fa85f64-5717-4562-b3fc-2c963f66afa6/alunos \
  -H "Authorization: Bearer <token-acima>"
```

---

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|----------------|---------|
| `ECONNREFUSED` no frontend | Backend não está rodando | Iniciar `backend/` antes do `frontend/` |
| `401 Unauthorized` | Token inválido ou expirado | Gerar novo token com `JWT_SECRET` correto |
| `403 Forbidden` | `professorId` no token não corresponde à disciplina | Usar o UUID do professor dono da disciplina |
| `503 Service Unavailable` | Banco de dados offline | Verificar PostgreSQL com `pg_isready` |
| `tsc` error `any` | Type narrowing ausente | Adicionar type guard ou interface Row explícita |
| Vitest não encontra testes | Caminho de configuração errado | Verificar `vitest.config.ts` e `include` patterns |

---

## Validacao End-to-End (TDD)

Sequencia recomendada para validar de ponta a ponta no mesmo fluxo de PR:

```bash
# 1) Backend: tipos + suite completa
cd backend
npm run typecheck
npm test

# 2) Frontend: tipos + suite completa
cd ../frontend
npm run typecheck
npm test
```

Resultado esperado:
- Todos os testes backend e frontend passando.
- Nenhum erro de TypeScript em modo `strict`.
- Cenarios US1-US4 cobertos por unitarios e integracao/componentes.

## Validacao de Performance p95

Executar cenario de performance (100 alunos) criado em `backend/tests/integration/performance/listarAlunos.p95.test.ts`:

```bash
cd backend
npx vitest run tests/integration/performance/listarAlunos.p95.test.ts
```

Critério de aceite:
- `p95 < 500ms` para 40 amostras de listagem com 100 alunos.

Registro da execucao atual:
- Ambiente local Linux, Node.js 20.x.
- Teste executado com resultado verde e limiar de p95 atendido.
