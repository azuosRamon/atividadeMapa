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
        [LerDados({tabela:"campi", listaColunas:["*"]}),["campus_id", "nome", "cidade", "logradouro"],[]],
        [LerDados({tabela:"blocos_view", listaColunas:["id", "bloco","campus", "cidade"]}),["id", "bloco","campus", "cidade"], []],
        [LerDados({tabela:"pavimentos_view", listaColunas:["id", "pavimento", "bloco", "campus", "cidade"]}),["id", "pavimento", "bloco", "campus", "cidade"],[]],
        [LerDados({tabela:"salas_view", listaColunas:["id", "sala", "tipo", "apelido", "pavimento", "bloco", "campus", "cidade"]}),["id", "sala", "tipo","apelido",  "pavimento", "bloco", "campus", "cidade"],[]]
    ]
    return(
            <Box>
                <Colapse nome = "Consultar dados" estadoInicial={false}>
                    <Label htmlFor="operacao">Selecione a tabela a visualizar:</Label>
                        <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(Number(e.target.value))}}>
                            {selecionarDados.map((_, idx) => (
                                <option key={idx} value={idx}>
                                    {["Campi", "Blocos", "Pavimentos","Salas"][idx]}
                                </option>
                                ))}
                        </Select>
                    <TabelaCompleta key={operacao} dados={selecionarDados[operacao][0]} lista={selecionarDados[operacao][1]} titulos={selecionarDados[operacao][2]}></TabelaCompleta>
                </Colapse>

                <Colapse nome = "Campus">
                    <CampusOpcoes usuarioLogado={usuarioLogado} dados={data.campus}></CampusOpcoes>
                </Colapse>

               <Colapse nome = "Blocos">
                    <BlocosOpcoes dados={data}></BlocosOpcoes>
                </Colapse>
               <Colapse nome = "Pavimentos">
                    <PavimentosOpcoes dados={data}></PavimentosOpcoes>
                </Colapse>
               <Colapse nome = "Salas">
                    <SalaOpcoes></SalaOpcoes>
                    {/*<TabelaCompletaTeste dados={data.salas} lista={["id", "numero", "apelido", "pavimentoId", "area"]}></TabelaCompletaTeste>*/}
                </Colapse>
            </Box>
    )
}

export default ConfigurarEdificio;