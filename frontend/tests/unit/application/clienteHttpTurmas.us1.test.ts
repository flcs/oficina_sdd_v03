import { describe, expect, it, vi } from "vitest";
import { ClienteHttpBase } from "../../../src/application/ClienteHttpBase";
import { ClienteHttpTurmas } from "../../../src/application/ClienteHttpTurmas";

describe("ClienteHttpTurmas", () => {
  it("monta endpoint sem paginacao", async () => {
    const get = vi.fn().mockResolvedValue({ disciplina: { id: "d1", nome: "Calculo" }, alunos: [] });
    const base = { get } as unknown as ClienteHttpBase;
    const cliente = new ClienteHttpTurmas(base);

    await cliente.listarAlunos("d1", "token");

    expect(get).toHaveBeenCalledWith("/api/disciplinas/d1/alunos", "token");
  });
});
