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
  height: ${props => props.height}%;
  background: ${props => props.color || cores.cor3};
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: height 1s ease-in-out;

  &:hover::after {
    content: "${props => props.label}";
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    background: #444;
    padding: 2px 5px;
    border-radius: 4px;
  }
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  color: ${cores.corTexto};
  margin-bottom: 20px;
`;

function MenuDashboardAdmin({ usuarioLogado }) {
  const [stats, setStats] = useState({
    totalSalas: 0,
    usuariosAtivos: 0,
    produtosTotal: 0,
    valorContrato: 0,
    dataExpiracao: "---",
  });
  const [loading, setLoading] = useState(true);
  const modelo = JSON.parse(localStorage.getItem("modelo") || "{}");

  useEffect(() => {
    async function fetchData() {
      if (!usuarioLogado?.empresa_id) return;
      
      const [salas, usuarios, produtos, contrato] = await Promise.all([
        supabase.from("comodos").select("comodo_id", { count: "exact" }).eq("empresa_id", usuarioLogado.empresa_id),
        supabase.from("usuarios_empresas").select("id", { count: "exact" }).eq("empresa_id", usuarioLogado.empresa_id),
        supabase.from("produtos").select("produtos_id", { count: "exact" }).eq("empresa_id", usuarioLogado.empresa_id),
        supabase.from("contratos_empresas").select("valor, inicio, tempo_contrato_meses").eq("empresa_id", usuarioLogado.empresa_id).maybeSingle()
      ]);

      let dataExp = "---";
      if (contrato.data?.inicio && contrato.data?.tempo_contrato_meses) {
        const d = new Date(contrato.data.inicio);
        d.setMonth(d.getMonth() + contrato.data.tempo_contrato_meses);
        dataExp = d.toLocaleDateString('pt-BR');
      }

      setStats({
        totalSalas: salas.count || 0,
        usuariosAtivos: usuarios.count || 0,
        produtosTotal: produtos.count || 0,
        valorContrato: contrato.data?.valor || 0,
        dataExpiracao: dataExp
      });
      setLoading(false);
    }

    fetchData();
  }, [usuarioLogado]);

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
            value={stats.totalSalas} 
            color="#3b82f6" 
            indicator="Estável" 
          />
          <StatCard 
            icon={LuUsers} 
            title="Usuários Ativos" 
            value={stats.usuariosAtivos} 
            color="#10b981" 
            indicator="1/1" 
          />
          <StatCard 
            icon={LuCalendarDays} 
            title="Expiração do Contrato" 
            value={stats.dataExpiracao} 
            color="#ef4444" 
            indicator="Ativo" 
          />
        </Row>


        {/* Linha 3: Gráficos e Detalhes */}
        <Row style={{ gridTemplateColumns: "1fr 1fr" }}>
          <ChartContainer>
            <ChartTitle>Ocupação Mensal (Simulado)</ChartTitle>
            <FakeChart>
              <Bar height={40} label="Jan" />
              <Bar height={60} label="Fev" color={cores.cor1} />
              <Bar height={35} label="Mar" />
              <Bar height={80} label="Abr" color={cores.cor1} />
              <Bar height={55} label="Mai" />
              <Bar height={90} label="Jun" color={cores.cor1} />
            </FakeChart>
            <p style={{ fontSize: "12px", color: cores.corTextoClaro, textAlign: "center", marginTop: "15px" }}>
              Dados simulados de ocupação nos últimos 6 meses.
            </p>
          </ChartContainer>

          <ChartContainer>
            <ChartTitle>Distribuição por Categoria</ChartTitle>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ 
                width: "150px", 
                height: "150px", 
                borderRadius: "50%", 
                background: `conic-gradient(${cores.cor3} 0% 70%, ${cores.cor1} 70% 100%)`,
                position: "relative"
              }}>
                <div style={{ 
                  position: "absolute", 
                  inset: "30px", 
                  background: cores.backgroundBox, 
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: cores.corTextoClaro
                }}>
                  70% Principal
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", fontSize: "12px", color: "#fff" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "10px", height: "10px", background: cores.cor3 }}></div> Principal
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "10px", height: "10px", background: cores.cor1 }}></div> Outros
              </span>
            </div>
          </ChartContainer>
        </Row>
      </DashboardWrapper>
    </Box>
  );
}

export default MenuDashboardAdmin;
