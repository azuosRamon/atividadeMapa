import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Select from "../SubSelect";
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

import { supabase } from "/supabaseClient";
import { use } from "react";


const BoxImovel = styled.div`
    display: flex;
    border: 1px solid red;
`;


async function LerImovel(empresaId) {
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
/*
async function LerBlocos(imovelId) {
    const { data, error } = await supabase.from("blocos").select("*").eq("imovel_id", imovelId);
    if (!data) {
        console.error("Erro ao ler :", error);
        return null;
    }
    return data;
}
async function LerPavimentos(blocoId) {
    const { data, error } = await supabase.from("pavimentos").select("*").eq("bloco_id", blocoId);
    if (!data) {
        console.error("Erro ao ler :", error);
        return null;
    }
    return data;
}
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
`;
const LinhaInformacao = styled.div`
    display: flex;
    flex-direction: row;
    margin: 5px 0;
    gap: 15px;
`;

const AdicionarBtn = styled.button``;
const EditarBtn = styled.button``;
const TituloVertical = styled.h3`
    writing-mode: vertical-rl;
    transform: rotate(180deg);
`;

function CardImovel({dadosImovel}) {
    return (
        <BoxImovel>
            <TituloVertical>Imovel</TituloVertical>
            <DivInformacao>
                <LinhaInformacao>
                    <Chave>Nome:</Chave>
                    <Valor>Campus II</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Chave>Logradouro:</Chave>
                    <Valor>Avenida Roberto Silveira</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Chave>Complemento:</Chave>
                    <Valor>Próximo a quadra</Valor>
                </LinhaInformacao>
            </DivInformacao>
        </BoxImovel>
    )
}


function ConfigurarEdificio() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const dadosUsuario = JSON.parse(localStorage.getItem("usuario"));
      if (!dadosUsuario?.empresa_id) {
        console.warn("Usuário não encontrado no localStorage.");
        setCarregando(false);
        return;
      }

      const listaImoveis = await LerImovel(dadosUsuario.empresa_id);
      setImoveis(listaImoveis);
      setCarregando(false);
    }

    carregar();
  }, []);

  if (carregando) return <Box><h3>Carregando imóveis...</h3></Box>;
    return(
            <Box>
                <h1>asoaskan</h1>
                {imoveis && <CardImovel dadosImovel={imoveis}/>}

            </Box>
    )
}

export default ConfigurarEdificio;