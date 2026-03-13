# Tasks: Consulta de Turmas Academicas

**Input**: Design documents from `/specs/001-consulta-turmas/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Tests are MANDATORY per constitution (TDD non-negotiable). For each story, write failing tests first, then implement.

**Organization**: Tasks grouped by user story for independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Every task includes an explicit file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize backend/frontend workspaces and baseline tooling

- [X] T001 Create backend workspace and npm metadata in backend/package.json
- [X] T002 [P] Create frontend workspace and npm metadata in frontend/package.json
- [X] T003 [P] Configure strict TypeScript compiler options in backend/tsconfig.json
- [X] T004 [P] Configure strict TypeScript compiler options in frontend/tsconfig.json
- [X] T005 [P] Configure backend Vitest + Supertest setup in backend/vitest.config.ts
- [X] T006 [P] Configure frontend Vitest + RTL setup in frontend/vitest.config.ts
- [X] T007 [P] Add backend environment template (DATABASE_URL, JWT_SECRET, PORT) in backend/.env.example
- [X] T008 [P] Add frontend environment template (VITE_API_BASE_URL) in frontend/.env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core architecture and infrastructure required before any user story

**CRITICAL**: No user story implementation starts before this phase is complete.

- [X] T009 Create PostgreSQL schema script in backend/src/infrastructure/database/schema.sql
- [X] T010 [P] Define backend repository contract interface in backend/src/domain/repositories/IRepositorioTurmas.ts
- [X] T011 [P] Define access denied domain error in backend/src/domain/errors/AcessoNegadoException.ts
- [X] T012 [P] Implement JWT auth middleware with typed payload in backend/src/infrastructure/http/middlewares/autenticacaoJwt.ts
- [X] T013 [P] Add Express type augmentation for res.locals.professorId in backend/src/types/express.d.ts
- [X] T014 [P] Create pg pool factory and configuration in backend/src/infrastructure/database/pgPool.ts
- [X] T015 Implement backend HTTP bootstrap and route registration in backend/src/main.ts
- [X] T016 [P] Create frontend HTTP client foundation with token header support in frontend/src/application/ClienteHttpBase.ts
- [X] T017 [P] Create shared frontend API error mapper for 401/403/503 in frontend/src/application/ApiErrorMapper.ts

**Checkpoint**: Foundation ready - user story work can proceed.

---

## Phase 3: User Story 1 - Visualizar lista de alunos da disciplina (Priority: P1) 🎯 MVP

**Goal**: Professor visualiza lista alfabetica de alunos da propria disciplina com CR e presenca.

**Independent Test**: Requisitar `GET /api/disciplinas/:disciplinaId/alunos` com JWT valido e validar ordenacao alfabetica, CR por media P1/P2, CR `-` quando nota pendente e presenca calculada por faltas/carga horaria.

### Tests for User Story 1 (MANDATORY - TDD)

- [X] T018 [P] [US1] Add backend unit tests for value objects NotaProva/CargaHoraria/QuantidadeFaltas in backend/tests/unit/domain/valueObjects/avaliacaoPresenca.valueObjects.test.ts
- [X] T019 [P] [US1] Add backend unit tests for PoliticaNotasMedia (media P1/P2 e pendencia) in backend/tests/unit/domain/policies/politicaNotasMedia.test.ts
- [X] T020 [P] [US1] Add backend unit tests for CalculadoraPresenca (incluindo carga horaria zero) in backend/tests/unit/domain/services/calculadoraPresenca.test.ts
- [X] T021 [P] [US1] Add backend unit tests for ServicoConsultaTurmas with repository mock in backend/tests/unit/application/servicoConsultaTurmas.us1.test.ts
- [X] T022 [P] [US1] Add backend integration test for list endpoint ordering and base payload in backend/tests/integration/http/listarAlunos.us1.integration.test.ts
- [X] T023 [P] [US1] Add frontend unit tests for mapping API -> domain row model in frontend/tests/unit/application/clienteHttpTurmas.us1.test.ts
- [X] T024 [P] [US1] Add frontend component test for alphabetical table rendering in frontend/tests/components/TabelaAlunos.us1.test.tsx
- [X] T069 [P] [US1] Add frontend negative test asserting no edit/create/delete actions are rendered in frontend/tests/components/PaginaConsultaTurmas.readonly.us1.test.tsx

### Implementation for User Story 1

- [X] T025 [P] [US1] Implement backend value objects (NotaProva, CargaHoraria, QuantidadeFaltas, CoeficienteRendimento, PercentualPresenca) in backend/src/domain/valueObjects/
- [X] T026 [P] [US1] Implement backend entities NotasAvaliacao and InformacoesPresenca in backend/src/domain/entities/
- [X] T027 [US1] Implement PoliticaNotasMedia in backend/src/domain/policies/PoliticaNotasMedia.ts
- [X] T028 [US1] Implement CalculadoraPresenca in backend/src/domain/services/CalculadoraPresenca.ts
- [X] T029 [US1] Implement repository pg query for matriculas ordered by aluno nome in backend/src/infrastructure/repositories/RepositorioTurmasPg.ts
- [X] T030 [US1] Implement application use case listagem base in backend/src/application/ServicoConsultaTurmas.ts
- [X] T031 [US1] Implement list endpoint controller success path in backend/src/infrastructure/http/controllers/TurmasController.ts
- [X] T032 [P] [US1] Implement frontend domain models for line item (aluno/cr/presenca) in frontend/src/domain/entities/LinhaRelatorioAcademico.ts
- [X] T033 [US1] Implement frontend API client for listagem sem paginacao in frontend/src/application/ClienteHttpTurmas.ts
- [X] T034 [US1] Implement frontend hook for loading turma list in frontend/src/hooks/useConsultaTurmas.ts
- [X] T035 [US1] Implement read-only table page and row rendering in frontend/src/pages/PaginaConsultaTurmas.tsx

**Checkpoint**: US1 delivers MVP behavior end-to-end.

---

## Phase 4: User Story 2 - Alertas visuais de desempenho e presenca (Priority: P2)

**Goal**: Exibir badges visuais para CR baixo e presenca em risco.

**Independent Test**: Com dados de CR/presenca variados, validar regras de badge: CR<6 vermelho, 6.0-6.9 amarelo, presenca<75 vermelho, 75-84 amarelo, sem badge fora das faixas.

### Tests for User Story 2 (MANDATORY - TDD)

- [X] T036 [P] [US2] Add backend unit tests for GeradorAlertasCR thresholds in backend/tests/unit/domain/services/geradorAlertasCr.us2.test.ts
- [X] T037 [P] [US2] Add backend unit tests for GeradorAlertasPresenca thresholds in backend/tests/unit/domain/services/geradorAlertasPresenca.us2.test.ts
- [X] T038 [P] [US2] Add backend integration test validating alert payload combinations in backend/tests/integration/http/listarAlunos.alertas.us2.integration.test.ts
- [X] T039 [P] [US2] Add frontend component tests for CR and FALTAS badge colors/labels in frontend/tests/components/BadgesAlerta.us2.test.tsx
- [X] T040 [P] [US2] Add frontend page test for no-badge scenarios in frontend/tests/components/PaginaConsultaTurmas.alertas.us2.test.tsx

### Implementation for User Story 2

- [X] T041 [P] [US2] Implement backend alert category/severity value objects in backend/src/domain/valueObjects/
- [X] T042 [P] [US2] Implement backend alert entities and first-class collection in backend/src/domain/entities/AlertasAcademicos.ts
- [X] T043 [US2] Implement backend services GeradorAlertasCR and GeradorAlertasPresenca in backend/src/domain/services/
- [X] T044 [US2] Compose alerts into output DTO in backend/src/application/ServicoConsultaTurmas.ts
- [X] T045 [P] [US2] Implement frontend badge components in frontend/src/components/badges/BadgeAlerta.tsx
- [X] T046 [US2] Integrate alert rendering in frontend table row component in frontend/src/components/TabelaAlunos/LinhaAluno.tsx

**Checkpoint**: US2 independently validates all visual alert rules.

---

## Phase 5: User Story 3 - Exibir alunos trancados com badge (Priority: P3)

**Goal**: Alunos com status "Trancado" aparecem na lista com badge e sem calculo de CR.

**Independent Test**: Inserir alunos ativos e trancados na mesma turma e validar ordenacao, badge "Trancado" e CR `-` para trancados.

### Tests for User Story 3 (MANDATORY - TDD)

- [X] T047 [P] [US3] Add backend unit tests for status trancado precedence in backend/tests/unit/application/servicoConsultaTurmas.trancado.us3.test.ts
- [X] T048 [P] [US3] Add backend integration test for trancado payload behavior in backend/tests/integration/http/listarAlunos.trancado.us3.integration.test.ts
- [X] T049 [P] [US3] Add frontend component test for badge trancado and CR placeholder in frontend/tests/components/LinhaAluno.trancado.us3.test.tsx

### Implementation for User Story 3

- [X] T050 [P] [US3] Implement StatusMatricula value object and behavior in backend/src/domain/valueObjects/StatusMatricula.ts
- [X] T051 [US3] Implement trancado handling in output composition in backend/src/application/ServicoConsultaTurmas.ts
- [X] T052 [US3] Extend repository row mapping for status field in backend/src/infrastructure/repositories/RepositorioTurmasPg.ts
- [X] T053 [P] [US3] Implement frontend Trancado badge component in frontend/src/components/badges/BadgeTrancado.tsx
- [X] T054 [US3] Integrate trancado row behavior in frontend table renderer in frontend/src/components/TabelaAlunos/LinhaAluno.tsx

**Checkpoint**: US3 is independently functional and testable.

---

## Phase 6: User Story 4 - Controle de acesso e falha de servidor (Priority: P4)

**Goal**: Bloquear acesso a disciplina de outro professor e exibir mensagens de erro adequadas.

**Independent Test**: Professor nao dono recebe 403 com "Voce nao possui tal disciplina"; falha de servidor retorna 503 com "Servidor OFF" e frontend exibe mensagem correta.

### Tests for User Story 4 (MANDATORY - TDD)

- [X] T055 [P] [US4] Add backend middleware tests for JWT missing/invalid token in backend/tests/unit/infrastructure/http/autenticacaoJwt.us4.test.ts
- [X] T056 [P] [US4] Add backend unit tests for ownership check and AcessoNegadoException in backend/tests/unit/application/servicoConsultaTurmas.acesso.us4.test.ts
- [X] T057 [P] [US4] Add backend integration tests for 403 and 503 responses in backend/tests/integration/http/listarAlunos.erros.us4.integration.test.ts
- [X] T058 [P] [US4] Add frontend hook tests for mapping 403 and 503 messages in frontend/tests/unit/hooks/useConsultaTurmas.erros.us4.test.ts
- [X] T059 [P] [US4] Add frontend page test for rendering "Voce nao possui tal disciplina" and "Servidor OFF" in frontend/tests/components/PaginaConsultaTurmas.erros.us4.test.tsx

### Implementation for User Story 4

- [X] T060 [US4] Implement ownership verification query and exception throw in backend/src/infrastructure/repositories/RepositorioTurmasPg.ts
- [X] T061 [US4] Implement 403/503 error mapping in backend controller in backend/src/infrastructure/http/controllers/TurmasController.ts
- [X] T062 [US4] Finalize JWT middleware wiring on list route in backend/src/main.ts
- [X] T063 [US4] Implement frontend error-state UI messaging in frontend/src/pages/PaginaConsultaTurmas.tsx

**Checkpoint**: US4 security and resilience behaviors are independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality gates across all stories

- [X] T064 [P] Add end-to-end TDD verification guide in specs/001-consulta-turmas/quickstart.md
- [X] T065 [P] Add API usage and edge-case examples update in specs/001-consulta-turmas/contracts/api.md
- [X] T066 Run full backend test suite and strict type check via backend/package.json scripts
- [X] T067 Run full frontend test suite and strict type check via frontend/package.json scripts
- [X] T068 Perform code cleanup for Object Calisthenics compliance notes in specs/001-consulta-turmas/plan.md
- [X] T070 [P] Add backend performance test scenario for list endpoint p95 target in backend/tests/integration/performance/listarAlunos.p95.test.ts
- [X] T071 Execute and document p95 validation (<500ms ate 100 alunos) in specs/001-consulta-turmas/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: starts immediately.
- **Phase 2 (Foundational)**: depends on Phase 1; blocks all user stories.
- **User Story Phases (3-6)**: depend on Phase 2 completion.
- **Phase 7 (Polish)**: depends on desired user stories completed.

### User Story Dependencies

- **US1 (P1)**: starts after foundational; independent MVP.
- **US2 (P2)**: starts after foundational; depends functionally on US1 data shape but testable independently.
- **US3 (P3)**: starts after foundational; can be validated independently on status behavior.
- **US4 (P4)**: starts after foundational; independent security/error scenarios.

### Within Each User Story

- Write tests first and ensure FAIL (Red).
- Implement minimum code to pass (Green).
- Refactor with tests green (Refactor).

### Story Completion Order

1. US1 (MVP)
2. US2
3. US3
4. US4

---

## Parallel Execution Examples

### User Story 1

- Run in parallel: T018, T019, T020, T023, T024, T069
- Run in parallel: T025, T026, T032

### User Story 2

- Run in parallel: T036, T037, T039, T040
- Run in parallel: T041, T042, T045

### User Story 3

- Run in parallel: T047, T048, T049
- Run in parallel: T050, T053

### User Story 4

- Run in parallel: T055, T056, T058, T059
- Run in parallel: T060, T063

---

## Implementation Strategy

### MVP First (US1)

1. Complete Setup (Phase 1)
2. Complete Foundational (Phase 2)
3. Complete US1 (Phase 3)
4. Validate US1 independently before expanding scope

### Incremental Delivery

1. Deliver US1 (core listagem)
2. Add US2 (alertas visuais)
3. Add US3 (trancado)
4. Add US4 (seguranca e resiliencia)
5. Run polish gates

### Team Parallel Strategy

1. Shared completion of Phases 1-2
2. After foundational, parallel tracks by story ownership
3. Merge by story checkpoints with strict test gates
