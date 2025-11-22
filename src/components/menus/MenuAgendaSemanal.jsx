import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import { supabase } from "/supabaseClient";
import cores from "../Cores.js";

async function LerDadosHorarios(usuarioId) {
  try {
    const { data, error } = await supabase
      .from("quadro_de_funcionamento")
      .select(`*, 
            empresas(*),
            horarios(*),
            produtos(*),
            categorias(*),
            comodos(*,
              tipos_areas(*),
              pavimentos(*,
                blocos(*,
                  imoveis(*)
                )
              )
            )
            `)
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
  overflow-x: auto;
  margin-top: 20px;

  p{
    background-color: #333;
    padding: 10px;
    border: 1px solid black;
    color: #fefefe;
    position: sticky;
    left: 0;
  }
`;

const Table = styled.table`
  min-width: 100%;
  background-color: ${cores.backgroundColapse};
  color: ${cores.corTextoClaro};
  
  thead{
    text-align: center;
    padding: 10px 20px;
  }

  th:first-child, td:first-child {
    position: sticky;
    left: 0;
    background-color: ${cores.backgroundColapse};
    border-color: ${cores.backgroundColapse};
    z-index: 11;
  }
`;

const HoraAtivada = styled.td`
  background-color: ${({ destacado }) => (destacado ? "#2e7d32" : cores.cor3)};
  color: white;
  transition: background-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  transform: ${({ destacado }) => (destacado ? "scale(1.02)" : "scale(1)")};
  z-index: ${({ destacado }) => (destacado ? 2 : 1)};
  position: relative;
  padding: 8px;
  min-width: 180px;
`;

const HoraDesativada = styled.td`
  background-color: #333;
  color: white;
  min-width: 150px;
  padding: 8px;
`;

const Tr = styled.tr``;

const Tooltip = styled.div`
  position: fixed;
  background: ${cores.cor3};
  color: #fff;
  font-size: 0.95rem;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1000;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${cores.cor3} transparent transparent transparent;
  }
`;

const FormGrid = styled.form`
  gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "tabela tabela tabela"
    "nome nome nome"
    "empresa_id empresa_id empresa_id"
    "dia_da_semana hora_inicio hora_fim"
    "reset operacao botoes";

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const Th = styled.th`
  padding: 1rem 0 !important;
  text-align: center;
`;
const Td = styled.td`
  min-width: 150px;
  width: 200px;
  padding: 8px;
`;

function VisualizarAgendaSemanal({ usuarioLogado }) {
  const [dados, setDados] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const atualizarDados = async () => {
      setLoading(true);
      const consulta = await LerDadosHorarios(usuarioLogado.usuario_id);
      if (!mounted) return;
      setDados(consulta);
      setLoading(false);
    };
    atualizarDados();
    return () => {
      mounted = false;
    };
  }, [usuarioLogado.usuario_id]);

  useEffect(() => {
    console.log("dados atualizados:", dados);
  }, [dados]);

  const toMinutes = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(":").map((p) => Number(p));
    if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
    return parts[0] * 60 + parts[1];
  };

  // dias da semana (índice 0 = domingo)
  const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  // Deriva lista de dias usados (valores numéricos esperados em dados: 1..7)
  const diasUtilizados = useMemo(() => {
    const setDias = new Set(dados.map((d) => Number(d.dia_da_semana)).filter(Boolean));
    return Array.from(setDias).sort((a, b) => a - b); // ordenado
  }, [dados]);

  // Deriva faixas horárias únicas (hora_inicio + hora_termino) e ordena por hora_inicio
  const timeSlots = useMemo(() => {
    const map = new Map();
    dados.forEach((d) => {
      const hi = d.horarios?.hora_inicio;
      const ht = d.horarios?.hora_termino;
      if (!hi || !ht) return;
      const key = `${hi}-${ht}`;
      if (!map.has(key)) {
        map.set(key, { hora_inicio: hi, hora_termino: ht });
      }
    });
    const arr = Array.from(map.values());
    arr.sort((a, b) => (toMinutes(a.hora_inicio) || 0) - (toMinutes(b.hora_inicio) || 0));
    return arr;
  }, [dados]);

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

  // Função para encontrar a aula que corresponde a um slot e dia
  const acharAula = (slot, diaNum) => {
    return dados.find((d) => {
      if (Number(d.dia_da_semana) !== Number(diaNum)) return false;
      const hi = d.horarios?.hora_inicio;
      const ht = d.horarios?.hora_termino;
      return hi === slot.hora_inicio && ht === slot.hora_termino;
    });
  };

  return (
    <Box>
      <Title>Agenda Semanal</Title>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              {diasDaSemana.map((dia, index) => (
                
                <Th key={index}>{dia}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.length === 0 && (
              <Tr>
                <Td colSpan={8} style={{ textAlign: "center", padding: 16 }}>
                  {loading ? "Carregando..." : "Nenhuma aula encontrada"}
                </Td>
              </Tr>
            )}

            {timeSlots.map((slot, rowIndex) => (
              <Tr key={rowIndex}>
                <td style={{ minWidth: 200, padding: 8 }}>
                  {slot.hora_inicio} - {slot.hora_termino}
                </td>

                {diasDaSemana.map((_, i) => {
                  const diaNum = i + 1; // supondo seus dias serem 1..7
                  const aula = acharAula(slot, diaNum);
                  if (aula) {
                    const textoTooltip = `${aula.horarios?.hora_inicio} - ${aula.horarios?.hora_termino} — ${aula.empresas?.nome || ""}`;
                    return (
                      <HoraAtivada
                        key={i}
                        destacado={false}
                        onMouseEnter={(e) => mostrarTooltip(e, textoTooltip)}
                        onMouseLeave={esconderTooltip}
                      >
                        <div style={{ fontWeight: "600" }}>{aula.empresas?.nome}</div>
                        <div style={{ fontSize: 12 }}>
                          {aula.comodos?.pavimentos?.blocos?.imoveis?.cidade} -{" "}
                          {aula.comodos?.pavimentos?.blocos?.imoveis?.nome}
                        </div>
                        <div style={{ fontSize: 12 }}>
                          Bloco: {aula.comodos?.pavimentos?.blocos?.nome}, Pavimento: nº {aula.comodos?.pavimentos?.numero}
                        </div>
                        <div style={{ fontSize: 12 }}>
                          {aula.comodos?.tipos_areas?.nome}: nº {aula.comodos?.numero}{" "}
                          {aula.comodos?.apelido ? "(" + aula.comodos.apelido + ")" : ""}
                        </div>
                        <div style={{ fontSize: 12 }}>
                          {aula.categorias?.nome} {aula.produtos?.nome}
                        </div>
                      </HoraAtivada>
                    );
                  } else {
                    return <HoraDesativada key={i} />;
                  }
                })}
              </Tr>
            ))}
          </tbody>
        </Table>

        {tooltip.visible && (
          <Tooltip style={{ top: tooltip.y - 50, left: tooltip.x }}>
            {tooltip.text}
          </Tooltip>
        )}
      </TableContainer>
    </Box>
  );
}

export default VisualizarAgendaSemanal;
