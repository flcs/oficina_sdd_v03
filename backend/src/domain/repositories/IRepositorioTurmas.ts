export interface DisciplinaMeta {
  id: string;
  nome: string;
  cargaHoraria: number;
}

export interface MatriculaRegistro {
  alunoId: string;
  alunoNome: string;
  notaP1: number | null;
  notaP2: number | null;
  faltas: number;
  status: "ativo" | "trancado";
  cargaHoraria: number;
}

export interface IRepositorioTurmas {
  verificarPropriedadeDisciplina(disciplinaId: string, professorId: string): Promise<void>;
  buscarMetaDisciplina(disciplinaId: string): Promise<DisciplinaMeta | null>;
  buscarMatriculasDaDisciplina(disciplinaId: string): Promise<MatriculaRegistro[]>;
}
