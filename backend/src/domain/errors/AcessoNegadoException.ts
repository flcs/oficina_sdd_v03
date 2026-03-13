export class AcessoNegadoException extends Error {
  public constructor() {
    super("Você não possui tal disciplina");
    this.name = "AcessoNegadoException";
  }
}
