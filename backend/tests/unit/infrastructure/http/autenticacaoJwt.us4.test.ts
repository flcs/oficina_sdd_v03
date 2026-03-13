import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { autenticacaoJwt } from "../../../../src/infrastructure/http/middlewares/autenticacaoJwt.js";

describe("autenticacaoJwt", () => {
  it("retorna 401 quando token esta ausente", () => {
    const request = { headers: {} } as Request;
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const response = { status, locals: {} } as unknown as Response;
    const next = vi.fn() as NextFunction;

    autenticacaoJwt(request, response, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 quando token eh invalido", () => {
    process.env.JWT_SECRET = "segredo_us4_123456789012345";
    const request = { headers: { authorization: "Bearer token_invalido" } } as unknown as Request;
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const response = { status, locals: {} } as unknown as Response;
    const next = vi.fn() as NextFunction;

    autenticacaoJwt(request, response, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("aceita token valido e preenche professorId", () => {
    process.env.JWT_SECRET = "segredo_us4_123456789012345";
    const token = jwt.sign({ professorId: "p1" }, process.env.JWT_SECRET);
    const request = { headers: { authorization: `Bearer ${token}` } } as unknown as Request;
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const response = { status, locals: {} } as unknown as Response;
    const next = vi.fn() as NextFunction;

    autenticacaoJwt(request, response, next);

    expect(next).toHaveBeenCalledOnce();
    expect(response.locals.professorId).toBe("p1");
  });
});
