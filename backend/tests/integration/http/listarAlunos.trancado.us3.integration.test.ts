import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { ServicoConsultaTurmas } from "../../../src/application/ServicoConsultaTurmas.js";
import { PoliticaNotasMedia } from "../../../src/domain/policies/PoliticaNotasMedia.js";
import { CalculadoraPresenca } from "../../../src/domain/services/CalculadoraPresenca.js";
import type { IRepositorioTurmas } from "../../../src/domain/repositories/IRepositorioTurmas.js";
import { TurmasController } from "../../../src/infrastructure/http/controllers/TurmasController.js";
import { autenticacaoJwt } from "../../../src/infrastructure/http/middlewares/autenticacaoJwt.js";

const repositorioFake: IRepositorioTurmas = {
  async verificarPropriedadeDisciplina(): Promise<void> {
    return;
  },
  async buscarMetaDisciplina() {
    return { id: "d1", nome: "Calculo", cargaHoraria: 60 };
  },
  async buscarMatriculasDaDisciplina() {
    return [
      { alunoId: "2", alunoNome: "Bruno", notaP1: 8, notaP2: 8, faltas: 3, status: "ativo" as const, cargaHoraria: 60 },
      { alunoId: "1", alunoNome: "Ana", notaP1: 10, notaP2: 10, faltas: 0, status: "trancado" as const, cargaHoraria: 60 }
    ];
  }
};

describe("GET /api/disciplinas/:disciplinaId/alunos trancado", () => {
  it("retorna badge trancado e CR placeholder para aluno trancado", async () => {
    process.env.JWT_SECRET = "segredo_de_teste_123456789012345";
    const token = jwt.sign({ professorId: "p1" }, process.env.JWT_SECRET);

    const app = express();
    app.use(express.json());
    const servico = new ServicoConsultaTurmas(repositorioFake, new PoliticaNotasMedia(), new CalculadoraPresenca());
    const controller = new TurmasController(servico);
    app.get("/api/disciplinas/:disciplinaId/alunos", autenticacaoJwt, controller.listarAlunos);

    const response = await request(app)
      .get("/api/disciplinas/d1/alunos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.alunos[0].nome).toBe("Ana");
    expect(response.body.alunos[0].status).toBe("trancado");
    expect(response.body.alunos[0].coeficienteRendimento).toBeNull();
  });
});
