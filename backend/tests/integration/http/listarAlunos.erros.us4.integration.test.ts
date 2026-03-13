import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { ServicoConsultaTurmas } from "../../../src/application/ServicoConsultaTurmas.js";
import { AcessoNegadoException } from "../../../src/domain/errors/AcessoNegadoException.js";
import { PoliticaNotasMedia } from "../../../src/domain/policies/PoliticaNotasMedia.js";
import { CalculadoraPresenca } from "../../../src/domain/services/CalculadoraPresenca.js";
import type { IRepositorioTurmas } from "../../../src/domain/repositories/IRepositorioTurmas.js";
import { TurmasController } from "../../../src/infrastructure/http/controllers/TurmasController.js";
import { autenticacaoJwt } from "../../../src/infrastructure/http/middlewares/autenticacaoJwt.js";

const criarAppComRepositorio = (repositorio: IRepositorioTurmas) => {
  const app = express();
  app.use(express.json());
  const servico = new ServicoConsultaTurmas(repositorio, new PoliticaNotasMedia(), new CalculadoraPresenca());
  const controller = new TurmasController(servico);
  app.get("/api/disciplinas/:disciplinaId/alunos", autenticacaoJwt, controller.listarAlunos);
  return app;
};

describe("GET /api/disciplinas/:disciplinaId/alunos erros", () => {
  it("retorna 403 com mensagem de acesso negado", async () => {
    process.env.JWT_SECRET = "segredo_us4_123456789012345";
    const token = jwt.sign({ professorId: "p1" }, process.env.JWT_SECRET);

    const repoAcessoNegado: IRepositorioTurmas = {
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

    const response = await request(criarAppComRepositorio(repoAcessoNegado))
      .get("/api/disciplinas/d1/alunos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Você não possui tal disciplina");
  });

  it("retorna 503 com mensagem Servidor OFF em falha inesperada", async () => {
    process.env.JWT_SECRET = "segredo_us4_123456789012345";
    const token = jwt.sign({ professorId: "p1" }, process.env.JWT_SECRET);

    const repoComFalha: IRepositorioTurmas = {
      async verificarPropriedadeDisciplina(): Promise<void> {
        return;
      },
      async buscarMetaDisciplina(): Promise<null> {
        throw new Error("db offline");
      },
      async buscarMatriculasDaDisciplina() {
        return [];
      }
    };

    const response = await request(criarAppComRepositorio(repoComFalha))
      .get("/api/disciplinas/d1/alunos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(503);
    expect(response.body.message).toBe("Servidor OFF");
  });
});
