import React from "react";
import type { LinhaRelatorioAcademico } from "../../domain/entities/LinhaRelatorioAcademico";
import { BadgeAlerta } from "../badges/BadgeAlerta";
import { BadgeTrancado } from "../badges/BadgeTrancado";

type Props = {
  linha: LinhaRelatorioAcademico;
};

const formatarValor = (valor: number | null): string => {
  if (valor === null) {
    return "-";
  }
  return valor.toFixed(2);
};

export const LinhaAluno = ({ linha }: Props): JSX.Element => {
  return (
    <tr>
      <td>{linha.nome}</td>
      <td>{linha.status === "trancado" ? <BadgeTrancado /> : "Ativo"}</td>
      <td>{formatarValor(linha.coeficienteRendimento)}</td>
      <td>{formatarValor(linha.percentualPresenca)}</td>
      <td>
        {linha.alertas.map((alerta) => (
          <BadgeAlerta
            key={`${linha.id}-${alerta.categoria}-${alerta.severidade}`}
            alerta={alerta}
          />
        ))}
      </td>
    </tr>
  );
};
