# Implementation Plan: Consulta de Turmas Academicas

**Branch**: `001-consulta-turmas` | **Date**: 2026-03-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-consulta-turmas/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar uma consulta read-only de turma academica em stack fullstack TypeScript.
O backend (Node.js + Express + pg) lista alunos de disciplina do professor autenticado via JWT,
sem paginacao, com ordenacao alfabetica por nome. O frontend (React + Vite) exibe CR, presenca,
badges de alerta e badge de status "Trancado". Regras centrais:

- CR usa `PoliticaNotasMedia` (media P1/P2).
- Com nota pendente: CR exibe `-`.
- Presenca e sempre calculada por carga horaria/faltas, independente das notas.
- Alertas: CR (<6 vermelho, 6.0-6.9 amarelo) e faltas/presenca (<75 vermelho, 75-84 amarelo).
- Acesso indevido retorna "Voce nao possui tal disciplina".
- Falha de servidor retorna "Servidor OFF".

## Technical Context

**Language/Version**: TypeScript 5.x (frontend e backend)
**Primary Dependencies**: React 18 + Vite + Vitest + React Testing Library (frontend); Node.js 20 + Express 4 + pg 8 + jsonwebtoken (backend)
**Storage**: PostgreSQL com driver nativo `pg` (sem ORM)
**Testing**: Vitest (unit/integration), React Testing Library (UI), Supertest (HTTP)
**Target Platform**: Web (SPA React + API REST Node.js)
**Project Type**: Web application (frontend + backend separados)
**Performance Goals**: p95 < 500ms no endpoint de listagem para turmas ate 100 alunos
**Constraints**: Sem paginacao; JWT no header `Authorization: Bearer <token>`; Repository pattern obrigatorio; TypeScript strict; TDD obrigatorio
**Scale/Scope**: 1 endpoint principal de consulta; ate 100 alunos por disciplina no escopo da feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Object-Oriented Design | PASS | Dominio, aplicacao e infraestrutura modelados com classes; componentes React apenas adaptadores de apresentacao. |
| II. SOLID Principles | PASS | DIP via `IRepositorioTurmas`; SRP por classe; OCP na politica de notas (`PoliticaNotasMedia`). |
| III. Object Calisthenics | PASS | Regra de 2 atributos garantida por composicao de entidades; first-class collections para listas de dominio. |
| IV. Strict TypeScript Typing | PASS | `strict: true`; sem `any`; contratos DTO e rows do banco explicitamente tipados. |
| V. TDD (NON-NEGOTIABLE) | PASS | Fluxo definido em Red-Green-Refactor com sequencia domain-first e testes antes de implementacao. |

**Post-design re-check**: PASS. `research.md`, `data-model.md`, `contracts/api.md` e `quickstart.md` permanecem aderentes aos 5 gates.

## Project Structure

### Documentation (this feature)

```text
specs/001-consulta-turmas/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api.md
└── tasks.md   # gerado em /speckit.tasks
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── domain/
│   │   ├── valueObjects/
│   │   ├── entities/
│   │   ├── policies/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── errors/
│   ├── application/
│   ├── infrastructure/
│   │   ├── repositories/
│   │   └── http/
│   │       ├── controllers/
│   │       └── middlewares/
│   └── main.ts
└── tests/
    ├── unit/
    └── integration/

frontend/
├── src/
│   ├── domain/
│   │   ├── valueObjects/
│   │   ├── entities/
│   │   ├── policies/
│   │   └── services/
│   ├── application/
│   ├── hooks/
│   ├── components/
│   └── pages/
└── tests/
    ├── unit/
    └── components/
```

**Structure Decision**: Estrutura de web app separada (`backend/` + `frontend/`).
Essa separacao permite boundary clara entre dominio de API e UI, mantendo repository pattern
no backend com `pg` e consumo via HTTP no frontend com JWT.

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected Because |
|------|------------|-------------------------------------|
| Composicao de entidades para regra de 2 atributos | Cumprir Object Calisthenics sem perder expressividade do dominio academico | Entidade plana unica violaria limite de 2 atributos e SRP |
| Duplicacao controlada de classes de dominio entre frontend e backend | Evitar overhead de monorepo/shared package nesta feature | Pacote compartilhado agora aumentaria escopo e custo de setup sem ganho imediato |
