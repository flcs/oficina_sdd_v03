import { describe, expect, it } from "vitest";
import { ServicoConsultaTurmas } from "../../../src/application/ServicoConsultaTurmas.js";
import { AcessoNegadoException } from "../../../src/domain/errors/AcessoNegadoException.js";
import { PoliticaNotasMedia } from "../../../src/domain/policies/PoliticaNotasMedia.js";
import { CalculadoraPresenca } from "../../../src/domain/services/CalculadoraPresenca.js";
import type { IRepositorioTurmas } from "../../../src/domain/repositories/IRepositorioTurmas.js";

const repositorioFake: IRepositorioTurmas = {
  async verificarPropriedadeDisciplina(): Promise<void> {
    throw new AcessoNegadoException();
  },
  async buscarMetaDisciplina() {
    return null;
  },
  async buscarMatriculasDaDisciplina() {
    return [];
  }
};

describe("ServicoConsultaTurmas acesso", () => {
  it("propaga AcessoNegadoException quando professor nao possui disciplina", async () => {
    const servico = new ServicoConsultaTurmas(repositorioFake, new PoliticaNotasMedia(), new CalculadoraPresenca());

    await expect(servico.listarAlunos("d1", "p1")).rejects.toBeInstanceOf(AcessoNegadoException);
  });
});
