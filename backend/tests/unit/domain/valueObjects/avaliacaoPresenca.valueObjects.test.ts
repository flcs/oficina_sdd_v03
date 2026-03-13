import { describe, expect, it } from "vitest";
import { NotaProva } from "../../../../src/domain/valueObjects/NotaProva.js";
import { CargaHoraria } from "../../../../src/domain/valueObjects/CargaHoraria.js";
import { QuantidadeFaltas } from "../../../../src/domain/valueObjects/QuantidadeFaltas.js";

describe("Value objects de avaliacao e presenca", () => {
  it("aceita nota valida", () => {
    const nota = new NotaProva(7.5);
    expect(nota.valor()).toBe(7.5);
    expect(nota.estaPendente()).toBe(false);
  });

  it("marca nota pendente quando null", () => {
    const nota = new NotaProva(null);
    expect(nota.estaPendente()).toBe(true);
  });

  it("rejeita nota fora do intervalo", () => {
    expect(() => new NotaProva(11)).toThrowError("Nota inválida");
  });

  it("aceita carga horaria valida", () => {
    const carga = new CargaHoraria(60);
    expect(carga.valor()).toBe(60);
    expect(carga.ehZero()).toBe(false);
  });

  it("rejeita faltas negativas", () => {
    expect(() => new QuantidadeFaltas(-1)).toThrowError("Quantidade de faltas inválida");
  });
});
