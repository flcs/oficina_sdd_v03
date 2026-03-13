import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useConsultaTurmas } from "../../../src/hooks/useConsultaTurmas";

const fetchMock = vi.fn();

vi.stubGlobal("fetch", fetchMock);

describe("useConsultaTurmas erros", () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it("mapeia erro 403 para mensagem de acesso", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Você não possui tal disciplina" })
    });

    const { result } = renderHook(() => useConsultaTurmas("d1", "token"));

    await waitFor(() => {
      expect(result.current.erro).toBe("Você não possui tal disciplina");
    });
  });

  it("mapeia falha 503 para mensagem Servidor OFF", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Servidor OFF" })
    });

    const { result } = renderHook(() => useConsultaTurmas("d1", "token"));

    await waitFor(() => {
      expect(result.current.erro).toBe("Servidor OFF");
    });
  });
});
