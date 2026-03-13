import { describe, expect, it } from "vitest";
import { NotasAvaliacao } from "../../../../src/domain/entities/NotasAvaliacao.js";
import { PoliticaNotasMedia } from "../../../../src/domain/policies/PoliticaNotasMedia.js";
import { NotaProva } from "../../../../src/domain/valueObjects/NotaProva.js";

describe("PoliticaNotasMedia", () => {
  it("calcula media quando ambas notas existem", () => {
    const notas = new NotasAvaliacao(new NotaProva(8), new NotaProva(6));
    const politica = new PoliticaNotasMedia();

    expect(politica.calcular(notas).valor()).toBe(7);
  });

  it("retorna null quando alguma nota esta pendente", () => {
    const notas = new NotasAvaliacao(new NotaProva(8), new NotaProva(null));
    const politica = new PoliticaNotasMedia();

    expect(politica.calcular(notas).valor()).toBeNull();
  });
});
