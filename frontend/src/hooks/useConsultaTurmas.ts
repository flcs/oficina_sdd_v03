import { useEffect, useMemo, useState } from "react";
import { ApiErrorMapper } from "../application/ApiErrorMapper";
import { ClienteHttpBase } from "../application/ClienteHttpBase";
import { ClienteHttpTurmas } from "../application/ClienteHttpTurmas";
import type { LinhaRelatorioAcademico } from "../domain/entities/LinhaRelatorioAcademico";

export const useConsultaTurmas = (disciplinaId: string, token?: string) => {
  const [linhas, setLinhas] = useState<LinhaRelatorioAcademico[]>([]);
  const [disciplinaNome, setDisciplinaNome] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const cliente = useMemo(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
    return new ClienteHttpTurmas(new ClienteHttpBase(baseUrl));
  }, []);

  useEffect(() => {
    let ativo = true;

    const carregar = async (): Promise<void> => {
      setCarregando(true);
      setErro(null);
      try {
        const resposta = await cliente.listarAlunos(disciplinaId, token);
        if (!ativo) {
          return;
        }
        setDisciplinaNome(resposta.disciplina.nome);
        setLinhas(resposta.alunos);
      } catch (error: unknown) {
        if (!ativo) {
          return;
        }
        const mapper = new ApiErrorMapper();
        setErro(mapper.map(error));
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    void carregar();

    return () => {
      ativo = false;
    };
  }, [cliente, disciplinaId, token]);

  return { linhas, disciplinaNome, carregando, erro };
};
