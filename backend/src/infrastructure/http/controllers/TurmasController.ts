import type { Request, Response } from "express";
import { AcessoNegadoException } from "../../../domain/errors/AcessoNegadoException.js";
import type { ServicoConsultaTurmas } from "../../../application/ServicoConsultaTurmas.js";

export class TurmasController {
  public constructor(private readonly servico: ServicoConsultaTurmas) {}

  public listarAlunos = async (request: Request, response: Response): Promise<void> => {
    const disciplinaId = request.params.disciplinaId;
    const professorId = response.locals.professorId;

    if (!disciplinaId || !professorId) {
      response.status(400).json({ message: "Parâmetros inválidos" });
      return;
    }

    try {
      const resultado = await this.servico.listarAlunos(disciplinaId, professorId);
      if (!resultado) {
        response.status(404).json({ message: "Disciplina não encontrada" });
        return;
      }

      response.status(200).json(resultado);
    } catch (error: unknown) {
      if (error instanceof AcessoNegadoException) {
        response.status(403).json({ message: "Você não possui tal disciplina" });
        return;
      }

      response.status(503).json({ message: "Servidor OFF" });
    }
  };
}
