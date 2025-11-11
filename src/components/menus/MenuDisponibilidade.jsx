
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import useBancoDeDados from "../BdCrudSupabase";
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas";
import { supabase } from "/supabaseClient";

async function LerDadosHorarios(usuarioId) {
  try {
    const { data, error } = await supabase
      .from("disponibilidade_semanal")
      .select("*")
      .eq("usuario_id", usuarioId);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Erro ao ler dados:", err);
    return [];
  }
}

const TableContainer = styled.div`
  position: relative;
  `;

const HoraAtivada = styled.td`
  background-color: ${({ destacado }) =>
    destacado ? "#2e7d32" : "#4caf50"};
  color: white;
  transition: background-color 0.2s ease;
  cursor: pointer;
  transition: transform 0.3s ease; /* Adiciona uma transição suave */
  transform: ${({ destacado }) =>
    destacado ? 'scale(1.5)' : 'scale(1)'};
  z-index: ${({ destacado }) => (destacado ? 2 : 1)};
  position: relative;
`;
const HoraDesativada = styled.td`
  background-color: #7d4444;
  color: white;
`;

const Tooltip = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
`;

const FormGrid = styled.form`
  gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "tabela tabela tabela"
    "operacao operacao operacao"
    "nome nome nome"
    "empresa_id empresa_id empresa_id"
    "dia_da_semana hora_inicio hora_fim"
    ". reset botoes";

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

function CadastrarDisponibilidade({ usuarioLogado }) {
  const tabela = mapa.disponibilidade_semanal;
  const [dados, setDados] = useState([]);
  const [hoverGroup, setHoverGroup] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const [objeto, setObjeto] = useState(
    Object.fromEntries(
      Object.entries(tabela.campos).map(([k, v]) => [
        k,
        k === "usuario_id" ? usuarioLogado.usuario_id : v.valor,
      ])
    )
  );
  const [operacao, setOperacao] = useState("0");

  const atualizarDados = async () => {
    const consulta = await LerDadosHorarios(usuarioLogado.usuario_id);
    setDados(consulta);
  };

  useEffect(() => {
    atualizarDados();
  }, []);

  const { fazerEnvio, alterarObjeto } = useBancoDeDados({
    nomeTabela: tabela.tabela.nome,
    objeto,
    setObjeto,
    operacao,
    campoId: tabela.tabela.lista[0],
    campoNome: tabela.tabela.lista[1],
  });

  const mostrarTooltip = (evento, texto) => {
    const { clientX, clientY } = evento;
    setTooltip({
      visible: true,
      text: texto,
      x: clientX,
      y: clientY,
    });
  };

  const esconderTooltip = () => setTooltip({ visible: false, text: "", x: 0, y: 0 });

  return (
    <Box>
      <Title>Disponibilidade</Title>

      <FormGrid onSubmit={fazerEnvio}>
        <CriarCamposFormulario
          item={tabela}
          setFuncao={alterarObjeto}
          operacao={operacao}
          setOperacao={setOperacao}
          objeto={objeto}
        />
      </FormGrid>

      <TableContainer>
        <table>
          <thead>
            <tr>
              <th>Dias</th>
              {Array.from({ length: 24 }, (_, i) => (
                <th key={i}>
                  {Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].map(
              (dia, dIndex) => {
                const registrosDoDia = dados.filter(
                  (r) => r.dia_da_semana === dIndex + 1
                );

                return (
                  <tr key={dIndex}>
                    <td>{dia}</td>
                    {Array.from({ length: 24 }, (_, i) => {
                      let grupo = null;
                      let registroBloco = null;

                      for (let idx = 0; idx < registrosDoDia.length; idx++) {
                        const registro = registrosDoDia[idx];
                        const inicio = parseInt(registro.hora_inicio.split(":")[0]);
                        const fim = parseInt(registro.hora_fim.split(":")[0]);
                        if (i >= inicio && i < fim) {
                          grupo = `${dIndex}-${idx}`;
                          registroBloco = registro;
                          break;
                        }
                      }

                      if (grupo) {
                        const textoTooltip = `${registroBloco.hora_inicio} - ${registroBloco.hora_fim}`;
                        return (
                          <HoraAtivada
                            key={i}
                            destacado={hoverGroup === grupo}
                            onMouseEnter={(e) => {
                              setHoverGroup(grupo);
                              mostrarTooltip(e, textoTooltip);
                            }}
                            onMouseLeave={() => {
                              setHoverGroup(null);
                              esconderTooltip();
                            }}
                            onClick={() => {
                              // Preenche o formulário com o registro clicado
                              setObjeto({ ...registroBloco });
                              setOperacao("2"); // opcional: modo edição
                            }}
                          />
                        );
                      } else {
                        return <HoraDesativada key={i} />;
                      }
                    })}
                  </tr>
                );
              }
            )}
          </tbody>
        </table>

        {tooltip.visible && (
          <Tooltip
            style={{
              top: tooltip.y - 40,
              left: tooltip.x,
              position: "fixed",
            }}
          >
            {tooltip.text}
          </Tooltip>
        )}
      </TableContainer>
    </Box>
  );
}

export default CadastrarDisponibilidade;
