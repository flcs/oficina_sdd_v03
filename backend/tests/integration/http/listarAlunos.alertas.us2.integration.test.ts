import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { ServicoConsultaTurmas } from "../../../src/application/ServicoConsultaTurmas.js";
import { PoliticaNotasMedia } from "../../../src/domain/policies/PoliticaNotasMedia.js";
import { CalculadoraPresenca } from "../../../src/domain/services/CalculadoraPresenca.js";
import { GeradorAlertasCR } from "../../../src/domain/services/GeradorAlertasCR.js";
import { GeradorAlertasPresenca } from "../../../src/domain/services/GeradorAlertasPresenca.js";
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
      { alunoId: "1", alunoNome: "Ana", notaP1: 4, notaP2: 5, faltas: 20, status: "ativo" as const, cargaHoraria: 60 },
      { alunoId: "2", alunoNome: "Bruno", notaP1: 6, notaP2: 6, faltas: 10, status: "ativo" as const, cargaHoraria: 60 },
      { alunoId: "3", alunoNome: "Carlos", notaP1: 8, notaP2: 8, faltas: 2, status: "ativo" as const, cargaHoraria: 60 }
    ];
  }
};

describe("GET /api/disciplinas/:disciplinaId/alunos alertas", () => {
  it("retorna combinacoes de alertas conforme regras de CR e presenca", async () => {
    process.env.JWT_SECRET = "segredo_de_teste_123456789012345";

    const token = jwt.sign({ professorId: "p1" }, process.env.JWT_SECRET);

    const app = express();
    app.use(express.json());
    const servico = new ServicoConsultaTurmas(
      repositorioFake,
      new PoliticaNotasMedia(),
      new CalculadoraPresenca(),
      new GeradorAlertasCR(),
      new GeradorAlertasPresenca()
    );
    const controller = new TurmasController(servico);
    app.get("/api/disciplinas/:disciplinaId/alunos", autenticacaoJwt, controller.listarAlunos);

    const response = await request(app)
      .get("/api/disciplinas/d1/alunos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    const ana = response.body.alunos.find((a: { nome: string }) => a.nome === "Ana");
    const bruno = response.body.alunos.find((a: { nome: string }) => a.nome === "Bruno");
    const carlos = response.body.alunos.find((a: { nome: string }) => a.nome === "Carlos");

    expect(ana.alertas).toEqual([
      { categoria: "CR", severidade: "VERMELHO", rotulo: "BAIXA" },
      { categoria: "FALTAS", severidade: "VERMELHO", rotulo: "FALTAS" }
    ]);
    expect(bruno.alertas).toEqual([
      { categoria: "CR", severidade: "AMARELO", rotulo: "BAIXA" },
      { categoria: "FALTAS", severidade: "AMARELO", rotulo: "FALTAS" }
    ]);
    expect(carlos.alertas).toEqual([]);
  });
});
