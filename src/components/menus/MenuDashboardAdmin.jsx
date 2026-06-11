import React, { useState, useEffect } from "react";
import styled from "styled-components";
import cores from "../Cores";
import Box from "../SubBox";
import { supabase } from "../../../supabaseClient";
import StatCard from "../SubStatCard";
import { 
  LuUsers, 
  LuLayers,
  LuPackage, 
  LuTrendingUp, 
  LuCircleArrowDown, 
  LuCircleArrowUp,
  LuDollarSign,
  LuChartPie,
  LuCalendarDays
} from "react-icons/lu";

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 10px 0;
`;

const HeaderArea = styled.div`
  margin-bottom: 10px;
  h1 {
    font-size: 24px;
    color: ${cores.corTexto};
    margin: 0;
  }
  p {
    color: ${cores.corTextoClaro};
    font-size: 14px;
    margin: 5px 0 0 0;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  background: ${cores.backgroundBox};
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const FakeChart = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-top: 20px;
  gap: 15px;
`;

const Bar = styled.div`
  width: 100%;
  max-width: 40px;
  height: ${props => props.$height}%;
  background: ${props => props.$color || cores.cor3};
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: height 1s ease-in-out;

  &:hover::after {
    content: "${props => props.$label}";
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    background: #444;
    padding: 2px 5px;
    border-radius: 4px;
    color: #fff;
  }
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  color: ${cores.corTexto};
  margin-bottom: 20px;
`;

const SalasChartContainer = styled.div`
  position: relative;
  height: 120px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
  margin: 15px 0;
  gap: 6px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }
`;

const SalaBar = styled.div`
  flex: 1;
  min-width: 16px;
  max-width: 30px;
  height: ${props => props.$height}%;
  background: ${props => props.$color};
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.5s ease-in-out;
  cursor: pointer;
`;

const AverageLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${props => props.$position}%;
  border-top: 1.5px dashed ${cores.cor1};
  height: 0;
  pointer-events: none;
  z-index: 5;

  &::after {
    content: "Média: ${props => props.$label}";
    position: absolute;
    right: 4px;
    top: -14px;
    font-size: 9px;
    color: ${cores.cor1};
    background: ${cores.backgroundBox};
    padding: 1px 3px;
    border-radius: 3px;
    font-weight: bold;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

function MenuDashboardAdmin({ usuarioLogado }) {
  const [stats, setStats] = useState({
    totalSalas: 0,
    salasContrato: 0,
    usuariosAtivos: 0,
    usuariosContrato: 0,
    produtosTotal: 0,
    produtosContrato: 0,
    valorContrato: 0,
    dataExpiracao: "---",
    diasRestantes: null,
    distribuicaoDias: { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
    cursosLista: [],
    mediaAulasPorSala: "0.0",
    salasSemAtividadeQtd: 0,
    salasSemAtividadeLista: [],
    salasLista: []
  });
  const [loading, setLoading] = useState(true);
  const [hoveredSala, setHoveredSala] = useState(null);
  const modelo = JSON.parse(localStorage.getItem("modelo") || "{}");

  useEffect(() => {
    let active = true;
    async function fetchData() {
      if (!usuarioLogado?.empresa_id) return;
      
      try {
        const anoAtual = new Date().getFullYear();
        const semestreAtual = new Date().getMonth() <= 5 ? 1 : 2;

        const [salasResult, usuariosResult, produtosResult, contratoResult, aulasResult] = await Promise.all([
          supabase.from("comodos").select("comodo_id, numero, apelido").eq("empresa_id", usuarioLogado.empresa_id),
          supabase.from("usuarios_empresas").select("id", { count: "exact" }).eq("empresa_id", usuarioLogado.empresa_id),
          supabase.from("produtos").select("produto_id", { count: "exact" }).eq("empresa_id", usuarioLogado.empresa_id),
          supabase.from("contratos_empresas").select("valor, inicio, tempo_contrato_meses, renovacao, qtd_comodos, qtd_usuarios, qtd_produtos").eq("empresa_id", usuarioLogado.empresa_id).maybeSingle(),
          supabase.from("view_pesquisa_aulas")
            .select("dia_da_semana, nome_curso, comodo_id, funcionamento_ano, horario_ano, semestre")
            .eq("empresa_id", usuarioLogado.empresa_id)
            .eq("semestre", semestreAtual)
            .or(`funcionamento_ano.eq.${anoAtual},horario_ano.eq.${anoAtual}`)
        ]);

        if (!active) return;

        if (salasResult.error) console.error("Erro ao carregar cômodos:", salasResult.error);
        if (usuariosResult.error) console.error("Erro ao carregar usuários:", usuariosResult.error);
        if (produtosResult.error) console.error("Erro ao carregar produtos:", produtosResult.error);
        if (contratoResult.error) console.error("Erro ao carregar contrato (possível problema de RLS):", contratoResult.error);
        if (aulasResult.error) console.error("Erro ao carregar aulas:", aulasResult.error);

        console.log("Dashboard - empresa_id carregado:", usuarioLogado.empresa_id);
        console.log("Dashboard - contratos carregados:", contratoResult.data);

        let dataExp = "---";
        let diasRest = null;
        let limitSalas = 0;
        let limitUsuarios = 0;
        let limitProdutos = 0;

        const cData = contratoResult.data;
        if (cData) {
          limitSalas = cData.qtd_comodos || 0;
          limitUsuarios = cData.qtd_usuarios || 0;
          limitProdutos = cData.qtd_produtos || 0;
          
          const dataFim = cData.renovacao ? new Date(cData.renovacao) : null;
          if (dataFim) {
            dataExp = dataFim.toLocaleDateString('pt-BR');
            const hoje = new Date();
            const diffTime = dataFim - hoje;
            diasRest = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          } else if (cData.inicio && cData.tempo_contrato_meses) {
            const d = new Date(cData.inicio);
            d.setMonth(d.getMonth() + cData.tempo_contrato_meses);
            dataExp = d.toLocaleDateString('pt-BR');
            const hoje = new Date();
            const diffTime = d - hoje;
            diasRest = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
        }

        const aulasPeriodoAtual = aulasResult.data || [];

        // Processamento de ocupação semanal (dias da semana: 2 = Segunda, 7 = Sábado)
        const diasContagem = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
        const cursosContagem = {};
        
        // Mapeamento e contagem de aulas por cômodo
        const comodosList = salasResult.data || [];
        const comodoAulasContagem = {};
        comodosList.forEach(c => {
          comodoAulasContagem[c.comodo_id] = 0;
        });

        aulasPeriodoAtual.forEach(aula => {
          const d = Number(aula.dia_da_semana);
          if (d in diasContagem) {
            diasContagem[d] += 1;
          }
          
          if (aula.nome_curso) {
            cursosContagem[aula.nome_curso] = (cursosContagem[aula.nome_curso] || 0) + 1;
          }

          if (aula.comodo_id && aula.comodo_id in comodoAulasContagem) {
            comodoAulasContagem[aula.comodo_id] += 1;
          }
        });

        // Transforma distribuição de cursos em lista ordenada
        const totalAulas = aulasPeriodoAtual.length;
        const cursosLista = Object.entries(cursosContagem)
          .map(([nome, count]) => ({
            nome,
            quantidade: count,
            porcentagem: totalAulas > 0 ? Math.round((count / totalAulas) * 100) : 0
          }))
          .sort((a, b) => b.quantidade - a.quantidade);

        // Estatísticas de eficiência das salas
        const totalSalas = comodosList.length;
        const salasLista = comodosList.map(c => ({
          id: c.comodo_id,
          numero: c.numero,
          apelido: c.apelido,
          aulasQtd: comodoAulasContagem[c.comodo_id] || 0
        }));

        const salasSemAtividade = salasLista.filter(s => s.aulasQtd === 0);
        const mediaAulasPorSala = totalSalas > 0 ? (totalAulas / totalSalas).toFixed(1) : "0.0";

        setStats({
          totalSalas: totalSalas,
          salasContrato: limitSalas,
          usuariosAtivos: usuariosResult.count || 0,
          usuariosContrato: limitUsuarios,
          produtosTotal: produtosResult.count || 0,
          produtosContrato: limitProdutos,
          valorContrato: cData?.valor || 0,
          dataExpiracao: dataExp,
          diasRestantes: diasRest,
          distribuicaoDias: diasContagem,
          cursosLista: cursosLista,
          mediaAulasPorSala: mediaAulasPorSala,
          salasSemAtividadeQtd: salasSemAtividade.length,
          salasSemAtividadeLista: salasSemAtividade,
          salasLista: salasLista
        });
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => {
      active = false;
    };
  }, [usuarioLogado]);

  // Função auxiliar para gerar o donut chart
  const getDonutGradient = () => {
    const lista = stats.cursosLista;
    if (lista.length === 0) {
      return `conic-gradient(rgba(255, 255, 255, 0.1) 0% 100%)`;
    }
    if (lista.length === 1) {
      return `conic-gradient(${cores.cor3} 0% 100%)`;
    }
    const p1 = lista[0].porcentagem;
    const p2 = lista[1]?.porcentagem || 0;
    return `conic-gradient(${cores.cor3} 0% ${p1}%, ${cores.cor1} ${p1}% ${p1 + p2}%, ${cores.cor2 || "#33cccc"} ${p1 + p2}% 100%)`;
  };

  const maxDiaCount = Math.max(...Object.values(stats.distribuicaoDias), 1);

  if (loading) {
    return (
      <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <div style={{ color: "#fff" }}>Carregando estatísticas...</div>
      </Box>
    );
  }

  return (
    <Box>
      <DashboardWrapper>
        <HeaderArea>
          <h1>Visão Geral</h1>
          <p>Resumo operacional da sua unidade em tempo real.</p>
        </HeaderArea>

        {/* Linha 1: Estatísticas Rápidas */}
        <Row>
          <StatCard 
            icon={LuLayers} 
            title={modelo.comodos || "Cômodos"} 
            value={`${stats.totalSalas} / ${stats.salasContrato || '∞'}`} 
            color={stats.totalSalas >= stats.salasContrato && stats.salasContrato > 0 ? "#ef4444" : "#3b82f6"} 
            indicator={
              stats.salasContrato === 0 
                ? "Sem Limite"
                : stats.totalSalas > stats.salasContrato
                ? "Excedido!"
                : stats.totalSalas === stats.salasContrato
                ? "Limite Atingido"
                : `${stats.salasContrato - stats.totalSalas} livres`
            } 
          />
          <StatCard 
            icon={LuUsers} 
            title="Usuários Ativos" 
            value={`${stats.usuariosAtivos} / ${stats.usuariosContrato || '∞'}`} 
            color={stats.usuariosAtivos >= stats.usuariosContrato && stats.usuariosContrato > 0 ? "#ef4444" : "#10b981"} 
            indicator={
              stats.usuariosContrato === 0
                ? "Sem Limite"
                : stats.usuariosAtivos > stats.usuariosContrato
                ? "Excedido!"
                : stats.usuariosAtivos === stats.usuariosContrato
                ? "Limite Atingido"
                : `${stats.usuariosContrato - stats.usuariosAtivos} livres`
            } 
          />
          <StatCard 
            icon={LuCalendarDays} 
            title="Expiração do Contrato" 
            value={stats.dataExpiracao} 
            color={stats.diasRestantes !== null && stats.diasRestantes <= 30 ? "#ef4444" : "#3b82f6"} 
            indicator={
              stats.diasRestantes === null
                ? "Sem contrato"
                : stats.diasRestantes < 0
                ? "Expirado!"
                : stats.diasRestantes === 0
                ? "Expira hoje"
                : `Expira em ${stats.diasRestantes} dias`
            } 
          />
        </Row>

        {/* Linha 3: Gráficos e Detalhes */}
        <Row style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {/* Gráfico 1: Ocupação Semanal */}
          <ChartContainer>
            <ChartTitle>Aulas por Dia (Semestre Atual)</ChartTitle>
            <FakeChart>
              <Bar $height={(stats.distribuicaoDias[2] / maxDiaCount) * 80 + 15} $label={`${stats.distribuicaoDias[2]} - Seg`} />
              <Bar $height={(stats.distribuicaoDias[3] / maxDiaCount) * 80 + 15} $label={`${stats.distribuicaoDias[3]} - Ter`} $color={cores.cor1} />
              <Bar $height={(stats.distribuicaoDias[4] / maxDiaCount) * 80 + 15} $label={`${stats.distribuicaoDias[4]} - Qua`} />
              <Bar $height={(stats.distribuicaoDias[5] / maxDiaCount) * 80 + 15} $label={`${stats.distribuicaoDias[5]} - Qui`} $color={cores.cor1} />
              <Bar $height={(stats.distribuicaoDias[6] / maxDiaCount) * 80 + 15} $label={`${stats.distribuicaoDias[6]} - Sex`} />
              <Bar $height={(stats.distribuicaoDias[7] / maxDiaCount) * 80 + 15} $label={`${stats.distribuicaoDias[7]} - Sáb`} $color={cores.cor1} />
            </FakeChart>
            <p style={{ fontSize: "12px", color: cores.corTextoClaro, textAlign: "center", marginTop: "15px" }}>
              Total de aulas ativas agendadas para cada dia da semana.
            </p>
          </ChartContainer>

          {/* Gráfico 2: Distribuição por Categoria/Curso */}
          <ChartContainer>
            <ChartTitle>Aulas por Curso</ChartTitle>
            {stats.cursosLista.length === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: cores.corTextoClaro }}>
                Sem aulas cadastradas no semestre.
              </div>
            ) : (
              <>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ 
                    width: "140px", 
                    height: "140px", 
                    borderRadius: "50%", 
                    background: getDonutGradient(),
                    position: "relative"
                  }}>
                    <div style={{ 
                      position: "absolute", 
                      inset: "25px", 
                      background: cores.backgroundBox, 
                      borderRadius: "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      color: cores.corTextoClaro
                    }}>
                      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>{stats.cursosLista.length}</span>
                      Cursos
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexDirection: "column", marginTop: "15px", maxHeight: "120px", overflowY: "auto", paddingRight: "5px" }}>
                  {stats.cursosLista.slice(0, 3).map((c, idx) => {
                    const color = idx === 0 ? cores.cor3 : idx === 1 ? cores.cor1 : (cores.cor2 || "#33cccc");
                    return (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#fff" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }}></div>
                          {c.nome}
                        </span>
                        <span>{c.porcentagem}%</span>
                      </div>
                    );
                  })}
                  {stats.cursosLista.length > 3 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: cores.corTextoClaro }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }}></div>
                        Outros
                      </span>
                      <span>{100 - stats.cursosLista.slice(0, 3).reduce((acc, curr) => acc + curr.porcentagem, 0)}%</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </ChartContainer>

          {/* Gráfico 3: Eficiência das Salas */}
          <ChartContainer>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <ChartTitle style={{ margin: 0 }}>Eficiência de {modelo.comodos || "Salas"}</ChartTitle>
              <span style={{ fontSize: "11px", color: hoveredSala ? cores.cor3 : cores.corTextoClaro, transition: "color 0.2s", fontWeight: "bold" }}>
                {hoveredSala 
                  ? `${hoveredSala.aulasQtd} aulas — Sala ${hoveredSala.numero} ${hoveredSala.apelido ? `(${hoveredSala.apelido})` : ""}`
                  : "Passe o mouse sobre as barras"
                }
              </span>
            </div>
            {stats.totalSalas === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: cores.corTextoClaro }}>
                Sem {modelo.comodos || "salas"} cadastradas.
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {(() => {
                  const maxAulas = Math.max(...(stats.salasLista || []).map(s => s.aulasQtd), 1);
                  const avgPosition = (Number(stats.mediaAulasPorSala) / maxAulas) * 80 + 5;
                  return (
                    <SalasChartContainer>
                      <AverageLine $position={avgPosition} $label={stats.mediaAulasPorSala} />
                      {(stats.salasLista || []).map((sala, idx) => {
                        const heightPercentage = sala.aulasQtd === 0 ? 4 : (sala.aulasQtd / maxAulas) * 80 + 5;
                        const barColor = sala.aulasQtd === 0 ? "#ef4444" : cores.cor3;
                        const tooltipText = `${sala.aulasQtd} aulas - Sala ${sala.numero} ${sala.apelido ? `(${sala.apelido})` : ""}`;
                        return (
                          <SalaBar 
                            key={idx}
                            $height={heightPercentage}
                            $color={barColor}
                            title={tooltipText}
                            onMouseEnter={() => setHoveredSala(sala)}
                            onMouseLeave={() => setHoveredSala(null)}
                          />
                        );
                      })}
                    </SalasChartContainer>
                  );
                })()}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "12px", color: cores.corTextoClaro }}>
                    Salas Ociosas no Período:
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "bold", color: stats.salasSemAtividadeQtd > 0 ? "#ef4444" : "#10b981" }}>
                    {stats.salasSemAtividadeQtd} de {stats.totalSalas}
                  </span>
                </div>

                <div style={{ flex: 1 }}>
                  {stats.salasSemAtividadeLista.length === 0 ? (
                    <div style={{ fontSize: "12px", color: cores.corTextoClaro, fontStyle: "italic", textAlign: "center" }}>
                      Todas as salas estão ativas neste semestre.
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxHeight: "80px", overflowY: "auto", paddingRight: "5px" }}>
                      {stats.salasSemAtividadeLista.map((sala, idx) => (
                        <span key={idx} style={{ 
                          fontSize: "10px", 
                          background: "rgba(239, 68, 68, 0.12)", 
                          color: "#f87171", 
                          padding: "2px 6px", 
                          borderRadius: "12px",
                          border: "1px solid rgba(239, 68, 68, 0.25)"
                        }}>
                          Nº {sala.numero} {sala.apelido ? `(${sala.apelido})` : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </ChartContainer>
        </Row>
      </DashboardWrapper>
    </Box>
  );
}

export default MenuDashboardAdmin;
