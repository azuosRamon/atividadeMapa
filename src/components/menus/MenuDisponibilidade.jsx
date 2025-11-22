
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import useBancoDeDados from "../BdCrudSupabase";
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas";
import { supabase } from "/supabaseClient";
import cores from "../Cores.js";

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
  th, td {
    padding: 5px 8px;
  }
  th:first-child, td:first-child {
  position: sticky;
  left: 0; /* Define a posição onde a coluna deve "grudar" */
  background-color: ${cores.backgroundColapse}; /* Adiciona uma cor de fundo para que o conteúdo rolante não passe por baixo */
  border-color: ${cores.backgroundColapse}; /* Adiciona uma cor de fundo para que o conteúdo rolante não passe por baixo */
  z-index: 11;
   /* Garante que a coluna fixa fique acima do conteúdo rolante */
}
`;

const HoraAtivada = styled.td`
  background-color: ${({ destacado }) =>
    destacado ? "#2e7d32" : "#4caf50"};
  color: white;
  transition: background-color 0.2s ease;
  cursor: pointer;
  transition: transform 0.3s ease; /* Adiciona uma transição suave */
  transform: ${({ destacado }) =>
    destacado ? 'scale(1.1)' : 'scale(1)'};
  z-index: ${({ destacado }) => (destacado ? 2 : 1)};
  position: relative;

  `;

const Tr = styled.tr`
  
`
const HoraDesativada = styled.td`
  background-color: #7d4444;
  color: white;
`;

const Tooltip = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: ${cores.cor3};
  color: #fff;
  font-size: 1.1rem;
  padding: 4px 8px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;

  &::after {
    content: "";
    position: absolute;
    top: 100%; /* Coloca a seta na parte inferior do tooltip */
    left: 50%;
    margin-left: -5px; /* Metade do tamanho da seta (10px) para centralizar */
    border-width: 5px;
    border-style: solid;
    /* Define a cor da borda transparente, exceto a borda superior que coincide com a cor de fundo do tooltip */
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

function CadastrarDisponibilidade({ usuarioLogado }) {
  const tabela = mapa.disponibilidade_semanal;
  const [dados, setDados] = useState([]);
  const [hoverGroup, setHoverGroup] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
  const [objetoInicial, setObjetoInicial] = useState(
    Object.fromEntries(
      Object.entries(tabela.campos).map(([k, v]) => [
        k,
        k === "usuario_id" ? usuarioLogado.usuario_id : v.valor,
      ])
    )
  );
  const [objeto, setObjeto] = useState(objetoInicial);
  const [operacao, setOperacao] = useState("0");

  const atualizarDados = async () => {
    const consulta = await LerDadosHorarios(usuarioLogado.usuario_id);
    setDados(consulta);
  };
  

  useEffect(() => {
    atualizarDados();
  }, [objeto, operacao]);

  const { fazerEnvio, alterarObjeto } = useBancoDeDados({
    nomeTabela: tabela.tabela.nome,
    objeto,
    setObjeto,
    objetoInicial,
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
const toMinutes = (timeStr) => {
  // aceita "HH:MM" ou "H:MM" ou "HH:MM:SS"
  if (!timeStr) return null;
  const parts = timeStr.split(":").map((p) => Number(p));
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
  return parts[0] * 60 + parts[1];
};

const intervalosIntersectam = (startA, endA, startB, endB) => {
  // start/end em minutos (inteiros)
  // assumimos intervalos semi-abertos [start, end) — fim não incluso
  return startA < endB && startB < endA;
};

const enviarCadastro = async (e) => {
  e.preventDefault();

  const dia = String(objeto.dia_da_semana ?? "").trim();
  const inicioStr = String(objeto.hora_inicio ?? "").trim();
  const fimStr = String(objeto.hora_fim ?? "").trim();

  if (!dia || !inicioStr || !fimStr) {
    alert("Preencha o dia e os horários corretamente.");
    return;
  }
  if (dia < 1 && dia > 7){
    alert("Selecione um dia")
    return;
  }
  const novoInicio = toMinutes(inicioStr);
  const novoFim = toMinutes(fimStr);

  if (novoInicio === null || novoFim === null) {
    alert("Formato de horário inválido. Use HH:MM.");
    return;
  }

  if (novoFim <= novoInicio) {
    alert("O horário final deve ser maior que o horário inicial.");
    return;
  }

  // Filtra horários do mesmo dia.
  // IMPORTANTE: normalizamos para string para evitar mismatch tipo "1" vs 1
  const horariosDoDia = dados.filter(
    (item) => String(item.dia_da_semana) === String(dia) && String(item.id) !== String(objeto.id ?? "")
  );

  // Procurar conflito (retorna o primeiro registro conflitando)
  const conflitoRegistro = horariosDoDia.find((item) => {
    const inicioExist = toMinutes(String(item.hora_inicio ?? ""));
    const fimExist = toMinutes(String(item.hora_fim ?? ""));

    // se algum registro armazenado estiver em formato inválido, ignoramos (ou podemos tratar)
    if (inicioExist === null || fimExist === null) return false;

    return intervalosIntersectam(novoInicio, novoFim, inicioExist, fimExist);
  });

  if (conflitoRegistro && conflitoRegistro.id !== objeto.disponibilidade_id && operacao !== "3") {
    alert(
      `Conflito com horário existente: ${conflitoRegistro.hora_inicio} - ${conflitoRegistro.hora_fim}. ` +
      `Não é possível criar um intervalo que se sobreponha.`
    );
    // opcional: você pode também destacar o registro conflitivo na UI aqui
    return;
  }

  // Sem conflitos -> envia
  try {
    await fazerEnvio(e);
    await atualizarDados();
  } catch (err) {
    console.error("Erro ao cadastrar horário:", err);
    alert("Erro ao salvar horário. Tente novamente.");
  }
};


  return (
    <Box>
      <Title>Disponibilidade</Title>

      <FormGrid onSubmit={enviarCadastro}>
        <CriarCamposFormulario
          item={tabela}
          setFuncao={alterarObjeto}
          operacao={operacao}
          setOperacao={setOperacao}
          objeto={objeto}
        />
      </FormGrid>

      <TableContainer>
        <p>Clique em um dos campos verdes se desejar atualiza-lo!</p>
        <Table>
          <thead>
            <tr>
              <th>Dias/Tempo</th>
              {Array.from({ length: 24 }, (_, i) => (
                <th key={i}>
                  {Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(i)}:00
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
                  <Tr key={dIndex}>
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
                  </Tr>
                );
              }
            )}
          </tbody>
        </Table>

        {tooltip.visible && (
          <Tooltip
            style={{
              top: tooltip.y - 50,
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
