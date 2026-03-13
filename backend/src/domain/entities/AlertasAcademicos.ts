import { CategoriaAlerta } from "../valueObjects/CategoriaAlerta.js";
import { SeveridadeAlerta } from "../valueObjects/SeveridadeAlerta.js";

export type AlertaAcademico = {
  categoria: "CR" | "FALTAS";
  severidade: "VERMELHO" | "AMARELO";
  rotulo: "BAIXA" | "FALTAS";
};

export class AlertasAcademicos {
  private readonly itens: AlertaAcademico[] = [];

  public adicionar(alerta: {
    categoria: CategoriaAlerta;
    severidade: SeveridadeAlerta;
    rotulo: "BAIXA" | "FALTAS";
  }): void {
    this.itens.push({
      categoria: alerta.categoria.valor(),
      severidade: alerta.severidade.valor(),
      rotulo: alerta.rotulo
    });
  }

  public listar(): AlertaAcademico[] {
    return [...this.itens];
  }
}
