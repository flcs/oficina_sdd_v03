import React from "react";
import { useConsultaTurmas } from "../hooks/useConsultaTurmas";
import { LinhaAluno } from "../components/TabelaAlunos/LinhaAluno";

type Props = {
  disciplinaId: string;
  token?: string;
};

export const PaginaConsultaTurmas = ({ disciplinaId, token }: Props): JSX.Element => {
  const { linhas, disciplinaNome, carregando, erro } = useConsultaTurmas(disciplinaId, token);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  return (
    <section>
      <h1>Consulta de Turmas</h1>
      <h2>{disciplinaNome}</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Status</th>
            <th>CR</th>
            <th>Presença (%)</th>
            <th>Alertas</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <LinhaAluno key={linha.id} linha={linha} />
          ))}
        </tbody>
      </table>
    </section>
  );
};
