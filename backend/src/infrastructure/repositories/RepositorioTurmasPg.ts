import type { Pool } from "pg";
import { AcessoNegadoException } from "../../domain/errors/AcessoNegadoException.js";
import type {
  DisciplinaMeta,
  IRepositorioTurmas,
  MatriculaRegistro
} from "../../domain/repositories/IRepositorioTurmas.js";

interface DisciplinaRow {
  id: string;
  nome: string;
  carga_horaria: number;
  professor_id: string;
}

interface MatriculaRow {
  aluno_id: string;
  aluno_nome: string;
  nota_p1: number | null;
  nota_p2: number | null;
  faltas: number;
  status: "ativo" | "trancado";
  carga_horaria: number;
}

export class RepositorioTurmasPg implements IRepositorioTurmas {
  public constructor(private readonly pool: Pool) {}

  public async verificarPropriedadeDisciplina(disciplinaId: string, professorId: string): Promise<void> {
    const query = "SELECT id FROM disciplinas WHERE id = $1 AND professor_id = $2";
    const result = await this.pool.query<{ id: string }>(query, [disciplinaId, professorId]);

    if (result.rowCount === 0) {
      throw new AcessoNegadoException();
    }
  }

  public async buscarMetaDisciplina(disciplinaId: string): Promise<DisciplinaMeta | null> {
    const query = "SELECT id, nome, carga_horaria, professor_id FROM disciplinas WHERE id = $1";
    const result = await this.pool.query<DisciplinaRow>(query, [disciplinaId]);

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      nome: row.nome,
      cargaHoraria: row.carga_horaria
    };
  }

  public async buscarMatriculasDaDisciplina(disciplinaId: string): Promise<MatriculaRegistro[]> {
    const query = `
      SELECT
        a.id AS aluno_id,
        a.nome AS aluno_nome,
        m.nota_p1,
        m.nota_p2,
        m.faltas,
        m.status,
        d.carga_horaria
      FROM matriculas m
      JOIN alunos a ON a.id = m.aluno_id
      JOIN disciplinas d ON d.id = m.disciplina_id
      WHERE m.disciplina_id = $1
      ORDER BY a.nome ASC
    `;

    const result = await this.pool.query<MatriculaRow>(query, [disciplinaId]);

    return result.rows.map((row) => ({
      alunoId: row.aluno_id,
      alunoNome: row.aluno_nome,
      notaP1: row.nota_p1,
      notaP2: row.nota_p2,
      faltas: row.faltas,
      status: row.status,
      cargaHoraria: row.carga_horaria
    }));
  }
}
