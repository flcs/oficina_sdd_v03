# Data Model: Consulta de Turmas Acadêmicas

**Branch**: `001-consulta-turmas` | **Date**: 2026-03-13
**Source**: research.md (R-001, R-002, R-006), spec.md (Key Entities)

---

## Design Constraints

- **Object Calisthenics Regra 8**: máximo 2 variáveis de instância por classe.
  Entidades compostas são modeladas como cadeias de composição (ver seção abaixo).
- **Regra 3**: todos os primitivos de domínio (strings, numbers) são encapsulados em
  value objects dedicados.
- **Regra 4**: coleções de domínio são first-class collections (uma classe wrapper, sem
  outras variáveis de instância).
- **Regra 9**: nenhum getter/setter — as classes expõem comportamento (métodos nomeados
  intencionalmente), não dados brutos.

---

## Database Schema (PostgreSQL)

```sql
CREATE TABLE professores (
  id   UUID PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE disciplinas (
  id            UUID    PRIMARY KEY,
  nome          TEXT    NOT NULL,
  carga_horaria INTEGER NOT NULL CHECK (carga_horaria >= 0),
  professor_id  UUID    NOT NULL REFERENCES professores(id)
);

CREATE TABLE alunos (
  id   UUID PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE matriculas (
  id            UUID         PRIMARY KEY,
  aluno_id      UUID         NOT NULL REFERENCES alunos(id),
  disciplina_id UUID         NOT NULL REFERENCES disciplinas(id),
  nota_p1       NUMERIC(4,2),              -- NULL = nota pendente
  nota_p2       NUMERIC(4,2),              -- NULL = nota pendente
  faltas        INTEGER      NOT NULL DEFAULT 0 CHECK (faltas >= 0),
  status        TEXT         NOT NULL DEFAULT 'ativo'
                             CHECK (status IN ('ativo', 'trancado')),
  UNIQUE (aluno_id, disciplina_id)
);
```

---

## Domain Layer — Value Objects

Cada value object encapsula um primitivo com validação e semântica de domínio.
Todos válidos para Calisthenics Regra 8 (≤ 2 variáveis de instância).

| Classe | Tipo interno | Invariante / Comportamento-chave |
|--------|-------------|----------------------------------|
| `IdentificadorAluno` | `string` (UUID) | `ehIgual(outro)` |
| `IdentificadorDisciplina` | `string` (UUID) | `ehIgual(outro)` |
| `IdentificadorProfessor` | `string` (UUID) | `ehIgual(outro)` |
| `NomeAluno` | `string` | não vazio; `exibir(): string` |
| `NotaProva` | `number \| null` | 0.0–10.0 se presente; `estaPendente(): boolean`; `valor(): number \| null` |
| `CargaHoraria` | `number` (inteiro ≥ 0) | `ehZero(): boolean` |
| `QuantidadeFaltas` | `number` (inteiro ≥ 0) | |
| `StatusMatricula` | `'ativo' \| 'trancado'` | `estaTrancado(): boolean` |
| `CoeficienteRendimento` | `number \| null` | null = notas pendentes; `estaAbaixoDe(limiar): boolean` |
| `PercentualPresenca` | `number \| null` | null = carga horária zero; `estaAbaixoDe(limiar): boolean` |
| `CategoriaAlerta` | `'CR' \| 'FALTAS'` | |
| `SeveridadeAlerta` | `'VERMELHO' \| 'AMARELO'` | |

---

## Domain Layer — Entities (Cadeias de Composição)

As cadeias abaixo satisfazem Calisthenics Regra 8 em toda a hierarquia.
Cada linha lista as exatamente 2 variáveis de instância da classe.

### Cadeia de entrada (dados brutos do banco)

```
NotasAvaliacao
  notaP1: NotaProva
  notaP2: NotaProva
  → ambosPresentes(): boolean
  → calcularMedia(politica: PoliticaNotasMedia): CoeficienteRendimento

InformacoesPresenca
  cargaHoraria: CargaHoraria
  faltas: QuantidadeFaltas
  → calcularPercentual(): PercentualPresenca

PerfilAcademico
  notas: NotasAvaliacao
  presenca: InformacoesPresenca

DadosMatricula
  perfil: PerfilAcademico
  status: StatusMatricula
  → estaTrancado(): boolean

Aluno
  identificador: IdentificadorAluno
  nome: NomeAluno
  → exibirNome(): string

RegistroMatricula                        ← entidade raiz de entrada
  aluno: Aluno
  dados: DadosMatricula
```

### Cadeia de saída (resultados computados para a UI)

```
AlertaAcademico
  categoria: CategoriaAlerta
  severidade: SeveridadeAlerta
  → descricao(): string    ("CR/VERMELHO", etc.)

AlertasAcademicos                        ← first-class collection (Regra 4)
  alertas: AlertaAcademico[]
  → adicionar(alerta: AlertaAcademico): AlertasAcademicos
  → listar(): readonly AlertaAcademico[]
  → estaVazia(): boolean

SituacaoAcademica
  coeficiente: CoeficienteRendimento
  percentualPresenca: PercentualPresenca

DadosLinhaRelatorio
  situacao: SituacaoAcademica
  alertas: AlertasAcademicos

LinhaRelatorioAcademico                  ← entidade raiz de saída
  aluno: Aluno
  dados: DadosLinhaRelatorio
```

Primeira-class collection alternativa para a lista de resultados:

```
ListaRelatorioAcademico                  ← first-class collection (Regra 4)
  linhas: LinhaRelatorioAcademico[]
  → ordenarAlfabeticamente(): ListaRelatorioAcademico
  → porStatus(status: StatusMatricula): ListaRelatorioAcademico
  → listar(): readonly LinhaRelatorioAcademico[]
```

Primeira-class collection para a saída do repositório:

```
ListaMatriculas                          ← first-class collection (Regra 4)
  matriculas: RegistroMatricula[]
  → listar(): readonly RegistroMatricula[]
```

---

## Domain Layer — Policies

```
PoliticaNotasMedia                       ← interface (abstração)
  calcular(notas: NotasAvaliacao): CoeficienteRendimento

PoliticaNotasMediaImpl                   ← implementação concreta
  (sem variáveis de instância — stateless)
  calcular(notas: NotasAvaliacao): CoeficienteRendimento
  → se notas.ambosPresentes() = false → CoeficienteRendimento(null)
  → senão → CoeficienteRendimento((p1 + p2) / 2)
```

---

## Domain Layer — Services

```
CalculadoraPresenca
  (sem variáveis de instância — stateless)
  calcular(info: InformacoesPresenca): PercentualPresenca
  → se cargaHoraria.ehZero() → PercentualPresenca(null)
  → senão → PercentualPresenca(((cargaHoraria - faltas) / cargaHoraria) * 100)

GeradorAlertasCR
  (sem variáveis de instância — stateless)
  gerar(coeficiente: CoeficienteRendimento): AlertaAcademico | null
  → CR null         → null
  → CR < 6.0        → AlertaAcademico(CategoriaAlerta.CR, SeveridadeAlerta.VERMELHO)
  → 6.0 ≤ CR ≤ 6.9 → AlertaAcademico(CategoriaAlerta.CR, SeveridadeAlerta.AMARELO)
  → CR ≥ 7.0        → null

GeradorAlertasPresenca
  (sem variáveis de instância — stateless)
  gerar(presenca: PercentualPresenca): AlertaAcademico | null
  → presença null         → null
  → presença < 75%        → AlertaAcademico(CategoriaAlerta.FALTAS, SeveridadeAlerta.VERMELHO)
  → 75% ≤ presença ≤ 84%  → AlertaAcademico(CategoriaAlerta.FALTAS, SeveridadeAlerta.AMARELO)
  → presença ≥ 85%        → null

CompositorRelatorio
  politica: PoliticaNotasMedia
  calculadora: CalculadoraPresenca
  → compor(registro: RegistroMatricula): LinhaRelatorioAcademico
    Internamente cria GeradorAlertasCR e GeradorAlertasPresenca (sem estado)
    e compõe as cadeias de saída
```

---

## Domain Layer — Errors

```
AcessoNegadoException extends Error
  mensagem: string ("Você não possui tal disciplina")
  → construtor não requer variáveis de instância além da mensagem herdada
```

---

## Domain Layer — Repository Interface

```
IRepositorioTurmas                       ← interface (domínio, sem importação de pg)
  verificarPropriedadeDisciplina(
    disciplinaId: IdentificadorDisciplina,
    professorId: IdentificadorProfessor
  ): Promise<void>                       // throws AcessoNegadoException

  buscarMatriculasDaDisciplina(
    disciplinaId: IdentificadorDisciplina
  ): Promise<ListaMatriculas>
```

---

## Application Layer — Use Case

```
ServicoConsultaTurmas
  repositorio: IRepositorioTurmas
  compositor: CompositorRelatorio
  → listarAlunos(
      disciplinaId: IdentificadorDisciplina,
      professorId: IdentificadorProfessor
    ): Promise<ListaRelatorioAcademico>
  Fluxo:
    1. repositorio.verificarPropriedadeDisciplina(disciplinaId, professorId)
    2. matriculas ← repositorio.buscarMatriculasDaDisciplina(disciplinaId)
    3. linhas ← matriculas.listar().map(m => compositor.compor(m))
    4. new ListaRelatorioAcademico(linhas).ordenarAlfabeticamente()
```

---

## Infrastructure Layer — Repository Implementation

```
RepositorioTurmasPg implements IRepositorioTurmas
  pool: pg.Pool
  (1 variável de instância — Regra 8 ✅)

  Row interface interna:
    DisciplinaRow { professor_id: string }
    MatriculaRow  {
      aluno_id: string; aluno_nome: string;
      nota_p1: number | null; nota_p2: number | null;
      faltas: number; status: string; carga_horaria: number
    }
```

---

## Infrastructure Layer — HTTP

```
autenticacaoJwt (Express middleware)
  Lê JWT_SECRET de process.env (não hardcodado)
  Verifica header Authorization: Bearer <token>
  Usa type narrowing explícito para extrair professorId: string
  Injeta professorId em res.locals
  Retorna 401 se token ausente ou inválido

TurmasController
  servico: ServicoConsultaTurmas
  (1 variável de instância — Regra 8 ✅)
  listarAlunos(req, res):
    → chama servico.listarAlunos(disciplinaId, professorId)
    → AcessoNegadoException → 403 { message: "Você não possui tal disciplina" }
    → Qualquer outro erro   → 503 { message: "Servidor OFF" }
    → OK                    → 200 { disciplina, alunos }
```

---

## Frontend Layer — Domain Mirror

O frontend replica as classes de value objects, entities e services do domínio backend
em `frontend/src/domain/`. As classes são **idênticas em comportamento** — a duplicação
é explícita e controlada (ver Complexity Tracking no plan.md).

O hook `useConsultaTurmas` segue o padrão:
```
useConsultaTurmas(disciplinaId: string): {
  linhas: LinhaRelatorioAcademico[];
  carregando: boolean;
  erro: string | null;
}
```

O `ClienteHttpTurmas` encapsula o `fetch` e mapeia a resposta JSON para as entities de
domínio do frontend, lançando erro com mensagem "Servidor OFF" em falhas de rede.

---

## State Transitions

### StatusMatricula

```
ativo ──(trancamento)──→ trancado
```

Não há transição de volta neste escopo (read-only).

### NotaProva (por avaliação)

```
null (pendente) ──(lançamento de nota)──→ number (0.0–10.0)
```

O lançamento de notas está fora do escopo desta feature (read-only).

---

## Validation Rules Summary

| Campo | Regra |
|-------|-------|
| `nota_p1`, `nota_p2` | `NULL` = pendente; quando presente: 0.0 ≤ valor ≤ 10.0 |
| `carga_horaria` | inteiro ≥ 0; quando 0, presença não calculada (retorna `null`) |
| `faltas` | inteiro ≥ 0 |
| `status` | enum restrito: `'ativo'` ou `'trancado'` |
| Presença com nota pendente | continua calculada normalmente a partir de `carga_horaria` e `faltas` |
| CR alerta vermelho | CR < 6.0 (CR não nulo) |
| CR alerta amarelo | 6.0 ≤ CR ≤ 6.9 |
| Presença alerta vermelho | presença < 75% (presença não nula) |
| Presença alerta amarelo | 75% ≤ presença ≤ 84% |
| CR com status trancado | sempre `null` — não calculado |
