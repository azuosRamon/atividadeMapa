import React, { useState } from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Select from "./SubSelect";
import Label from "./SubLabel";
import TabelaCompleta from "./SubTabela";
import CampusOpcoes from "./MenuEdificioCampus";
import BlocosOpcoes from "./MenuEdificioBlocos";
import PavimentosOpcoes from "./MenuEdificioPavimentos";
import Colapse from "./SubColapse";
import TabelaCompletaTeste from "./SubTabelaEditavel";


function ConfigurarEdificio({ dados }) {
    const data = dados || {};
    const [operacao, setOperacao] = useState(0);
    const selecionarDados = [
        [data.campus,["id", "nome", "cidade", "logradouro"]],
        [data.blocos,["id", "nome", "campusId"]],
        [data.pavimentos,["id", "numero", "blocoId"]]
    ]
    return(
            <Box>
                <Colapse nome = "Consultar dados" estadoInicial={false}>
                    <Label htmlFor="operacao">Selecione a tabela a visualizar:</Label>
                        <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(Number(e.target.value))}}>
                            {selecionarDados.map((_, idx) => (
                                <option key={idx} value={idx}>
                                    {["Campus", "Blocos", "Pavimentos"][idx]}
                                </option>
                                ))}
                        </Select>
                    <TabelaCompleta key={operacao} dados={selecionarDados[operacao][0]} lista={selecionarDados[operacao][1]}></TabelaCompleta>
                </Colapse>

                <Colapse nome = "Campus">
                    <CampusOpcoes dados={data.campus}></CampusOpcoes>
                </Colapse>

               <Colapse nome = "Blocos">
                    <BlocosOpcoes dados={data}></BlocosOpcoes>
                </Colapse>
               <Colapse nome = "Pavimentos">
                    <PavimentosOpcoes dados={data}></PavimentosOpcoes>
                </Colapse>
               <Colapse nome = "Salas">
                    <TabelaCompletaTeste dados={data.salas} lista={["id", "numero", "apelido", "pavimentoId", "area"]}></TabelaCompletaTeste>
                </Colapse>
            </Box>
    )
}

export default ConfigurarEdificio;