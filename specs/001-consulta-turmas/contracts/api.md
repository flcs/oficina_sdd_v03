# API Contract: Consulta de Turmas Acadêmicas

**Branch**: `001-consulta-turmas` | **Date**: 2026-03-13
**Base URL**: `http://localhost:3000` (development)

---

## Autenticação

Todos os endpoints protegidos requerem:

```
Authorization: Bearer <jwt_token>
```

O JWT deve conter no payload: `{ "professorId": "<uuid>" }`.
Requisições sem token ou com token inválido são rejeitadas com `401 Unauthorized`.

---

## Endpoint: Listar Alunos de uma Disciplina

### `GET /api/disciplinas/:disciplinaId/alunos`

Retorna a lista de alunos matriculados em uma disciplina do professor autenticado, ordenada
alfabeticamente pelo nome. **Sem paginação.**

#### Parâmetros de Rota

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `disciplinaId` | `string` (UUID) | Sim | Identificador da disciplina |

#### Cabeçalhos

| Cabeçalho | Valor esperado |
|-----------|----------------|
| `Authorization` | `Bearer <jwt_token>` |

#### Respostas

---

##### `200 OK` — Listagem retornada com sucesso

```json
{
  "disciplina": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "Cálculo I"
  },
  "alunos": [
    {
      "id": "1a2b3c4d-0000-0000-0000-000000000001",
      "nome": "Ana Lima",
      "status": "ativo",
      "coeficienteRendimento": 7.5,
      "percentualPresenca": 90.0,
      "alertas": []
    },
    {
      "id": "1a2b3c4d-0000-0000-0000-000000000002",
      "nome": "Bruno Souza",
      "status": "ativo",
      "coeficienteRendimento": 5.5,
      "percentualPresenca": 70.0,
      "alertas": [
        { "categoria": "CR",     "severidade": "VERMELHO", "rotulo": "BAIXA"  },
        { "categoria": "FALTAS", "severidade": "VERMELHO", "rotulo": "FALTAS" }
      ]
    },
    {
      "id": "1a2b3c4d-0000-0000-0000-000000000003",
      "nome": "Carlos Matos",
      "status": "trancado",
      "coeficienteRendimento": null,
      "percentualPresenca": null,
      "alertas": []
    },
    {
      "id": "1a2b3c4d-0000-0000-0000-000000000004",
      "nome": "Diana Rocha",
      "status": "ativo",
      "coeficienteRendimento": null,
      "percentualPresenca": 78.0,
      "alertas": [
        { "categoria": "FALTAS", "severidade": "AMARELO", "rotulo": "FALTAS" }
      ]
    }
  ]
}
```

**Notas sobre os campos**:
- `coeficienteRendimento`: `number` (média P1+P2) ou `null` (notas pendentes **ou** aluno trancado).
- `percentualPresenca`: `number` (0.0–100.0) ou `null` (carga horária zero ou aluno trancado).
- Com notas pendentes, `coeficienteRendimento` fica `null`, mas `percentualPresenca` continua
  calculada normalmente quando houver carga horária válida.
- `alertas`: array com 0, 1 ou 2 itens. Vazio quando não há condição de alerta.
- Lista ordenada por `nome` ASC. Alunos trancados aparecem na mesma ordenação.
- Disciplina com zero alunos: retorna `"alunos": []` sem erro.

**Schema TypeScript do payload**:

```typescript
type SeveridadeAlerta = 'VERMELHO' | 'AMARELO';
type CategoriaAlerta  = 'CR' | 'FALTAS';
type RotuloAlerta     = 'BAIXA' | 'FALTAS';
type StatusAluno      = 'ativo' | 'trancado';

interface AlertaDto {
  categoria:  CategoriaAlerta;
  severidade: SeveridadeAlerta;
  rotulo:     RotuloAlerta;
}

interface AlunoDto {
  id:                     string;
  nome:                   string;
  status:                 StatusAluno;
  coeficienteRendimento:  number | null;
  percentualPresenca:     number | null;
  alertas:                AlertaDto[];
}

interface DisciplinaDto {
  id:   string;
  nome: string;
}

interface ListaAlunosResponse {
  disciplina: DisciplinaDto;
  alunos:     AlunoDto[];
}
```

---

##### `401 Unauthorized` — Token ausente ou inválido

```json
{ "message": "Token de autenticação ausente ou inválido." }
```

---

##### `403 Forbidden` — Professor não é dono da disciplina

```json
{ "message": "Você não possui tal disciplina" }
```

Retornado quando o `professorId` extraído do JWT não corresponde ao professor responsável
pela disciplina informada (FR-010 da spec).

---

##### `503 Service Unavailable` — Falha de servidor

```json
{ "message": "Servidor OFF" }
```

Retornado em qualquer erro inesperado do servidor (falha de banco, exceção não tratada).
O frontend DEVE exibir esta mensagem literalmente ao usuário (FR-011 da spec).

> **Nota de implementação**: o backend retorna `503` (não `500`) para deixar claro que é
> indisponibilidade de serviço, conforme semântica HTTP. O frontend trata ambos da mesma forma.

---

## Regras de Negócio Codificadas no Contrato

| Regra | Manifestação no contrato |
|-------|--------------------------|
| CR = média P1+P2 | `coeficienteRendimento: number` quando ambas presentes |
| Notas pendentes | `coeficienteRendimento: null`, mantendo `percentualPresenca` calculada |
| Trancado = sem CR | `status: "trancado"` sempre acompanha `coeficienteRendimento: null` |
| CR < 6.0 alerta vermelho | `{ categoria: "CR", severidade: "VERMELHO", rotulo: "BAIXA" }` |
| 6.0 ≤ CR ≤ 6.9 alerta amarelo | `{ categoria: "CR", severidade: "AMARELO", rotulo: "BAIXA" }` |
| Presença < 75% alerta vermelho | `{ categoria: "FALTAS", severidade: "VERMELHO", rotulo: "FALTAS" }` |
| 75% ≤ presença ≤ 84% alerta amarelo | `{ categoria: "FALTAS", severidade: "AMARELO", rotulo: "FALTAS" }` |
| Sem alerta para CR ≥ 7.0 / presença ≥ 85% | `alertas: []` para estes casos |
| Ordenação alfabética | lista retornada já ordenada por `nome ASC` |
| Sem paginação | resposta completa em um único payload |

---

## Segurança

- Token JWT verificado com `JWT_SECRET` de variável de ambiente (nunca hardcodado).
- `disciplinaId` validado como UUID antes de ser usado em query SQL.
- Todas as queries ao banco usam parâmetros posicionais (`$1`, `$2`) — sem concatenação
  de string (prevenção de SQL Injection, OWASP A03).
- O endpoint não expõe dados de outros professores — verificação de propriedade é feita
  antes de qualquer consulta de alunos.
