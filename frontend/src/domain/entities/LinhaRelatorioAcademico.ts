export interface AlertaDto {
  categoria: "CR" | "FALTAS";
  severidade: "VERMELHO" | "AMARELO";
  rotulo: "BAIXA" | "FALTAS";
}

export interface LinhaRelatorioAcademico {
  id: string;
  nome: string;
  status: "ativo" | "trancado";
  coeficienteRendimento: number | null;
  percentualPresenca: number | null;
  alertas: AlertaDto[];
}

export interface RespostaConsultaTurmas {
  disciplina: {
    id: string;
    nome: string;
  };
  alunos: LinhaRelatorioAcademico[];
}
