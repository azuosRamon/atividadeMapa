import React, { useState, useEffect, useCallback} from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Input from "../SubInput";
import Select from "../SubSelect";
import Label from "../SubLabel";
import Button from "../SubButton";
import Title from "../SubTitleH2";
import GridArea from "../SubGridArea";
import DivSeparador from "../SubDivSeparador";
import InputAutocomplete from "../SubInputAutocomplete";
import SubSelectAutocomplete from "../SubSelectAutocomplete";
import TabelaCompleta from "../SubTabela";
import Colapse from "../SubColapse"
import Slide from "../Slide"
import cores from "../Cores"
import useBancoDeDados from "../BdCrudSupabase";
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas";
import { supabase } from "/supabaseClient";
import Modal from "../SubModal";
import { FaDoorOpen } from "react-icons/fa";

async function LerDadosUsuarios(empresaId) {
    //informar uma lista composta de ['coluna', valorProcurado] para utilizar a condicao
    let query = supabase
    .from('usuarios_empresas')
    .select(`
            *,
            usuarios!inner(
                *, disponibilidade_semanal(
                    *
                    ))
        `)
    .eq("empresa_id", empresaId)
    .order('cargo_id', {ascending:true})
    .order('nome', {foreignTable: 'usuarios', ascending: true})
    ;

    try {
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao ler dados na tabela:", error);
      return [];
    }
    
    return data.filter(item => item.usuarios) || [];
    }catch(error){
    console.error("Erro inesperado ao ler dados de ", err);
    return [];
}
}
async function LerDadosHorarios(empresaId) {
    //informar uma lista composta de ['coluna', valorProcurado] para utilizar a condicao
    let query = supabase
    .from('horarios')
    .select(`
            *
        `)
    .eq("empresa_id", empresaId)
    .order('hora_inicio', {ascending:true})
    .order('hora_termino', {ascending: true})
    ;

    try {
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao ler dados na tabela:", error);
      return [];
    }
    
    return data || [];
} catch (err) {
    console.error("Erro inesperado ao ler dados de ", err);
    return [];
}
}
async function LerDadosComodos(empresaId) {
    //informar uma lista composta de ['coluna', valorProcurado] para utilizar a condicao
    let query = supabase
    .from('comodos')
    .select(`
            *,
                tipos_areas:tipo_area_id(*)
        `)
    .eq("empresa_id", empresaId)
    .order('lotacao', {ascending:true})
    .order('tipo_area_id', {ascending:true})
    .order('pavimento_id', {ascending: true})
    .order('numero', {ascending: true})
    .order('apelido', {ascending: true})
    ;

    try {
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao ler dados na tabela:", error);
      return [];
    }
    
    return data || [];
} catch (err) {
    console.error("Erro inesperado ao ler dados de ", err);
    return [];
}
}
async function LerDadosAulasParaComodos( empresaId, ano, semestre, dia = null) {

    let query = supabase
    .from('quadro_de_funcionamento')
    .select(`
            *,
                horarios(*)
        `)
    .eq("empresa_id", empresaId)
    .eq("ano", Number(ano))
    .eq("semestre", Number(semestre))
    if (dia) {
        query = query.eq('dia_da_semana', Number(dia))
    }
// eu quero retornar apenas as informações me minha empresa ou de outra empresa que possua o mesmo funcionario
    ;

    try {
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao ler dados na tabela:", error);
      return [];
    }
    
    return data || [];
} catch (err) {
    console.error("Erro inesperado ao ler dados de ", err);
    return [];
}
}
async function LerDadosAulasParaUsuarios( empresaId, ano, semestre, dia = null) {

    let query = supabase
    .from('quadro_de_funcionamento')
    .select(`
            *,
                horarios(*),
                usuarios(*,
                    usuarios_empresas(empresa_id)
                    )
        `)
    .eq("ano", Number(ano))
    .eq("semestre", Number(semestre))
    if (dia) {
        query = query.eq('dia_da_semana', Number(dia))
    }
// eu quero retornar apenas as informações me minha empresa ou de outra empresa que possua o mesmo funcionario
    ;

    try {
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao ler dados na tabela:", error);
      return [];
    }
    
    return data.filter((aula)=>aula.usuarios?.usuarios_empresas?.some(rel => rel.empresa_id === empresaId));
} catch (err) {
    console.error("Erro inesperado ao ler dados de ", err);
    return [];
}
}

const FormGrid = styled.form`
  gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
            "tabela tabela tabela"
            "operacao operacao ."
            "categoria categoria categoria"
            "produto produto produto"
            "turma ano semestre"
            "horario horario dia_da_semana"
            "usuario usuario usuario  "
            "ocupacao tipo_area comodo_id"
            ". reset botoes";
        
;
    
@media (max-width: 768px) {
    display: flex;
    flex-direction: column;
}
`;

const Option = styled.option`
    //background-color: ${(props) => props.$disponivel ? "green" : "red"};
    background-color: ${(props) => props.$disponivel === "disponivel" ? cores.corDisponivel : props.$disponivel === "parcial" ? cores.corParcial : cores.corIndisponivel};
    color: #000;

    &:disabled{
        //color: #000;
        font-style: italic;
    }
`

const SeletorBotao = styled.button`
  margin: 10px 0;
  border: 1px solid #000;
  width: 100%;
  height: 40px;
  padding: 10px;
  color: ${cores.corTexto};
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${cores.backgroundInput};
  text-align: left;
  
  &:hover {
    background-color: #222;
    transition: 0.5s;
  }
`;

const ThumbMini = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  border: 1px solid ${cores.corWhite};
`;

const MiniAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #555;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  border: 1px solid ${cores.corWhite};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px 5px;
`;

const CardFuncionario = styled.div`
  background-color: ${cores.backgroundBox};
  border: 2px solid ${props => 
    props.$status === "disponivel" 
      ? cores.corDisponivel 
      : props.$status === "parcial" 
      ? cores.corParcial 
      : cores.corIndisponivel
  };
  opacity: ${props => props.$disabled ? 0.5 : 1};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: ${props => props.$disabled ? "not-allowed" : "pointer"};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: ${props => props.$disabled ? "none" : "translateY(-4px)"};
    box-shadow: ${props => props.$disabled ? "none" : `0 4px 12px rgba(255, 255, 255, 0.15)`};
  }
`;

const FotoCard = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #444;
  margin-bottom: 12px;
  border: 2px solid ${cores.corWhite};
`;

const DefaultAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  border: 2px solid ${cores.corWhite};
`;

const NomeCard = styled.div`
  font-weight: bold;
  font-size: 15px;
  color: ${cores.corTexto};
  margin-bottom: 4px;
`;

const ConflitoCard = styled.div`
  font-size: 12px;
  color: ${cores.corTextoClaro};
`;

const StatusBadge = styled.div`
  font-size: 11px;
  margin-top: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${props => 
    props.$status === "disponivel" 
      ? "rgba(40, 167, 69, 0.2)" 
      : "rgba(220, 53, 69, 0.2)"
  };
  color: ${props => 
    props.$status === "disponivel" 
      ? cores.corDisponivel 
      : cores.corIndisponivel
  };
  font-weight: bold;
  text-transform: uppercase;
`;

const CardComodo = styled.div`
  background-color: ${cores.backgroundBox};
  border: 2px solid ${props => 
    props.$status === "disponivel" 
      ? cores.corDisponivel 
      : props.$status === "parcial" 
      ? cores.corParcial 
      : cores.corIndisponivel
  };
  opacity: ${props => props.$disabled ? 0.5 : 1};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: ${props => props.$disabled ? "not-allowed" : "pointer"};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: ${props => props.$disabled ? "none" : "translateY(-4px)"};
    box-shadow: ${props => props.$disabled ? "none" : `0 4px 12px rgba(255, 255, 255, 0.15)`};
  }
`;

const IconeComodoBox = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${cores.corTexto};
  font-size: 32px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

function ConfigurarQuadroAulas({ usuarioLogado }) {
    /*const funcionamento = {
        
        //informar o nome da turma e pode incluir mais de uma COLOCANDO;
        //bonus poderá salvar no localstorage um padrão para a turma e ao informar o nome da turma posteriormente deve recarregar alguns dados como curso, professores, disciplinas
        turma

        //deverá abrir uma tabela com as salas, mostrando lotacao, tipo, cidade, campus, bloco, pavimento e visualização do mapa, 
            
            //organizacao inicial deve ser baseada no mais proximo da lotacao informada
            
            //a tabela deve permitir pesquisas para cada item do cabeçalho
          
            //abrir a visualizacao deve mostrar as salas com 3 niveis de cores, verde - disponivel e é igual ou maior que a lotação, laranja disponivel mas abaixo da lotacao, vermelha - cabe a lotacao mas não esta disponivel
            
            //a ideia e que ao clicar na sala vermelha abra os dados da aula cadastrada para aquele horario
        

    }*/
   const [comodosBase, setComodosBase] = useState([]);
   const [comodos, setComodos] = useState([]);
   const [qtdComodosDisponivel, setQtdComodosDisponivel] = useState(0);
   const [professoresBase, setProfessoresBase] = useState([]);
   const [professores, setProfessores] = useState([]);
   const [aulasUsuarios, setAulasUsuarios] = useState([]);
   const [aulasComodos, setAulasComodos] = useState([]);
   const [horarios, setHorarios] = useState([]);

   const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false);
   const [buscaUsuario, setBuscaUsuario] = useState("");

   const [modalComodoAberto, setModalComodoAberto] = useState(false);
   const [buscaComodo, setBuscaComodo] = useState("");

   const tabela = mapa.quadro_de_funcionamento;
   const data_atual = new Date();
   const ano = data_atual.getFullYear();
   const semestre = data_atual.getMonth() <= 5 ? 1 : 2;
   const [objeto, setObjeto] = useState(
       Object.fromEntries(
           Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id"?usuarioLogado.empresa_id: k=="ano"? ano: k=="semestre"? semestre :v.valor]))
       )
   );

   const funcionarioSelecionado = professores.find(p => p.usuario_id === objeto.usuario_id);
   const textoBotao = funcionarioSelecionado 
     ? `${funcionarioSelecionado.usuarios.nome} ${funcionarioSelecionado.usuarios.sobrenome || ""}` 
     : "Selecionar Funcionário";

   const professoresFiltrados = professores.filter(p => {
       const nomeCompleto = `${p.usuarios.nome} ${p.usuarios.sobrenome || ""}`.toLowerCase();
       return nomeCompleto.includes(buscaUsuario.toLowerCase());
   });

   const comodoSelecionado = comodos.find(c => c.comodo_id === objeto.comodo_id);
   const textoBotaoComodo = comodoSelecionado 
     ? `Nº ${comodoSelecionado.numero} ${comodoSelecionado.apelido ? `(${comodoSelecionado.apelido})` : ""} - ${comodoSelecionado.tipos_areas?.nome || ""}` 
     : "Selecionar Cômodo";

   const comodosFiltrados = comodos.filter(c => {
       const query = buscaComodo.toLowerCase();
       const numeroMatch = String(c.numero).includes(query);
       const apelidoMatch = c.apelido ? c.apelido.toLowerCase().includes(query) : false;
       const areaMatch = c.tipos_areas?.nome ? c.tipos_areas.nome.toLowerCase().includes(query) : false;
       return numeroMatch || apelidoMatch || areaMatch;
   });
    
    const [operacao, setOperacao] = useState("0");
    
    const {
        data,
        pesquisa,
        loading,
        fazerEnvio,
        alterarObjeto
    } = useBancoDeDados({
        nomeTabela: tabela.tabela.nome,
        objeto,
        setObjeto,
        operacao,
        campoId: tabela.tabela.lista[0],
        campoNome: tabela.tabela.lista[1],
    });
    
   

    const fetchUsuarios = useCallback(async () => {
        try{
            const dados = await LerDadosUsuarios(usuarioLogado.empresa_id);
            setProfessoresBase(dados);
        } catch(error) {
            console.error("Erro ao atualizar dados de usuários:", error.message);
        }
    }, [usuarioLogado.empresa_id]); // Dependência: empresa_id
    
    const fetchHorarios = useCallback(async () => {
        try{
            const dados = await LerDadosHorarios(usuarioLogado.empresa_id);
            setHorarios(dados);
        } catch(error) {
            console.error("Erro ao atualizar dados de horários:", error.message);
        }
    }, [usuarioLogado.empresa_id]);
    
    const fetchComodos = useCallback(async () => {
        try{
            const dados = await LerDadosComodos(usuarioLogado.empresa_id);
            setComodosBase(dados);
        } catch(error) {
            console.error("Erro ao atualizar dados de horários:", error.message);
        }
    }, [usuarioLogado.empresa_id]);
    const fetchAulasUsuarios = async () => {
        console.log("Buscando aulas com:", {
            ano: objeto.ano,
            semestre: objeto.semestre,
            dia: objeto.dia_da_semana
            });
        try{
            const dados = await LerDadosAulasParaUsuarios(usuarioLogado.empresa_id, objeto.ano, objeto.semestre, objeto.dia_da_semana);
            setAulasUsuarios(dados);
        } catch(error) {
            console.error("Erro ao atualizar dados de horários:", error.message);
        }
    };
    const fetchAulasComodos = async () => {
        try{
            const dados = await LerDadosAulasParaComodos(usuarioLogado.empresa_id, objeto.ano, objeto.semestre, objeto.dia_da_semana);
            setAulasComodos(dados);
        } catch(error) {
            console.error("Erro ao atualizar dados de horários:", error.message);
        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchHorarios();
        fetchComodos();

    }, []);
   
    useEffect(() => {
        fetchAulasUsuarios();
        fetchAulasComodos();

    }, [objeto.ano, objeto.semestre, objeto.dia_da_semana]);

     useEffect(()=>{
        console.log(objeto);

    }, [objeto])
     useEffect(()=>{
        console.log('aulas Usuarios', aulasUsuarios);

    }, [aulasUsuarios])
     useEffect(()=>{
        console.log('aulas Comodos', aulasComodos);

    }, [aulasComodos])
 
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

    const inicioDesejado = toMinutes("08:00:00");
    const fimDesejado = toMinutes("10:00:00");
    const [quantidadeProfessoresDisponiveis, setQtdProfDisp] = useState(0);
const compararDisponibilidade = () => {
    if (!objeto.horario_id || horarios.length === 0) return;

    console.log("Comparar disponibilidade ↓");
    const horarioSelecionado = horarios.find(
        (item) => item.horario_id === Number(objeto.horario_id)
    );

    if (!horarioSelecionado) return;

    const inicioDesejadoMin = toMinutes(horarioSelecionado.hora_inicio);
    const fimDesejadoMin = toMinutes(horarioSelecionado.hora_termino);

    if (inicioDesejadoMin == null || fimDesejadoMin == null) {
        console.log("Horário inválido!");
        return;
    }

    let listaAtualizada = professoresBase.map((funcionario) => {
        const usuario = funcionario.usuarios;
        const disponibilidade = usuario.disponibilidade_semanal || [];

        const disponibilidadesDoDia = disponibilidade
            .filter((h) => Number(h.dia_da_semana) === Number(objeto?.dia_da_semana))
            .map((h) => ({
                inicio: toMinutes(h.hora_inicio),
                fim: toMinutes(h.hora_fim)
            }))
            .filter(h => h.inicio !== null && h.fim !== null)
            .sort((a, b) => a.inicio - b.inicio);

        let fimContinuo = inicioDesejadoMin;
        for (const bloco of disponibilidadesDoDia) {
            if (bloco.fim <= fimContinuo) continue;
            if (bloco.inicio <= fimContinuo) {
                fimContinuo = Math.max(fimContinuo, bloco.fim);
            } else {
                break;
            }
        }
        
        const disponivel = fimContinuo >= fimDesejadoMin;
        
        const verificarConflito = aulasUsuarios.some((aula)=>{
            if (Number(aula.dia_da_semana) !== Number(objeto?.dia_da_semana)) return false;
            if (aula.usuario_id !== funcionario.usuario_id) return false;
            if (objeto?.funcionamento_id && aula.funcionamento_id === objeto.funcionamento_id) return false;

            let inicio = toMinutes(aula.horarios.hora_inicio);
            let fim    = toMinutes(aula.horarios.hora_termino);

            return intervalosIntersectam(
                inicioDesejadoMin, fimDesejadoMin,
                inicio, fim
            );
        });


        let conflito = "Disponível";
        if (verificarConflito){
            
            conflito = "Em outra atividade..."

        } 
        if (!disponivel){
            conflito = "Não disponível neste horário"
        }


        return {
            ...funcionario,
            usuarios: {
                ...usuario,
                status: disponivel && !verificarConflito ? "disponivel" :  "indisponivel",
                conflito: conflito
            }
        };
    });

    const ordem = {disponivel: 1, parcial: 2, indisponivel: 3}
    listaAtualizada.sort((a,b)=> ordem[a.usuarios.status] - ordem[b.usuarios.status])


    setProfessores(listaAtualizada);

    const qtd = listaAtualizada.filter(f => f.usuarios.status === "disponivel").length;
    setQtdProfDisp(qtd);

};


   useEffect(() => {
        compararDisponibilidade();
    }, [
        objeto.ano,
        objeto.semestre,
        objeto.dia_da_semana, 
        objeto.horario_id, 
        aulasUsuarios,
        professoresBase
    ]);


    const verificarComodos = ()=>{
        if (!objeto.ocupacao && !objeto.tipo_area_id) return;

        if (!objeto.horario_id || horarios.length === 0) return;

        console.log("Comparar disponibilidade ↓");
        const horarioSelecionado = horarios.find(
            (item) => item.horario_id === Number(objeto.horario_id)
        );

        if (!horarioSelecionado) return;

        const inicioDesejadoMin = toMinutes(horarioSelecionado.hora_inicio);
        const fimDesejadoMin = toMinutes(horarioSelecionado.hora_termino);
    
        let ocupacaoDesejada = Number(objeto.ocupacao) || 0;
        let areaDesejada = Number(objeto.tipo_area_id) || 0;
        let listaAtualizada = comodosBase.map((comodo)=>{
            const verificarConflito = aulasComodos.some((aula)=>{
                if (Number(aula.dia_da_semana) !== Number(objeto?.dia_da_semana)) return false;
                if (aula.comodo_id !== comodo.comodo_id) return false;
                if (objeto?.funcionamento_id && aula.funcionamento_id === objeto.funcionamento_id) return false;
    
                let inicio = toMinutes(aula.horarios.hora_inicio);
                let fim    = toMinutes(aula.horarios.hora_termino);
    
                return intervalosIntersectam(
                    inicioDesejadoMin, fimDesejadoMin,
                    inicio, fim
                );
            });
            let disponibilidade = "disponivel"
            let conflito = "Disponível";
            if ((comodo.lotacao >= ocupacaoDesejada) && (comodo.tipo_area_id === areaDesejada) && (!verificarConflito)){
                disponibilidade = "disponivel"
                conflito = "Disponível"
            } 
            else if ((comodo.lotacao >= ocupacaoDesejada) || (comodo.tipo_area_id === areaDesejada)){
                disponibilidade = "parcial"
                conflito = "Não compátivel"
            } else {
                disponibilidade = "indisponivel"
                conflito = "Não compátivel"
            }
    
    
            if (verificarConflito && disponibilidade != "indisponivel"){
                disponibilidade = "indisponivel";
                conflito = "Em uso..."    
            } 

            
            return{
                ...comodo,
                    status: disponibilidade,
                    conflito: conflito
            }
        })




        const ordem = {disponivel: 1, parcial: 2, indisponivel: 3}
        listaAtualizada.sort((a,b)=> ordem[a.status] - ordem[b.status])
    
        setComodos(listaAtualizada);
    
        let qtdComodosDisp = listaAtualizada.filter(item => item.status === "disponivel").length;
        setQtdComodosDisponivel(qtdComodosDisp);
    }
    useEffect(()=>{
        verificarComodos()
    }, [objeto.ocupacao, 
        objeto.tipo_area_id,
        objeto.ano,
        objeto.semestre,
        objeto.dia_da_semana, 
        objeto.horario_id, 
        aulasComodos
    ])



    return(
        <React.Fragment>
            <Box>
                <Title>Quadro de funcionamento</Title>
                <FormGrid onSubmit={fazerEnvio}>

                    <CriarCamposFormulario 
                    item={tabela}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto={objeto}
                    setObjeto={setObjeto}
                    ></CriarCamposFormulario>

                    <GridArea $area="usuario">
                        <Label>Funcionário: <span style={{ color: cores.corTextoClaro, fontWeight: "normal" }}>({quantidadeProfessoresDisponiveis} livres)</span></Label>
                        <SeletorBotao type="button" onClick={() => setModalUsuarioAberto(true)}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {funcionarioSelecionado?.usuarios?.imagem ? (
                                    <ThumbMini src={funcionarioSelecionado.usuarios.imagem} alt="Foto" />
                                ) : funcionarioSelecionado ? (
                                    <MiniAvatar>
                                        {(funcionarioSelecionado.usuarios.nome?.[0] || "").toUpperCase()}
                                        {(funcionarioSelecionado.usuarios.sobrenome?.[0] || "").toUpperCase()}
                                    </MiniAvatar>
                                ) : null}
                                <span>{textoBotao}</span>
                            </div>
                            <span style={{ fontSize: '13px', color: cores.corTextoClaro }}>
                                {funcionarioSelecionado ? `(${funcionarioSelecionado.usuarios.conflito})` : "Clique para selecionar"}
                            </span>
                        </SeletorBotao>
                    </GridArea>
                    <GridArea $area="horario">
                            <Label>Horario</Label>
                        <Select onChange={(e)=>(alterarObjeto(e, 'horario_id'))}>
                            <option value={"0"}>Selecione um horario</option>
                            {
                                horarios.map((horario)=>{
                                    if (horario.ano === objeto.ano && horario.semestre === objeto.semestre){
                                        return(<option key={horario.horario_id} value={horario.horario_id}>{horario.hora_inicio}  |  {horario.hora_termino}</option>)
                                    }
                                })
                            }
                        </Select>
                    </GridArea>
                    <GridArea $area="comodo_id">
                        <Label>Cômodo: <span style={{ color: cores.corTextoClaro, fontWeight: "normal" }}>({qtdComodosDisponivel} livres)</span></Label>
                        <SeletorBotao type="button" onClick={() => setModalComodoAberto(true)}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaDoorOpen style={{ fontSize: '18px', marginRight: '8px', color: cores.corTextoClaro }} />
                                <span>{textoBotaoComodo}</span>
                            </div>
                            <span style={{ fontSize: '13px', color: cores.corTextoClaro }}>
                                {comodoSelecionado ? `(${comodoSelecionado.conflito})` : "Clique para selecionar"}
                            </span>
                        </SeletorBotao>
                    </GridArea>
                    {/*
                    19/11 -professores conflitalos com horarios já lançados separar
                    -comodos pela busca de acordo com ocupacao
                    */}
                </FormGrid>
            </Box>

            <Modal aberto={modalUsuarioAberto} onFechar={() => setModalUsuarioAberto(false)}>
                <Box>
                    <Title style={{ marginBottom: "10px" }}>Selecionar Funcionário</Title>
                    <div style={{ color: cores.corTextoClaro, fontSize: "14px", marginBottom: "20px" }}>
                        Selecione um funcionário disponível para este horário.
                    </div>
                    <Input
                        placeholder="Pesquisar por nome ou sobrenome..."
                        value={buscaUsuario}
                        onChange={(e) => setBuscaUsuario(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <CardsGrid>
                        {professoresFiltrados.length === 0 ? (
                            <div style={{ color: "#fff", gridColumn: "1/-1", textAlign: "center", padding: "20px" }}>
                                Nenhum funcionário encontrado.
                            </div>
                        ) : (
                            professoresFiltrados.map((item) => {
                                const status = item.usuarios.status;
                                const isIndisponivel = !status || status === "indisponivel";
                                const iniciais = ((item.usuarios.nome?.[0] || "") + (item.usuarios.sobrenome?.[0] || "")).toUpperCase();
                                
                                return (
                                    <CardFuncionario
                                        key={item.usuario_id}
                                        $status={status}
                                        $disabled={isIndisponivel}
                                        onClick={() => {
                                            if (!isIndisponivel) {
                                                setObjeto(prev => ({ ...prev, usuario_id: item.usuario_id }));
                                                setModalUsuarioAberto(false);
                                                setBuscaUsuario("");
                                            }
                                        }}
                                    >
                                        {item.usuarios.imagem ? (
                                            <FotoCard src={item.usuarios.imagem} alt={`${item.usuarios.nome} Foto`} />
                                        ) : (
                                            <DefaultAvatar>{iniciais}</DefaultAvatar>
                                        )}
                                        <NomeCard>
                                            {item.usuarios.nome} {item.usuarios.sobrenome || ""}
                                        </NomeCard>
                                        <ConflitoCard>
                                            {item.usuarios.conflito}
                                        </ConflitoCard>
                                        <StatusBadge $status={status}>
                                            {status === "disponivel" ? "Disponível" : "Indisponível"}
                                        </StatusBadge>
                                    </CardFuncionario>
                                );
                            })
                        )}
                    </CardsGrid>
                </Box>
            </Modal>

            <Modal aberto={modalComodoAberto} onFechar={() => setModalComodoAberto(false)}>
                <Box>
                    <Title style={{ marginBottom: "10px" }}>Selecionar Cômodo</Title>
                    <div style={{ color: cores.corTextoClaro, fontSize: "14px", marginBottom: "20px" }}>
                        Selecione um cômodo compatível e disponível para este horário.
                    </div>
                    <Input
                        placeholder="Pesquisar por número, apelido ou tipo de área..."
                        value={buscaComodo}
                        onChange={(e) => setBuscaComodo(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <CardsGrid>
                        {comodosFiltrados.length === 0 ? (
                            <div style={{ color: "#fff", gridColumn: "1/-1", textAlign: "center", padding: "20px" }}>
                                Nenhum cômodo encontrado.
                            </div>
                        ) : (
                            comodosFiltrados.map((item) => {
                                const status = item.status;
                                const isIndisponivel = !status || status === "indisponivel";
                                
                                return (
                                    <CardComodo
                                        key={item.comodo_id}
                                        $status={status}
                                        $disabled={isIndisponivel}
                                        onClick={() => {
                                            if (!isIndisponivel) {
                                                setObjeto(prev => ({ ...prev, comodo_id: item.comodo_id }));
                                                setModalComodoAberto(false);
                                                setBuscaComodo("");
                                            }
                                        }}
                                    >
                                        <IconeComodoBox>
                                            <FaDoorOpen />
                                        </IconeComodoBox>
                                        <NomeCard>
                                            Nº {item.numero} {item.apelido ? `(${item.apelido})` : ""}
                                        </NomeCard>
                                        <ConflitoCard style={{ fontSize: '13px', color: cores.corTextoClaro, margin: '4px 0' }}>
                                            {item.tipos_areas?.nome || "Cômodo"}
                                        </ConflitoCard>
                                        <ConflitoCard>
                                            Lotação: {item.lotacao} | {item.conflito}
                                        </ConflitoCard>
                                        <StatusBadge $status={status}>
                                            {status === "disponivel" ? "Disponível" : status === "parcial" ? "Parcial" : "Indisponível"}
                                        </StatusBadge>
                                    </CardComodo>
                                );
                            })
                        )}
                    </CardsGrid>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default ConfigurarQuadroAulas;