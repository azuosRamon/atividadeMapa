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
import TabelaCompleta from "../SubTabela";
import Colapse from "../SubColapse"
import Slide from "../Slide"
import cores from "../Cores"
import useBancoDeDados from "../BdCrudSupabase";
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas";
import { supabase } from "/supabaseClient";

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
    //.eq("empresa_id", empresaId)
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

    const tabela = mapa.quadro_de_funcionamento;
    const data_atual = new Date();
    const ano = data_atual.getFullYear();
    const semestre = data_atual.getMonth() <= 5 ? 1 : 2;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id"?usuarioLogado.empresa_id: k=="ano"? ano: k=="semestre"? semestre :v.valor]))
        )
    );
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

        const disponivel = disponibilidade.some((h) => {
            if (Number(h.dia_da_semana) !== Number(objeto?.dia_da_semana))
                return false;
            
            const inicio = toMinutes(h.hora_inicio);
            const fim = toMinutes(h.hora_fim);
            
            return inicio <= inicioDesejadoMin && fimDesejadoMin <= fim;
        });
        
        const verificarConflito = aulasUsuarios.some((aula)=>{
            if (Number(aula.dia_da_semana) !== Number(objeto?.dia_da_semana)) return false;
            if (aula.usuario_id !== funcionario.usuario_id) return false;

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
        <Box>
                <Title>Quadro de funcionamento</Title>
                <FormGrid onSubmit={fazerEnvio}>

                    <CriarCamposFormulario 
                    item={tabela}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto ={objeto}
                    ></CriarCamposFormulario>

                    <GridArea $area="usuario">
                            <Label>Funcionário:</Label>

                        <Select onChange={(e)=>alterarObjeto(e, 'usuario_id')}>
                            <option value={"0"}>Selecione | Professores disponíveis:  {quantidadeProfessoresDisponiveis}</option>
                            {
                                professores.map((funcionario) => {
                                    return(
                                        <Option    
                                        key={funcionario.usuarios.usuario_id}
                                        value={funcionario.usuarios.usuario_id}
                                        disabled={!funcionario.usuarios?.status || funcionario.usuarios?.status === "indisponivel"}
                                        $disponivel={funcionario.usuarios.status || false}>{funcionario.usuarios.nome} | {funcionario?.usuarios?.conflito}</Option>
                                    )
                                })
                            }
                        </Select>

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
                            <Label>Comodos:</Label>
                        <Select onChange={(e)=>alterarObjeto(e, 'comodo_id')}>
                            <option key={0} value={"0"}>Selecione | Disponíveis: {qtdComodosDisponivel}</option>
                            {
                                comodos.map((comodo)=>{
                                    
                                    return(<Option $disponivel={comodo.status} disabled={!comodo?.status ||comodo.status==="indisponivel"} key={comodo.comodo_id} value={comodo.comodo_id}>{comodo.conflito} | {comodo.tipos_areas.nome}  | Nº {comodo.numero} | Lotação {comodo.lotacao} | </Option>)                                        
                                    
                                    
                                })
                            }
                        </Select>
                    </GridArea>
                    {/*
                    19/11 -professores conflitalos com horarios já lançados separar
                    -comodos pela busca de acordo com ocupacao
                    */}
                </FormGrid>
            </Box>
    )
}

export default ConfigurarQuadroAulas;