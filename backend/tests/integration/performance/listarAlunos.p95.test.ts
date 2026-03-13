import { performance } from "node:perf_hooks";
import { describe, expect, it } from "vitest";
import { ServicoConsultaTurmas } from "../../../src/application/ServicoConsultaTurmas.js";
import { PoliticaNotasMedia } from "../../../src/domain/policies/PoliticaNotasMedia.js";
import { CalculadoraPresenca } from "../../../src/domain/services/CalculadoraPresenca.js";
import type { IRepositorioTurmas } from "../../../src/domain/repositories/IRepositorioTurmas.js";

const calcularPercentil = (valores: number[], percentil: number): number => {
  const ordenados = [...valores].sort((a, b) => a - b);
  const indice = Math.ceil((percentil / 100) * ordenados.length) - 1;
  return ordenados[Math.max(0, indice)] ?? 0;
};

const construirRepositorioFake = (): IRepositorioTurmas => ({
  async verificarPropriedadeDisciplina(): Promise<void> {
    return;
  },
  async buscarMetaDisciplina() {
    return { id: "d1", nome: "Calculo", cargaHoraria: 60 };
  },
  async buscarMatriculasDaDisciplina() {
    return Array.from({ length: 100 }, (_, indice) => ({
      alunoId: `${indice + 1}`,
      alunoNome: `Aluno ${String(indice + 1).padStart(3, "0")}`,
      notaP1: 7,
      notaP2: 8,
      faltas: indice % 12,
      status: "ativo" as const,
      cargaHoraria: 60
    }));
  }
});

describe("Performance p95 listarAlunos", () => {
  it("mantem p95 abaixo de 500ms com 100 alunos", async () => {
    const servico = new ServicoConsultaTurmas(construirRepositorioFake(), new PoliticaNotasMedia(), new CalculadoraPresenca());
    const amostras: number[] = [];

    for (let i = 0; i < 40; i += 1) {
      const inicio = performance.now();
      await servico.listarAlunos("d1", "p1");
      amostras.push(performance.now() - inicio);
    }

    const p95 = calcularPercentil(amostras, 95);
    expect(p95).toBeLessThan(500);
  });
});
