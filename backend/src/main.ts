import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { ServicoConsultaTurmas } from "./application/ServicoConsultaTurmas.js";
import { PoliticaNotasMedia } from "./domain/policies/PoliticaNotasMedia.js";
import { CalculadoraPresenca } from "./domain/services/CalculadoraPresenca.js";
import { GeradorAlertasCR } from "./domain/services/GeradorAlertasCR.js";
import { GeradorAlertasPresenca } from "./domain/services/GeradorAlertasPresenca.js";
import { getPgPool } from "./infrastructure/database/pgPool.js";
import { TurmasController } from "./infrastructure/http/controllers/TurmasController.js";
import { autenticacaoJwt } from "./infrastructure/http/middlewares/autenticacaoJwt.js";
import { RepositorioTurmasPg } from "./infrastructure/repositories/RepositorioTurmasPg.js";

const app = express();
app.use(express.json());

const repositorio = new RepositorioTurmasPg(getPgPool());
const servico = new ServicoConsultaTurmas(
  repositorio,
  new PoliticaNotasMedia(),
  new CalculadoraPresenca(),
  new GeradorAlertasCR(),
  new GeradorAlertasPresenca()
);
const controller = new TurmasController(servico);

app.get("/api/disciplinas/:disciplinaId/alunos", autenticacaoJwt, controller.listarAlunos);

app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({ status: "ok" });
});

const port = Number(process.env.PORT ?? 3000);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    // Keep log minimal for CLI clarity
    console.log(`Servidor rodando na porta ${port}`);
  });
}

export { app };
