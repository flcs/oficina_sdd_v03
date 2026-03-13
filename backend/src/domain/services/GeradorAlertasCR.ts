import { AlertasAcademicos, type AlertaAcademico } from "../entities/AlertasAcademicos.js";
import { CategoriaAlerta } from "../valueObjects/CategoriaAlerta.js";
import { SeveridadeAlerta } from "../valueObjects/SeveridadeAlerta.js";

export class GeradorAlertasCR {
  public gerar(cr: number | null): AlertaAcademico[] {
    const alertas = new AlertasAcademicos();

    if (cr === null) {
      return alertas.listar();
    }

    if (cr < 6) {
      alertas.adicionar({
        categoria: new CategoriaAlerta("CR"),
        severidade: new SeveridadeAlerta("VERMELHO"),
        rotulo: "BAIXA"
      });
      return alertas.listar();
    }

    if (cr <= 6.9) {
      alertas.adicionar({
        categoria: new CategoriaAlerta("CR"),
        severidade: new SeveridadeAlerta("AMARELO"),
        rotulo: "BAIXA"
      });
    }

    return alertas.listar();
  }
}
