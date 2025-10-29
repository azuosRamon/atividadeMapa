import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import CardImovel from "./MenuEdificioCampus";
import CardBloco from "./MenuEdificioBlocos";
import CardPavimento from "./MenuEdificioPavimentos";
import CardComodos from "./MenuSalas";
import Button from "../SubButton";
import cores from "../Cores.js"
import terreo from "../..//components/Plantas/TERREO_PAVIMENTO.png";
import BussolaCarregando from "../BussolaLoading.jsx";
import Modal from "../SubModal.jsx";
import { supabase } from "/supabaseClient";



async function LerDadosImoveis(empresaId) {
    //informar uma lista composta de ['coluna', valorProcurado] para utilizar a condicao
    let query = supabase
    .from('imoveis')
    .select(`
            *,
            blocos(
                *,
                pavimentos(
                    *,
                    comodos(
                    *,
                    tipos_areas(nome)
                    )
                    ))
        `)
    .eq("empresa_id", empresaId)
    .order('nome', {ascending:true})
    .order('nome', {foreignTable: 'blocos', ascending: true})
    .order('numero', {foreignTable: 'blocos.pavimentos', ascending: true})
    .order('numero', {foreignTable: 'blocos.pavimentos.comodos', ascending: true})
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


const TitleSublinhado = styled.h2`
    border-bottom: 2px solid;
    margin-bottom: 0 0 20px 0;
    color: ${cores.corTexto};
`

/*
function CardImovel({dadosImovel, dadosUsuario, selecao, setSelecao }) {
    const [operacao, setOperacao] = useState("1")
    const [itemModificar, setItemModificar] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false);

    const data = selecao;


    return (
        <BoxImoveis>
        <Modal aberto={mostrarModal} onFechar={() => setMostrarModal(false)}>
            <CampusOpcoes 
                usuarioLogado={dadosUsuario} 
                operacaoEnviada={operacao} 
                item={itemModificar}>
            </CampusOpcoes>

        </Modal>
        <TituloVertical>Imóveis</TituloVertical>
        {dadosImovel.length > 0 ? 
            <BoxImovel>
            <DivInformacao>
                <LinhaInformacao>
                    <Valor>{data.nome}</Valor>
                    <Valor>{data.cidade}/{data.estado}</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Valor>{data.logradouro}</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Valor>{data.complemento}</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Chave>Blocos:</Chave>
                    <Valor>{data?.blocos?.length || 0}</Valor>
                    <Chave>Pavimentos:</Chave>
                    <Valor>{data?.blocos?.pavimentos?.length || 0}</Valor>
                    <Chave>Salas:</Chave>
                    <Valor>{data?.blocos?.pavimentos?.comodos?.length || 0}</Valor>
                </LinhaInformacao>
            </DivInformacao>
            <VerticalBtn onClick={(e)=>{
                e.preventDefault();
                setItemModificar(selecao);
                setOperacao("2");
                setMostrarModal(true);
            }} $bgcolor={cores.backgroundBotaoSemFoco}>Atualizar</VerticalBtn>
            <VerticalBtn
                onClick={(e)=>{
                    e.preventDefault();
                    setItemModificar(selecao);
                    setOperacao("3");
                    setMostrarModal(true);
                }} 
             $bgcolor={cores.corDeletar}>Excluir</VerticalBtn>
            <VerticalBtn>Procurar</VerticalBtn>
            </BoxImovel>
        : <AdicionarBtn onClick={(e)=>{
            e.preventDefault();
            setMostrarModal(true)}
        } >Nenhum imóvel cadastrado, clique aqui para cadastrar um novo</AdicionarBtn>}
            </BoxImoveis>
    )
}*/
function CardContrato({dados}){
    const data = dados
    return(
        <>
        <Chave>Imoveis</Chave><Valor>1/{dados.qtd_comodos}</Valor>
        </>
    )
}

function ConfigurarEdificio() {
  const [usuario, setUsuario] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [imovelSelecionado, setImovelSelecionado] = useState(null);
  const [blocoSelecionado, setBlocoSelecionado] = useState(null);
  const [pavimentoSelecionado, setPavimentoSelecionado] = useState(null);
  const [comodoSelecionado, setComodoSelecionado] =useState(null);
  const [contrato, setContrato] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  const handleCardClick = (imovel) => (e) => {
    e.preventDefault();
    console.log("Imóvel selecionado:", imovel);

    setImovelSelecionado(imovel);
    
    // Definição de defaults (com optional chaining para segurança)
    const primeiroBloco = imovel.blocos?.[0];
    const primeiroPavimento = primeiroBloco?.pavimentos?.[0];
    
    setBlocoSelecionado(primeiroBloco || null);
    setPavimentoSelecionado(primeiroPavimento || null);
    
    setMostrarModalSelecao(false);
};
    
    useEffect(() => {
        async function carregar() {
            const dadosUsuario = JSON.parse(localStorage.getItem("usuario"));
            if (!dadosUsuario?.empresa_id) {
                console.warn("Usuário não encontrado no localStorage.");
                setCarregando(false);
                return;
            }
            setUsuario(dadosUsuario);
            
            const dadosImoveisCompleto = await LerDadosImoveis(dadosUsuario.empresa_id);
            console.log("Dados dos imóveis carregados:", dadosImoveisCompleto);
            setImoveis(dadosImoveisCompleto);
            if (!imovelSelecionado && dadosImoveisCompleto.length > 0) {
                const primeiroImovel = dadosImoveisCompleto[0];
                const primeiroBloco = primeiroImovel.blocos?.[0] || null;
                setImovelSelecionado(primeiroImovel);
                if (primeiroBloco) setBlocoSelecionado(primeiroBloco);
                }
                setPavimentoSelecionado(blocoSelecionado?.pavimentos?.[0] || null)


              setCarregando(false);
            }
            
            carregar();
        }, []);

        const [mostrarModalSelecao, setMostrarModalSelecao] = useState(false);
  if (carregando) return <BussolaCarregando aberto={carregando} onFechar={() => setCarregando(false)}>Buscando imóveis</BussolaCarregando>;
    return(
            <BoxContainer>
                <Modal aberto={mostrarModalSelecao} onFechar={() => setMostrarModalSelecao(false)}>
                    {imoveis.map((item, indice) =>{
                        console.log("Imovel na modal de seleção:", item);
                        return(
                            <CardImovel 
                            onClick={handleCardClick(item)}
                                key={item.imovel_id}
                                dadosImovel={item}
                                setSelecao={setImovelSelecionado} 
                                dadosUsuario={usuario}
                                indice={indice}/>
                        )

                    })}
                </Modal>
                
                {/*contrato.length === 0 && (<p>A empresa não possui um constrato ativo, por favor entre em contato para adquiri-lo</p>)*/}
                {contrato.length > 0 && <CardContrato dados={contrato}/>}
                {imoveis && <CardImovel 
                selecao={imovelSelecionado} 
                setSelecao={setImovelSelecionado}  
                dadosUsuario={usuario}/>}
                            <VerticalBtn
             onClick={(e)=>{
                    e.preventDefault();
                    setMostrarModalSelecao(true);
                }} >Trocar</VerticalBtn>


                {imovelSelecionado && <CardBloco 
                key={imovelSelecionado.imovel_id}
                dadosBlocos={imovelSelecionado} 
                selecao={blocoSelecionado} 
                setSelecao={setBlocoSelecionado} 
                dadosUsuario={usuario}
                />}

                {blocoSelecionado && <CardPavimento 
                key={blocoSelecionado.bloco_id}
                dadosPavimentos={blocoSelecionado} 
                selecao={pavimentoSelecionado} 
                setSelecao={setPavimentoSelecionado} 
                dadosUsuario={usuario}
                blocoId={blocoSelecionado.bloco_id}
                />}
                {pavimentoSelecionado && <CardComodos 
                key={pavimentoSelecionado.pavimento_id}
                dadosUsuario={usuario}
                pavimentoId={pavimentoSelecionado.pavimento_id}
                dados={pavimentoSelecionado}/>}
            </BoxContainer>
    )
}

export default ConfigurarEdificio;

// ESTILOS

const BoxContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  align-items: flex-start;
  gap: 10px;
`;


const Chave = styled.p`
    font-size: 1rem;
    color: gray;
    font-weight: bold;  
    margin: 0;
    `;
const Valor = styled.p`
    font-size: 1rem;
    color: gray;
    margin: 0;
    `;
const DivInformacao = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 20px;
    width: 80%;
    `;
const DivInformacaoComodos = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 20px;
    width: 80%;
    `;
const LinhaInformacao = styled.div`
    display: flex;
    flex-direction: row;
    margin: 5px 0;
    gap: 10px;
    justify-content: space-between;
    `;
const LinhaInformacaoPavimentos = styled(LinhaInformacao)`
    margin: 0 10%;
`;

const AdicionarBtn = styled(Button)`
    min-height: 100px;
    height: 100%;
    width: 90%;
    margin: 10px auto;
    background-color: ${cores.cor3Transparente};
    `;
const HorizontalBtn = styled(Button)`
    height: 3rem;
    width: 80%;
    margin: 5px auto;
    `;
const TituloHorizontal = styled.h3`
    color: ${cores.corTextoClaro};
    background-color: ${cores.cor3};
    width: 100%;
    padding: 10px 0;
    margin: 0;
    `;
const TituloVertical = styled.h3`
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    color: ${cores.corTextoClaro};
    background-color: ${cores.cor3};
    padding: 10px;
    margin: 0;
    `;
const BoxVertical = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 5px 0;
    height: inherit;
    `;
const DivInformacaoVertical = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: auto;
    justify-content: space-evenly;
`;
const DivInformacaoPavimentos = styled(DivInformacaoVertical)`
    `;
const VerticalBtn = styled(Button)`
    height: 90%;
    width: 100%;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    margin: 0 auto;
    grid-column: span 1;
    `;
const BoxImoveis = styled.div`
    display: flex;
    border: 1px solid ${cores.boxShadow};
    max-height: 9em;
    grid-column: span 10;
`;
const BoxComodos = styled.div`
    display: flex;
    border: 1px solid ${cores.boxShadow};
    grid-column: span 10;
    `;
const BoxComodo = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 0 5px;
    grid-column: span 3;
`;
const ListaSalas = styled.div`
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap:10px;
    margin: auto;
    width:100%;
`;
const BoxImovel = styled.div`
    display: flex;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 0 5px;
    `;
const BoxBlocos = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${cores.boxShadow};
    grid-column: span 3;
    height: 100%;
    `;
const BoxPavimentos = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${cores.boxShadow};
    grid-column: span 7;
    height:100%;
    `;
const BoxPavimento = styled.div`
    display: flex;
    flex-direction: row;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 5px 0;
    height: inherit;
    `;
const Nome = styled.h1`
  background-color: ${cores.cor5}  ;
  padding: 20px;
  font-size: 2rem;
    margin: 10%;
`;
const Select = styled.select`
    background-color: ${cores.cor5}  ;
    padding: 20px;
    font-size: 1.5rem;
    margin: 0 10%;
    color: ${cores.corTextoClaro};
    font-weight:bold;
    text-align: center;
`;
const ImagemPavimento = styled.img`
  width: 60%;
  height: fit-content;  
  margin: auto;
`;
const TextoSelecione = styled(Chave)`
 text-align: left;
 margin: 0 10%;
`;
