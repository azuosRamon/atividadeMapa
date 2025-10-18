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
import LerDados from "../BdLerTabela";
import { TbSettingsExclamation } from "react-icons/tb";
import Button from "../SubButton";
import cores from "../Cores.js"
import { supabase } from "/supabaseClient";
import { use } from "react";
import Slide from "../Slide.jsx";
import terreo from "../..//components/Plantas/TERREO_PAVIMENTO.png";
import { random } from "nanoid";

const BoxContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  align-items: flex-start;
  gap: 10px;
`;


async function LerImoveis(empresaId) {
    try {
    const { data, error } = await supabase
    .from("imoveis")
    .select("*")
    .eq("empresa_id", empresaId);
    
    if (error) {
      console.error("Erro ao ler imóvel:", error);
      return [];
    }
    
    return data || [];
} catch (err) {
    console.error("Erro inesperado ao ler imóvel:", err);
    return [];
}
}
async function LerBlocos(empresaId) {
    try {
    const { data, error } = await supabase
    .from("blocos")
    .select("*")
    .eq("empresa_id", empresaId);
    
    if (error) {
      console.error("Erro ao ler Blocos:", error);
      return [];
    }
    
    return data || [];
} catch (err) {
    console.error("Erro inesperado ao ler Blocos:", err);
    return [];
}
}
async function LerPavimentos(empresaId) {
    try {
    const { data, error } = await supabase
    .from("pavimentos")
    .select("*")
    .eq("empresa_id", empresaId);
    
    if (error) {
      console.error("Erro ao ler pavimentos:", error);
      return [];
    }
    
    return data || [];
} catch (err) {
    console.error("Erro inesperado ao ler pavimentos:", err);
    return [];
}
}
/*
        async function LerComodos(pavimentoId) {
            const { data, error } = await supabase.from("comodos").select("*").eq("pavimento_id", pavimentoId);
            if (!data) {
                console.error("Erro ao ler :", error);
                return null;
                }
                return data;
                }*/
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
    height: 100%;
    width: 10%;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
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
    width: 80%;
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
    const pavimentos = ["0","1","2","3"]
    return (
        <BoxPavimentos>
        <TituloHorizontal>Pavimentos</TituloHorizontal>
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
            </BoxPavimentos>
    )
}
function CardBloco({dadosBlocos, imovelSelecionado}) {
    const blocos = ["A", "B", "C"];
    const numeros = [11,12,13,14]
    return (
        <BoxBlocos>
        <TituloHorizontal>Bloco</TituloHorizontal>
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
            </BoxBlocos>
    )
}
function CardImovel({dadosImovel}) {
    return (
        <BoxImoveis>
        <TituloVertical>Imovel</TituloVertical>
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
        </BoxImovel>
            <VerticalBtn>Procurar</VerticalBtn>
            </BoxImoveis>
    )
}


function ConfigurarEdificio() {
  const [imoveis, setImoveis] = useState([]);
  const [imovelSelecionado, setImovelSelecionado] = useState(["0"]);
  const [blocos, setBlocos] = useState([]);
  const [blocoSelecionado, setBlocoSelecionado] = useState(["0"]);
  const [pavimentos, setPavimentos] = useState(["0","1","2","3"]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const dadosUsuario = JSON.parse(localStorage.getItem("usuario"));
      if (!dadosUsuario?.empresa_id) {
        console.warn("Usuário não encontrado no localStorage.");
        setCarregando(false);
        return;
      }

      const listaImoveis = await LerImoveis(dadosUsuario.empresa_id);
      const listaBlocos = await LerBlocos(dadosUsuario.empresa_id);
      const listaPavimentos = await LerPavimentos(dadosUsuario.empresa_id);
      setImoveis(listaImoveis);
      setBlocos(listaBlocos);
      setPavimentos(listaPavimentos);
      setCarregando(false);
    }

    carregar();
  }, []);

  if (carregando) return <Box><h3>Carregando imóveis...</h3></Box>;
    return(
            <BoxContainer>
                {imoveis && <CardImovel dadosImovel={imoveis}/>}
                {blocos && <CardBloco dadosBlocos={blocos} imovelSelecionado={imovelSelecionado} />}
                {pavimentos && <CardPavimento dadosBlocos={pavimentos} imovelSelecionado={imovelSelecionado} />}
            </BoxContainer>
    )
}

export default ConfigurarEdificio;