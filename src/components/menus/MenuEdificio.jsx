import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Label from "../SubLabel";
import TabelaCompleta from "../SubTabela";
import CampusOpcoes from "./MenuEdificioCampus";
import BlocosOpcoes from "./MenuEdificioBlocos";
import PavimentosOpcoes from "./MenuEdificioPavimentos";
import Colapse from "../SubColapse";
import TabelaCompletaTeste from "../SubTabelaEditavel";
import SalaOpcoes from "./MenuSalas";
import { TbSettingsExclamation } from "react-icons/tb";
import Button from "../SubButton";
import cores from "../Cores.js"
import { supabase } from "/supabaseClient";
import { use } from "react";
import Slide from "../Slide.jsx";
import terreo from "../..//components/Plantas/TERREO_PAVIMENTO.png";
import { random } from "nanoid";
import BussolaCarregando from "../BussolaLoading.jsx";

const BoxContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  align-items: flex-start;
  gap: 10px;
`;


async function LerDados(empresaId, tabela) {
    try {
    const { data, error } = await supabase
    .from(tabela)
    .select("*")
    .eq("empresa_id", empresaId);
    
    if (error) {
      console.error("Erro ao ler dados na tabela:", tabela, error);
      return [];
    }
    
    return data || [];
} catch (err) {
    console.error("Erro inesperado ao ler dados de ", tabela, err);
    return [];
}
}
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
    width: 10%;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    margin: auto 5px;
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


function CardPavimento({dados, blocoSelecionado}) {
    const pavimentos = []
    return (
        <BoxPavimentos>
        <TituloHorizontal>Pavimentos</TituloHorizontal>
        {pavimentos.length > 0 ? 
        <>
        <BoxPavimento>
            <DivInformacaoPavimentos>
                <TextoSelecione>Selecione:</TextoSelecione>   
                <Select>
                    {pavimentos.map((item)=>(
                        
                        <option value={item}><Nome>{(Number(item)===0 ? "Térreo" : item + "º")}</Nome></option>
                    ))}
                </Select>
                <LinhaInformacaoPavimentos>
                    <Chave>Salas:</Chave>
                    <Valor>1</Valor>
                </LinhaInformacaoPavimentos>
                <LinhaInformacaoPavimentos>
                    <Valor style={{color: cores.backgroundBotaoSemFoco2}}>|</Valor>
                </LinhaInformacaoPavimentos>
                <HorizontalBtn $bgcolor={cores.backgroundBotaoSemFoco}>Atualizar</HorizontalBtn>
                <HorizontalBtn $bgcolor={cores.corDeletar}>Excluir</HorizontalBtn>
            </DivInformacaoPavimentos>
            <ImagemPavimento src={terreo}></ImagemPavimento>
        </BoxPavimento>
                <HorizontalBtn $bgcolor={cores.backgroundBotaoSemFoco} style={{width: "100%"}}>+ Adicionar pavimento</HorizontalBtn>
        </>
    : <AdicionarBtn>+ Adicionar Pavimento</AdicionarBtn>}
            </BoxPavimentos>
    )
}
function CardBloco({dadosBlocos, imovelSelecionado}) {
    const blocos = [];
    return (
        <BoxBlocos>
        <TituloHorizontal>Bloco</TituloHorizontal>
        {blocos.length > 0 ? 
        <>
        <BoxVertical>
            
            <DivInformacaoVertical>
            <TextoSelecione>Selecione:</TextoSelecione>
            <Select>
                {blocos.map((item)=>(
                    
                    <option key={item} value={0}><Nome>{item}</Nome></option>
                ))}
            </Select>
                <LinhaInformacao>
                    <Chave>Pavimentos:</Chave>
                    <Valor>1</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Chave>Salas:</Chave>
                    <Valor>1</Valor>
                </LinhaInformacao>
            <HorizontalBtn $bgcolor={cores.backgroundBotaoSemFoco}>Atualizar</HorizontalBtn>
            <HorizontalBtn $bgcolor={cores.corDeletar}>Excluir</HorizontalBtn>
            </DivInformacaoVertical>
        </BoxVertical>
<HorizontalBtn $bgcolor={cores.backgroundBotaoSemFoco} style={{width: "100%"}}>+ Adicionar Bloco</HorizontalBtn></>
        : <AdicionarBtn>+ Adicionar  Bloco</AdicionarBtn>
    
    }
            </BoxBlocos>
    )
}
function CardImovel({dadosImovel}) {
    const data = dadosImovel
    return (
        <BoxImoveis>
        <TituloVertical>Imovel</TituloVertical>
        {data.length > 0 ? 
            <BoxImovel>
            <DivInformacao>
                <LinhaInformacao>
                    <Valor>Campus II</Valor>
                    <Valor>Maricá/RJ</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Valor>Avenida Roberto Silveira</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Valor>Próximo a quadra</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Chave>Blocos:</Chave>
                    <Valor>1</Valor>
                    <Chave>Pavimentos:</Chave>
                    <Valor>1</Valor>
                    <Chave>Salas:</Chave>
                    <Valor>1</Valor>
                </LinhaInformacao>
            </DivInformacao>
            <VerticalBtn $bgcolor={cores.backgroundBotaoSemFoco}>Atualizar</VerticalBtn>
            <VerticalBtn $bgcolor={cores.corDeletar}>Excluir</VerticalBtn>
            <VerticalBtn>Procurar</VerticalBtn>
            </BoxImovel>
        : <AdicionarBtn>Nenhum imóvel cadastrado, clique aqui para cadastrar um novo</AdicionarBtn>}
            </BoxImoveis>
    )
}
function CardContrato({dados}){
    const data = dados
    return(
        <>
        <Chave>Imoveis</Chave><Valor>1/{dados.qtd_comodos}</Valor>
        </>
    )
}
function CardComodos({dados}){
    const data = [1,2]
    return(
        <BoxComodos>
            <TituloVertical>Salas</TituloVertical>
            <ListaSalas>
                <BoxComodo>
                    <AdicionarBtn>+ Adicionar Novo</AdicionarBtn>
                </BoxComodo>
                {data.map((item)=>(
                    <BoxComodo>
                                <TituloHorizontal>Sala de aula</TituloHorizontal>
                        <DivInformacao>
                            <LinhaInformacao>
                                <Chave>Número:</Chave>
                                <Valor>{item}</Valor>
                            </LinhaInformacao>
                            <LinhaInformacao>
                                <Chave>Nome:</Chave>
                                <Valor>Elon</Valor>
                            </LinhaInformacao>
                            <LinhaInformacao>
                                <Chave>Lotação:</Chave>
                                <Valor>60</Valor>
                            </LinhaInformacao>
                        </DivInformacao>
                        <HorizontalBtn $bgcolor={cores.backgroundBotaoSemFoco}>Atualizar</HorizontalBtn>
                        <HorizontalBtn $bgcolor={cores.corDeletar}>Excluir</HorizontalBtn>
                    </BoxComodo>

                ))}
            </ListaSalas>
        </BoxComodos>
    )
}

function ConfigurarEdificio() {
  const [imoveis, setImoveis] = useState([]);
  const [imovelSelecionado, setImovelSelecionado] = useState(imoveis[0] ?? null);
  const [blocos, setBlocos] = useState([]);
  const [blocoSelecionado, setBlocoSelecionado] = useState(null);
  const [pavimentos, setPavimentos] = useState([]);
  const [pavimentoSelecionado, setPavimentoSelecionado] = useState(null);
  const [comodos, setComodos] =useState([]);
  const [comodosSelecionado, setComodosSelecionado] =useState(null);
  const [contrato, setContrato] = useState([]);
  const [carregando, setCarregando] = useState(true);


  useEffect(() => {
    async function carregar() {
      const dadosUsuario = JSON.parse(localStorage.getItem("usuario"));
      if (!dadosUsuario?.empresa_id) {
        console.warn("Usuário não encontrado no localStorage.");
        setCarregando(false);
        return;
      }

      const listaImoveis = await LerDados(dadosUsuario.empresa_id,"imoveis");
      const listaBlocos = await LerDados(dadosUsuario.empresa_id,"blocos");
      const listaPavimentos = await LerDados(dadosUsuario.empresa_id,"pavimentos");
      const listaComodos = await LerDados(dadosUsuario.empresa_id,"comodos");
      const dadosContrato =  await LerDados(dadosUsuario.empresa_id,"contratos_empresas");
      setImoveis(listaImoveis);
      setBlocos(listaBlocos);
      setPavimentos(listaPavimentos);
      setContrato(dadosContrato);
      setComodos(listaComodos);
      setCarregando(false);
    }

    carregar();
  }, []);
 
  useEffect(()=>{
    const blocosDoImovelSelecionado = blocos.filter(item => item.imovel_id === imovelSelecionado.imovel_id);
    setBlocoSelecionado(blocosDoImovelSelecionado[0])
  }, imovelSelecionado);

  if (carregando) return <Box><BussolaCarregando size="150px" ativo={true} /></Box>;
    return(
            <BoxContainer>
                
                {/*contrato.length === 0 && (<p>A empresa não possui um constrato ativo, por favor entre em contato para adquiri-lo</p>)*/}
                {contrato.length > 0 && <CardContrato dados={contrato}/>}
                {imoveis && <CardImovel dadosImovel={imoveis}/>}
                {imovelSelecionado && blocos && <CardBloco dadosBlocos={blocos} imovelSelecionado={imovelSelecionado} />}
                {blocoSelecionado && pavimentos && <CardPavimento dadosBlocos={pavimentos} imovelSelecionado={imovelSelecionado} />}
                {pavimentoSelecionado && comodos && <CardComodos dados={comodos}/>}
            </BoxContainer>
    )
}

export default ConfigurarEdificio;