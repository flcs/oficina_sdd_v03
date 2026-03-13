# Research: Consulta de Turmas Acadêmicas

**Branch**: `001-consulta-turmas` | **Date**: 2026-03-13
**Purpose**: Resolve all technical unknowns identified in the Technical Context before Phase 1 design.

---

## R-001 — OOP + React Hooks: Coexistência com Object Calisthenics

**Question**: Como satisfazer Object Calisthenics (Regra 1–9) e OOP quando React exige
componentes funcionais e hooks?

**Decision**: Separação estrita em duas camadas:

1. **Camada de Domínio e Aplicação** (pura TypeScript, sem React): todas as regras de
   Object Calisthenics se aplicam integralmente. Classes `PoliticaNotasMedia`,
   `CalculadoraPresenca`, `GeradorAlertasCR`, `GeradorAlertasPresenca`, `CompositorRelatorio`,
   `ServicoConsultaTurmas` e todos os value objects/entities são classes TypeScript sem
   nenhuma importação de React.

2. **Camada de UI** (React): componentes funcionais são adaptadores presentacionais thin.
   Recebem props tipadas (value objects serializados), não executam lógica de domínio.
   Hooks (`useConsultaTurmas`) chamam a camada de aplicação e mapeiam o resultado para
   estado React — são funções coordenadoras, não classes.

**Rationale**: A constituição afirma explicitamente "No domain logic may leak into React
components — components are strictly presentational adapters" e "Class-based React components
are prohibited." Hooks satisfazem o spirit da OOP (encapsulamento de comportamento, injeção de
dependências via parâmetros) sem violar o modelo de programação do React.

**Alternatives considered**:
- Componentes de classe React: proibidos pela constituição e pelo ecossistema React moderno.
- Colocar lógica de domínio no hook: viola SRP e OOP (mistura responsabilidades).

---

## R-002 — Object Calisthenics Regra 8: 2 Variáveis de Instância em Entidades Compostas

**Question**: Como modelar `RegistroMatricula` (que naturalmente tem 4+ atributos) respeitando
o limite de 2 variáveis de instância por classe?

**Decision**: Cadeias de composição. Cada classe agrupa exatamente 2 responsabilidades em
2 variáveis, formando uma hierarquia de composição:

```
NotasAvaliacao          { notaP1: NotaProva,          notaP2: NotaProva          }
InformacoesPresenca     { cargaHoraria: CargaHoraria, faltas: QuantidadeFaltas   }
PerfilAcademico         { notas: NotasAvaliacao,       presenca: InformacoesPresenca }
DadosMatricula          { perfil: PerfilAcademico,     status: StatusMatricula   }
RegistroMatricula       { aluno: Aluno,                dados: DadosMatricula     }
Aluno                   { identificador: IdentificadorAluno, nome: NomeAluno    }
```

Para o modelo de saída:
```
AlertaAcademico         { categoria: CategoriaAlerta,    severidade: SeveridadeAlerta  }
AlertasAcademicos       { alertas: AlertaAcademico[]  }  ← first-class collection (Regra 4)
SituacaoAcademica       { coeficiente: CoeficienteRendimento, percentualPresenca: PercentualPresenca }
DadosLinhaRelatorio     { situacao: SituacaoAcademica,  alertas: AlertasAcademicos    }
LinhaRelatorioAcademico { aluno: Aluno,                  dados: DadosLinhaRelatorio   }
```

**Rationale**: A Regra 8 força composição sobre herança e previne "God Objects". A decomposição
reflete coesão semântica real: `NotasAvaliacao` é um conceito coeso (as duas provas),
`InformacoesPresenca` é coeso (horária + faltas).

**Alternatives considered**:
- Records/interfaces planos: violam OOP e as Regras 3 e 8.
- Herança para adicionar campos: viola OCP e LSP.

---

## R-003 — Repository Pattern com `pg` nativo e TypeScript Strict

**Question**: Como implementar `IRepositorioTurmas` usando `pg.Pool` sem ORM e com
tipagem estrita?

**Decision**:

1. `IRepositorioTurmas` define o contrato no domínio (sem importação de `pg`):
```typescript
interface IRepositorioTurmas {
  verificarPropriedadeDisciplina(
    disciplinaId: IdentificadorDisciplina,
    professorId: IdentificadorProfessor
  ): Promise<void>;  // throws AcessoNegadoException se não for dono

  buscarMatriculasDaDisciplina(
    disciplinaId: IdentificadorDisciplina
  ): Promise<ListaMatriculas>;
}
```

2. `RepositorioTurmasPg` (infraestrutura) recebe `pg.Pool` no construtor:
```typescript
class RepositorioTurmasPg implements IRepositorioTurmas {
  constructor(private readonly pool: pg.Pool) {}
  // ...
}
```

3. Resultados de query são tipados via interfaces de Row dedicadas:
```typescript
interface DisciplinaRow { professor_id: string }
interface MatriculaRow  { id: string; nome: string; nota_p1: number | null; /* ... */ }
```

4. **Segurança**: Todas as queries usam parâmetros posicionais (`$1`, `$2`) — nunca
   concatenação de string. Isso previne SQL Injection (OWASP A03).

**Rationale**: Separação entre interface de domínio e implementação de infraestrutura garante
DIP (SOLID). A tipagem explícita dos Rows previne erros em runtime e garante `strict: true`.

**Alternatives considered**:
- TypeORM/Prisma: proibido pelo requisito do usuário ("driver nativo pg").
- `any` para tipagem de rows: proibido pela constituição.

---

## R-004 — JWT Validation em Express

**Question**: Como implementar autenticação JWT em Express com TypeScript strict sem `any`?

**Decision**:

1. Middleware `autenticacaoJwt` verifica o header `Authorization: Bearer <token>`.
2. Usa `jsonwebtoken.verify()` com secret da variável de ambiente `JWT_SECRET`.
3. Payload tipado via interface dedicada e narrowing explícito:
```typescript
interface JwtPayload { professorId: string }

function isJwtPayload(value: unknown): value is JwtPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'professorId' in value &&
    typeof (value as Record<string, unknown>)['professorId'] === 'string'
  );
}
```
4. O `professorId` validado é injetado em `res.locals.professorId` (tipagem via `declare
   module 'express'` augmentation) para consumo no controller.
5. JWT_SECRET **nunca** hardcodado — lido de `process.env.JWT_SECRET` com validação de
   presença na inicialização do servidor.

**Rationale**: Type narrowing explícito garante `strict: true` sem `any`. Variáveis de
ambiente para secrets segue OWASP A02 (Cryptographic Failures) e A05 (Misconfiguration).

**Alternatives considered**:
- `passport-jwt`: dependência adicional desnecessária para este escopo.
- `(payload as JwtPayload)` sem narrowing: unsafe assertion — proibida pela constituição.

---

## R-005 — TDD Ordering para Fullstack

**Question**: Qual sequência de TDD respeita as dependências entre camadas?

**Decision**: Domain-first, outside-in por camada:

```
BACKEND:
  1. Value objects (sem dependências)
  2. Entities compostas (dependem dos value objects)
  3. Policies (PoliticaNotasMedia — depende de value objects)
  4. Domain services (CalculadoraPresenca, GeradorAlertasCR, GeradorAlertasPresenca)
  5. CompositorRelatorio (depende de 3 e 4)
  6. ServicoConsultaTurmas com IRepositorioTurmas mockado
  7. RepositorioTurmasPg (integration test com banco de teste real)
  8. TurmasController + autenticacaoJwt (test de rota com Supertest)

FRONTEND:
  1. Value objects e entities (espelho do backend)
  2. Policies e domain services (lógica de alerta — idêntica ao backend)
  3. ClienteHttpTurmas com fetch mockado
  4. Componentes (BadgeAlerta, BadgeTrancado, LinhaAluno, TabelaAlunos) com RTL
  5. Hook useConsultaTurmas com ClienteHttpTurmas mockado
  6. PaginaConsultaTurmas (integração dos componentes acima)
```

**Rationale**: Testar de dentro para fora garante que cada Red-Green-Refactor cycle seja
isolado e rápido. Testes de integração (repositório + banco real) ficam por último pois são
os mais lentos e dependem de infraestrutura externa.

**Alternatives considered**:
- Outside-in (componentes primeiro): componentes precisariam de stubs de toda a cadeia de
  domínio; ciclos Red-Green seriam mais longos e frágeis.

---

## R-006 — Schema PostgreSQL

**Question**: Qual schema de tabelas suporta todos os requisitos sem ORM?

**Decision**:

```sql
CREATE TABLE professores (
  id   UUID PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE disciplinas (
  id            UUID PRIMARY KEY,
  nome          TEXT    NOT NULL,
  carga_horaria INTEGER NOT NULL CHECK (carga_horaria >= 0),
  professor_id  UUID    NOT NULL REFERENCES professores(id)
);

CREATE TABLE alunos (
  id   UUID PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE matriculas (
  id            UUID          PRIMARY KEY,
  aluno_id      UUID          NOT NULL REFERENCES alunos(id),
  disciplina_id UUID          NOT NULL REFERENCES disciplinas(id),
  nota_p1       NUMERIC(4,2),                    -- NULL = pendente
  nota_p2       NUMERIC(4,2),                    -- NULL = pendente
  faltas        INTEGER       NOT NULL DEFAULT 0 CHECK (faltas >= 0),
  status        TEXT          NOT NULL DEFAULT 'ativo'
                              CHECK (status IN ('ativo', 'trancado')),
  UNIQUE (aluno_id, disciplina_id)
);
```

**Query de listagem** (parameterizada — sem risco de SQL Injection):

```sql
-- Passo 1: verificar propriedade (throws AcessoNegadoException se 0 rows)
SELECT id FROM disciplinas WHERE id = $1 AND professor_id = $2;

-- Passo 2: buscar matrículas (apenas se passo 1 passou)
SELECT
  a.id            AS aluno_id,
  a.nome          AS aluno_nome,
  m.nota_p1,
  m.nota_p2,
  m.faltas,
  m.status,
  d.carga_horaria
FROM matriculas m
JOIN alunos      a ON a.id = m.aluno_id
JOIN disciplinas d ON d.id = m.disciplina_id
WHERE m.disciplina_id = $1
ORDER BY a.nome ASC;
```

**Rationale**: A verificação de propriedade em passo separado permite lançar
`AcessoNegadoException` explicitamente (vs. confundir com "disciplina não existe").
ORDER BY no banco garante consistência da ordenação alfabética independente do locale do
servidor Node.js.

**Alternatives considered**:
- Query única com `JOIN disciplinas WHERE professor_id = $2`: retornaria 0 rows tanto para
  "não é dono" quanto para "disciplina sem alunos" — ambiguidade indesejada.

---

## R-007 — Regra Final de Presenca com Notas Pendentes

**Question**: Quando P1/P2 estiverem pendentes, a presenca deve ser ocultada (`-`) ou calculada?

**Decision**: A presenca e sempre calculada quando `carga_horaria > 0`, independentemente de
P1/P2 estarem pendentes. Apenas o CR fica `null`/`-` quando faltar nota.

**Rationale**: Presenca deriva de faltas e carga horaria, nao de notas. Acoplar presenca a
disponibilidade de P1/P2 mistura regras de negocio independentes e reduz visibilidade do risco
por faltas exatamente quando o professor mais precisa da informacao.

**Alternatives considered**:
- Exibir `-` para presenca quando nota pendente: rejeitada por perda de informacao funcional.
- Exibir presenca so quando ambas notas existirem: rejeitada por acoplamento indevido entre
  avaliacao e frequencia.

---

## Summary — All NEEDS CLARIFICATION: Resolved

| Item | Resolution |
|------|------------|
| Stack frontend/backend | TypeScript + React + Vite (frontend); Node.js + Express + pg (backend) |
| ORM | Nenhum — `pg` nativo apenas |
| Auth | JWT no header `Authorization: Bearer` — middleware Express |
| Calisthenics Regra 8 | Cadeias de composição (R-002) |
| React + OOP | Separação de camadas (R-001) |
| TDD ordering | Domain-first, inside-out (R-005) |
| Schema SQL | Definido em R-006 |
| Presenca com notas pendentes | Sempre calculada (R-007) |
