import { InformacoesPresenca } from "../domain/entities/InformacoesPresenca.js";
import { NotasAvaliacao } from "../domain/entities/NotasAvaliacao.js";
import type { IRepositorioTurmas } from "../domain/repositories/IRepositorioTurmas.js";
import { PoliticaNotasMedia } from "../domain/policies/PoliticaNotasMedia.js";
import { CalculadoraPresenca } from "../domain/services/CalculadoraPresenca.js";
import { GeradorAlertasCR } from "../domain/services/GeradorAlertasCR.js";
import { GeradorAlertasPresenca } from "../domain/services/GeradorAlertasPresenca.js";
import { CargaHoraria } from "../domain/valueObjects/CargaHoraria.js";
import { NotaProva } from "../domain/valueObjects/NotaProva.js";
import { QuantidadeFaltas } from "../domain/valueObjects/QuantidadeFaltas.js";
import { StatusMatricula } from "../domain/valueObjects/StatusMatricula.js";
import type { AlertaAcademico } from "../domain/entities/AlertasAcademicos.js";

export interface ListaAlunosResposta {
  disciplina: {
    id: string;
    nome: string;
  };
  alunos: Array<{
    id: string;
    nome: string;
    status: "ativo" | "trancado";
    coeficienteRendimento: number | null;
    percentualPresenca: number | null;
    alertas: AlertaAcademico[];
  }>;
}

export class ServicoConsultaTurmas {
  public constructor(
    private readonly repositorio: IRepositorioTurmas,
    private readonly politicaNotasMedia: PoliticaNotasMedia,
    private readonly calculadoraPresenca: CalculadoraPresenca,
    private readonly geradorAlertasCR: GeradorAlertasCR = new GeradorAlertasCR(),
    private readonly geradorAlertasPresenca: GeradorAlertasPresenca = new GeradorAlertasPresenca()
  ) {}

  public async listarAlunos(disciplinaId: string, professorId: string): Promise<ListaAlunosResposta | null> {
    await this.repositorio.verificarPropriedadeDisciplina(disciplinaId, professorId);
    const disciplina = await this.repositorio.buscarMetaDisciplina(disciplinaId);

    if (!disciplina) {
      return null;
    }

    const matriculas = await this.repositorio.buscarMatriculasDaDisciplina(disciplinaId);

    const alunos = matriculas.map((registro) => {
      const statusMatricula = new StatusMatricula(registro.status);
      const notas = new NotasAvaliacao(new NotaProva(registro.notaP1), new NotaProva(registro.notaP2));
      const presenca = new InformacoesPresenca(
        new CargaHoraria(registro.cargaHoraria),
        new QuantidadeFaltas(registro.faltas)
      );

      const crCalculado = statusMatricula.estaTrancado() ? null : this.politicaNotasMedia.calcular(notas).valor();
      const presencaCalculada = statusMatricula.estaTrancado() ? null : this.calculadoraPresenca.calcular(presenca).valor();

      const alertas = [
        ...this.geradorAlertasCR.gerar(crCalculado),
        ...this.geradorAlertasPresenca.gerar(presencaCalculada)
      ];

      return {
        id: registro.alunoId,
        nome: registro.alunoNome,
        status: statusMatricula.valor(),
        coeficienteRendimento: crCalculado,
        percentualPresenca: presencaCalculada,
        alertas
      };
    });

    return {
      disciplina: {
        id: disciplina.id,
        nome: disciplina.nome
      },
      alunos: alunos.sort((a, b) => a.nome.localeCompare(b.nome))
    };
  }
}
