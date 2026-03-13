import { ClienteHttpBase } from "./ClienteHttpBase";
import type { RespostaConsultaTurmas } from "../domain/entities/LinhaRelatorioAcademico";

export class ClienteHttpTurmas {
  public constructor(private readonly clienteHttpBase: ClienteHttpBase) {}

  public async listarAlunos(disciplinaId: string, token?: string): Promise<RespostaConsultaTurmas> {
    return this.clienteHttpBase.get<RespostaConsultaTurmas>(`/api/disciplinas/${disciplinaId}/alunos`, token);
  }
}
