import React, { useState } from "react";
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

function ConfigurarEdificio({ usuarioLogado, dados }) {
    const data = dados || {};
    const [operacao, setOperacao] = useState(0);
    const selecionarDados = [
        [LerDados({tabela:"imoveis", listaColunas:["*"]}),["imovel_id", "nome", "cidade", "logradouro"],[]],
        [LerDados({tabela:"blocos_view", listaColunas:["id", "bloco","imovel", "cidade"]}),["id", "bloco","imovel", "cidade"], []],
        [LerDados({tabela:"pavimentos_view", listaColunas:["id", "pavimento", "bloco", "imovel", "cidade"]}),["id", "pavimento", "bloco", "imovel", "cidade"],[]],
        [LerDados({tabela:"comodos_view", listaColunas:["id", "comodo", "tipo", "apelido", "pavimento", "bloco", "imovel", "cidade"]}),["id", "comodo", "tipo","apelido",  "pavimento", "bloco", "imovel", "cidade"],[]]
    ]
    return(
            <Box>
                <Colapse nome = "Consultar dados" estadoInicial={false}>
                    <Label htmlFor="operacao">Selecione a tabela a visualizar:</Label>
                        <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(Number(e.target.value))}}>
                            {selecionarDados.map((_, idx) => (
                                <option key={idx} value={idx}>
                                    {["Imoveis", "Blocos", "Pavimentos","Comodos"][idx]}
                                </option>
                                ))}
                        </Select>
                    <TabelaCompleta key={operacao} dados={selecionarDados[operacao][0]} lista={selecionarDados[operacao][1]} titulos={selecionarDados[operacao][2]}></TabelaCompleta>
                </Colapse>

                <Colapse nome = "Campus">
                    <CampusOpcoes usuarioLogado={usuarioLogado} dados={data.imovel}></CampusOpcoes>
                </Colapse>

               <Colapse nome = "Blocos">
                    <BlocosOpcoes dados={data}></BlocosOpcoes>
                </Colapse>
               <Colapse nome = "Pavimentos">
                    <PavimentosOpcoes dados={data}></PavimentosOpcoes>
                </Colapse>
               <Colapse nome = "Comodos">
                    <SalaOpcoes></SalaOpcoes>
                    {/*<TabelaCompletaTeste dados={data.salas} lista={["id", "numero", "apelido", "pavimentoId", "area"]}></TabelaCompletaTeste>*/}
                </Colapse>
            </Box>
    )
}

export default ConfigurarEdificio;