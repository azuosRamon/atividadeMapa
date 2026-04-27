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

const HoraAtivada = styled.div`
  background-color: ${({ destacado }) => (destacado ? "#2e7d32" : cores.cor3)};
  color: white;
  transition: background-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  transform: ${({ destacado }) => (destacado ? "scale(1.02)" : "scale(1)")};
  z-index: ${({ destacado }) => (destacado ? 2 : 1)};
  position: relative;
  padding: 8px;
  min-width: 180px;
  border-radius: 4px;
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

  const fromMinutes = (mins) => {
      const h = String(Math.floor(mins / 60)).padStart(2, '0');
      const m = String(mins % 60).padStart(2, '0');
      return `${h}:${m}`;
  };

  // dias da semana (índice 0 = domingo)
  const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  // Deriva lista de dias usados (valores numéricos esperados em dados: 1..7)
  const diasUtilizados = useMemo(() => {
    const setDias = new Set(dados.map((d) => Number(d.dia_da_semana)).filter(Boolean));
    return Array.from(setDias).sort((a, b) => a - b); // ordenado
  }, [dados]);

  // Extrai todos os intervalos atômicos de tempo em uma malha cronológica linear contínua
  const timeSlots = useMemo(() => {
    const boundaries = new Set();
    dados.forEach((d) => {
      const hi = toMinutes(d.horarios?.hora_inicio);
      const ht = toMinutes(d.horarios?.hora_termino);
      if (hi !== null) boundaries.add(hi);
      if (ht !== null) boundaries.add(ht);
    });
    
    const sorted = Array.from(boundaries).sort((a,b) => a - b);
    const slots = [];
    for(let i=0; i < sorted.length - 1; i++) {
         slots.push({
             hora_inicio: fromMinutes(sorted[i]),
             hora_termino: fromMinutes(sorted[i+1]),
             min_inicio: sorted[i],
             min_termino: sorted[i+1]
         });
    }
    return slots;
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

  // Função para encontrar TODAS as aulas que estão ativas englobando este bloco de tempo
  const acharAula = (slot, diaNum) => {
    return dados.filter((d) => {
      if (Number(d.dia_da_semana) !== Number(diaNum)) return false;
      const hi = toMinutes(d.horarios?.hora_inicio);
      const ht = toMinutes(d.horarios?.hora_termino);
      return hi <= slot.min_inicio && ht >= slot.min_termino;
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
              {diasUtilizados.map((diaNum, index) => (
                <Th key={index}>{diasDaSemana[diaNum - 1]}</Th>
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

                {diasUtilizados.map((diaNum, i) => {
                  const aulasNoSlot = acharAula(slot, diaNum);
                  
                  if (aulasNoSlot && aulasNoSlot.length > 0) {
                    return (
                      <td key={i} style={{ padding: 4, verticalAlign: 'top', border: '1px solid #444' }}>
                        {aulasNoSlot.map((aula, idx) => {
                          const textoTooltip = `${aula.horarios?.hora_inicio} - ${aula.horarios?.hora_termino} — ${aula.empresas?.nome || ""}`;
                          return (
                            <HoraAtivada
                              key={idx}
                              destacado={false}
                              onMouseEnter={(e) => mostrarTooltip(e, textoTooltip)}
                              onMouseLeave={esconderTooltip}
                              style={{ marginBottom: aulasNoSlot.length > 1 && idx < aulasNoSlot.length - 1 ? 4 : 0 }}
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
                                {aula.categorias?.nome} {aula.produtos?.nome} - <b>{aula.turma || ""}</b>
                              </div>
                            </HoraAtivada>
                          );
                        })}
                      </td>
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
