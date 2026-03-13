import { describe, expect, it } from "vitest";
import { ServicoConsultaTurmas } from "../../../src/application/ServicoConsultaTurmas.js";
import { PoliticaNotasMedia } from "../../../src/domain/policies/PoliticaNotasMedia.js";
import { CalculadoraPresenca } from "../../../src/domain/services/CalculadoraPresenca.js";
import type { IRepositorioTurmas } from "../../../src/domain/repositories/IRepositorioTurmas.js";

const repositorioFake: IRepositorioTurmas = {
  async verificarPropriedadeDisciplina(): Promise<void> {
    return;
  },
  async buscarMetaDisciplina() {
    return { id: "d1", nome: "Calculo", cargaHoraria: 60 };
  },
  async buscarMatriculasDaDisciplina() {
    return [
      {
        alunoId: "1",
        alunoNome: "Ana",
        notaP1: 9,
        notaP2: 9,
        faltas: 0,
        status: "trancado" as const,
        cargaHoraria: 60
      }
    ];
  }
};

describe("ServicoConsultaTurmas US3", () => {
  it("prioriza status trancado e nao calcula CR/presenca", async () => {
    const servico = new ServicoConsultaTurmas(repositorioFake, new PoliticaNotasMedia(), new CalculadoraPresenca());

    const resultado = await servico.listarAlunos("d1", "p1");
    expect(resultado).not.toBeNull();
    expect(resultado?.alunos[0]?.status).toBe("trancado");
    expect(resultado?.alunos[0]?.coeficienteRendimento).toBeNull();
    expect(resultado?.alunos[0]?.percentualPresenca).toBeNull();
  });
});
