import React from "react";
import type { AlertaDto } from "../../domain/entities/LinhaRelatorioAcademico";

type Props = {
  alerta: AlertaDto;
};

const rotuloBadge = (alerta: AlertaDto): string => {
  if (alerta.categoria === "CR") {
    return "CR BAIXA";
  }
  return "FALTAS";
};

export const BadgeAlerta = ({ alerta }: Props): JSX.Element => {
  return (
    <span data-categoria={alerta.categoria} data-severidade={alerta.severidade}>
      {rotuloBadge(alerta)}
    </span>
  );
};
