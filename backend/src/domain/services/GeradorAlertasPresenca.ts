import { AlertasAcademicos, type AlertaAcademico } from "../entities/AlertasAcademicos.js";
import { CategoriaAlerta } from "../valueObjects/CategoriaAlerta.js";
import { SeveridadeAlerta } from "../valueObjects/SeveridadeAlerta.js";

export class GeradorAlertasPresenca {
  public gerar(percentualPresenca: number | null): AlertaAcademico[] {
    const alertas = new AlertasAcademicos();

    if (percentualPresenca === null) {
      return alertas.listar();
    }

    if (percentualPresenca < 75) {
      alertas.adicionar({
        categoria: new CategoriaAlerta("FALTAS"),
        severidade: new SeveridadeAlerta("VERMELHO"),
        rotulo: "FALTAS"
      });
      return alertas.listar();
    }

    if (percentualPresenca <= 84) {
      alertas.adicionar({
        categoria: new CategoriaAlerta("FALTAS"),
        severidade: new SeveridadeAlerta("AMARELO"),
        rotulo: "FALTAS"
      });
    }

    return alertas.listar();
  }
}
