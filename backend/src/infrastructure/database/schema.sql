CREATE TABLE IF NOT EXISTS professores (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS disciplinas (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  carga_horaria INTEGER NOT NULL CHECK (carga_horaria >= 0),
  professor_id UUID NOT NULL REFERENCES professores(id)
);

CREATE TABLE IF NOT EXISTS alunos (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS matriculas (
  id UUID PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES alunos(id),
  disciplina_id UUID NOT NULL REFERENCES disciplinas(id),
  nota_p1 NUMERIC(4,2),
  nota_p2 NUMERIC(4,2),
  faltas INTEGER NOT NULL DEFAULT 0 CHECK (faltas >= 0),
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'trancado')),
  UNIQUE (aluno_id, disciplina_id)
);
