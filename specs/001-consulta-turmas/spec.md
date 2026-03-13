# Feature Specification: Consulta de Turmas Acadêmicas

**Feature Branch**: `001-consulta-turmas`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: User description: "Crie a especificação funcional para a consulta de turmas acadêmicas."

## Clarifications

### Session 2026-03-13

- Q: Quando P1/P2 estiver pendente, presença deve continuar calculada ou exibir `-`? → A: Calcular e exibir presença sempre que houver cargaHoraria e faltas válidas, mesmo com P1/P2 pendentes

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Visualizar lista de alunos de uma disciplina (Priority: P1)

Um professor autenticado seleciona uma de suas disciplinas e visualiza a lista completa de alunos
matriculados, ordenada alfabeticamente por nome, contendo CR, percentual de presença e alertas
visuais para cada aluno.

**Why this priority**: Esta é a funcionalidade central da tela — sem ela nenhuma outra história
entrega valor. É o ponto de acesso a todos os dados e indicadores da turma.

**Independent Test**: Pode ser testada criando uma disciplina com alunos cadastrados, acessando
a tela com o professor dono da disciplina e verificando que a lista aparece ordenada
alfabeticamente com todos os dados preenchidos. Entrega valor imediato: visibilidade completa
da situação acadêmica da turma.

**Acceptance Scenarios**:

1. **Given** o professor está autenticado e tem a disciplina "Cálculo I" com 3 alunos cadastrados,
   **When** seleciona "Cálculo I" na tela,
   **Then** a lista exibe os 3 alunos em ordem alfabética pelo nome, cada um com nome, CR, percentual de presença e os alertas visuais aplicáveis.

2. **Given** todos os alunos possuem P1 e P2 registradas,
   **When** a lista é exibida,
   **Then** o CR de cada aluno é calculado como média de P1 e P2 (política `PolíticaNotasMedia`) e o percentual de presença é calculado com base na carga horária e nas faltas registradas.

3. **Given** um aluno possui apenas P1 registrada (P2 pendente),
   **When** a lista é exibida,
  **Then** o campo CR desse aluno exibe o caractere `-`, nenhum cálculo de média é realizado e a presença é calculada normalmente a partir de carga horária e faltas.

4. **Given** um aluno não possui P1 nem P2 registradas,
   **When** a lista é exibida,
  **Then** o campo CR desse aluno exibe o caractere `-` e a presença é calculada normalmente a partir de carga horária e faltas (quando a carga horária for válida).

---

### User Story 2 - Alertas visuais de desempenho e presença (Priority: P2)

Após visualizar a lista, o professor consegue identificar rapidamente alunos em situação de risco
acadêmico (CR baixo) ou risco de reprovação por falta, pois cada linha exibe badges coloridos de
alerta diretamente na tabela.

**Why this priority**: Os alertas visuais transformam a lista de dados brutos em informação
acionável. Dependem diretamente da User Story 1 (os dados precisam existir), mas são um
incremento claro e independentemente demonstrável.

**Independent Test**: Pode ser testada com alunos de CR e presença variados e verificando que
as cores e rótulos dos badges correspondem exatamente às regras definidas, sem precisar das
funcionalidades de segurança ou de alunos trancados.

**Acceptance Scenarios**:

1. **Given** um aluno com CR calculado = 5.5,
   **When** a lista é exibida,
   **Then** o badge de CR apresenta cor vermelha e rótulo "BAIXA".

2. **Given** um aluno com CR calculado = 6.4,
   **When** a lista é exibida,
   **Then** o badge de CR apresenta cor amarela e rótulo "BAIXA".

3. **Given** um aluno com CR calculado = 7.0,
   **When** a lista é exibida,
   **Then** nenhum badge de alerta de CR é exibido para esse aluno.

4. **Given** um aluno com percentual de presença = 70%,
   **When** a lista é exibida,
   **Then** o badge de presença apresenta cor vermelha e rótulo "FALTAS".

5. **Given** um aluno com percentual de presença = 80%,
   **When** a lista é exibida,
   **Then** o badge de presença apresenta cor amarela e rótulo "FALTAS".

6. **Given** um aluno com percentual de presença = 85%,
   **When** a lista é exibida,
   **Then** nenhum badge de alerta de presença é exibido para esse aluno.

7. **Given** um aluno com notas pendentes (CR exibe `-`),
   **When** a lista é exibida,
  **Then** o campo CR exibe `-`, nenhum badge de CR é exibido e os badges de presença seguem as regras normais de presença calculada.

---

### User Story 3 - Alunos com status "Trancado" (Priority: P3)

O professor consegue identificar visualmente alunos que trancaram a matrícula na disciplina, que
aparecem na lista com um badge específico de "Trancado", sem exibição de CR calculado.

**Why this priority**: Complementa a visibilidade da turma sem bloquear as histórias anteriores.
Um aluno trancado não faz parte do cálculo acadêmico ativo, mas sua presença na lista é necessária
para completude do registro da turma.

**Independent Test**: Pode ser testada incluindo um aluno com status "Trancado" na turma e
verificando que ele aparece na lista com o badge correto e sem CR calculado, enquanto os demais
alunos ativos mantêm seus dados normais.

**Acceptance Scenarios**:

1. **Given** um aluno com status "Trancado" está matriculado na disciplina,
   **When** a lista é exibida,
   **Then** o aluno aparece na lista com um badge visual "Trancado" e o campo CR exibe o caractere `-`.

2. **Given** um aluno com status "Trancado" possui P1 e P2 registradas,
   **When** a lista é exibida,
   **Then** o CR ainda exibe `-` e nenhum cálculo de média é realizado para ele.

3. **Given** a turma contém alunos ativos e trancados,
   **When** a lista é exibida,
   **Then** ambos os grupos aparecem juntos na ordenação alfabética, sendo o status "Trancado" indicado apenas pelo badge.

---

### User Story 4 - Controle de acesso e tratamento de falha do servidor (Priority: P4)

O sistema protege o acesso aos dados da turma, impedindo que um professor consulte alunos de uma
disciplina que não é sua, e informa corretamente o usuário quando o servidor está indisponível.

**Why this priority**: Segurança é inegociável mas não bloqueia a demonstração das histórias
anteriores em ambiente controlado. Esta história trata dos cenários de erro e fronteiras do sistema.

**Independent Test**: Pode ser testada simulando um professor tentando acessar a disciplina de
outro professor (espera-se mensagem de acesso negado) e simulando falha do servidor (espera-se
a mensagem de servidor indisponível).

**Acceptance Scenarios**:

1. **Given** o professor "Professor A" tenta consultar a disciplina "Banco de Dados" que pertence ao "Professor B",
   **When** a requisição de listagem é processada,
   **Then** o sistema nega o acesso, a interface exibe a mensagem "Você não possui tal disciplina" e nenhum dado de alunos é retornado.

2. **Given** o professor está autenticado e tenta acessar uma disciplina sua,
   **When** o servidor está indisponível,
   **Then** a interface exibe a mensagem "Servidor OFF" e nenhum dado parcial é exibido.

---

### Edge Cases

- O que acontece quando a disciplina existe mas não tem alunos matriculados? → A lista é exibida vazia (sem linhas), sem erro.
- O que acontece quando a carga horária da disciplina é zero? → O percentual de presença não é calculado e exibe `-` para todos os alunos.
- O que acontece quando P1 = 0.0 e P2 está registrada? → O zero é um valor válido; a média é calculada normalmente entre P1=0.0 e P2.
- O que acontece quando P1 ou P2 está pendente? → O CR exibe `-`, mas a presença continua sendo calculada normalmente com base em carga horária e faltas.
- O que acontece quando um aluno possui status "Trancado" e falta de notas simultaneamente? → O status "Trancado" tem precedência; exibe badge "Trancado" e `-` no CR.
- O que acontece quando dois alunos têm o mesmo nome? → A ordenação é estável; a ordem relativa entre homônimos é preservada tal como retornada pelo servidor.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir a lista de alunos de uma disciplina selecionada, ordenada
  alfabeticamente pelo nome do aluno (ordem crescente, A→Z).
- **FR-002**: O sistema DEVE calcular o CR de cada aluno utilizando a política `PolíticaNotasMedia`,
  definida como a média aritmética simples de P1 e P2.
- **FR-003**: O sistema DEVE calcular o percentual de presença de cada aluno com base na carga
  horária da disciplina e no número de faltas registradas, independentemente de P1 e P2 estarem pendentes.
- **FR-004**: O sistema DEVE exibir o caractere `-` no campo CR quando P1 ou P2 (ou ambas) estiverem
  ausentes, sem realizar qualquer cálculo parcial de média.
- **FR-005**: O sistema DEVE exibir um badge vermelho com rótulo "BAIXA" para o CR de alunos cujo
  coeficiente calculado seja inferior a 6.0.
- **FR-006**: O sistema DEVE exibir um badge amarelo com rótulo "BAIXA" para o CR de alunos cujo
  coeficiente calculado esteja no intervalo de 6.0 a 6.9 (inclusive extremos).
- **FR-007**: O sistema DEVE exibir um badge vermelho com rótulo "FALTAS" para o percentual de
  presença de alunos com presença calculada abaixo de 75%.
- **FR-008**: O sistema DEVE exibir um badge amarelo com rótulo "FALTAS" para o percentual de
  presença de alunos com presença calculada entre 75% e 84% (inclusive extremos).
- **FR-009**: O sistema DEVE exibir um badge visual "Trancado" para alunos com status "Trancado",
  sem calcular CR para esses alunos (campo CR exibe `-`).
- **FR-010**: O sistema DEVE negar o acesso e exibir a mensagem "Você não possui tal disciplina"
  quando um professor tentar consultar uma disciplina que não pertence a ele.
- **FR-011**: O sistema DEVE exibir a mensagem "Servidor OFF" quando a comunicação com o servidor
  falhar, independentemente do motivo da falha.
- **FR-012**: A interface DEVE ser exclusivamente de leitura (read-only); nenhuma ação de edição,
  inserção ou exclusão de dados é exposta nesta tela.

### Key Entities

- **Disciplina**: Representa uma matéria acadêmica. Atributos relevantes: identificador, nome,
  carga horária total, professor responsável.
- **Aluno**: Representa um estudante matriculado. Atributos relevantes: identificador, nome
  completo, status de matrícula (ativo / trancado).
- **Matrícula**: Representa o vínculo entre um Aluno e uma Disciplina. Contém as notas P1 e P2
  (podem estar ausentes/pendentes) e o registro de faltas.
- **PolíticaNotasMedia**: Abstração que encapsula a regra de cálculo do CR. Nesta versão, computa
  a média aritmética simples de P1 e P2, mas a abstração permite substituição futura sem alteração
  dos consumidores.
- **AlertaAcademico**: Representa um indicador visual atribuído a um aluno em uma disciplina,
  descrevendo a categoria (CR / FALTAS), a severidade (VERMELHO / AMARELO) e o rótulo exibido.

## Assumptions

- O professor já está autenticado no sistema antes de acessar esta tela; autenticação é
  responsabilidade de outra funcionalidade.
- Apenas as notas P1 e P2 são consideradas para o CR nesta versão; notas adicionais (P3,
  substitutiva etc.) são fora de escopo.
- "Carga horária" é expressa em horas e está disponível como dado da disciplina no servidor.
- "Faltas" são contadas em horas (consonante com a carga horária) ou em um número inteiro que
  permite o cálculo proporcional; a unidade exata é consistente entre os dois campos.
- O intervalo CR 6.0–6.9 do alerta amarelo significa: `6.0 ≤ CR ≤ 6.9`.
- O intervalo presença 75%–84% do alerta amarelo significa: `75% ≤ presença ≤ 84%`.
- CR ≥ 7.0 e presença ≥ 85% não geram nenhum alerta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das regras de alerta visual (5 condições: CR vermelho, CR amarelo, ausência de alerta de CR, presença vermelha, presença amarela) são verificáveis por testes automatizados isolados.
- **SC-002**: A lista de alunos é exibida em ordem estritamente alfabética em 100% dos cenários, incluindo turmas com homônimos e alunos trancados.
- **SC-003**: Nenhum dado de aluno é retornado ou exibido quando o professor acessa uma disciplina que não é sua — controle de acesso verificável em 100% das tentativas.
- **SC-004**: A mensagem de servidor indisponível ("Servidor OFF") é exibida em 100% dos cenários de falha de comunicação, sem exibição de dados parciais.
- **SC-005**: O caractere `-` é exibido no campo CR em 100% dos casos em que P1 ou P2 estão pendentes, ou o aluno está trancado, e a presença continua sendo calculada nesses casos quando houver carga horária válida.
