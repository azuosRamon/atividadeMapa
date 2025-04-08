import React, { useState } from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Select from "./SubSelect";
import Label from "./SubLabel";
import TabelaCompleta from "./Tabela";
import CampusOpcoes from "./EdificioCampus";
import BlocosOpcoes from "./EdificioBlocos";
import PavimentosOpcoes from "./EdificioPavimentos";
import Colapse from "./SubColapse";



const dados_json = {
    "campus":[
        { "id": 1, "blocos": 1, "nome": "Campus I", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "rodoviaria" },
        { "id": 2, "blocos": 4,"nome": "Campus II", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "quadra" },
        { "id": 3, "blocos": 1,"nome": "Campus III", "cidade": "Vassouras", "estado" : "RJ", "cep": "27700000", "logradouro": "Av. Expedicionário Oswaldo de Almeida Ramos", "complemento": "280" }
    ],
    "blocos":[
        { "id": 1, "nome": "A", "pavimentos": 4, "imagem": "caminho/a.png", "campusId" : 1},
        { "id": 2, "nome": "A", "pavimentos": 2, "imagem": "caminho/a.png", "campusId" : 2},
        { "id": 3, "nome": "B", "pavimentos": 4, "imagem": "caminho/a.png", "campusId" : 2},
        { "id": 4, "nome": "C", "pavimentos": 2, "imagem": "caminho/a.png", "campusId" : 2}
    ],
    "pavimentos":[
        { "id": 1, "numero": "1", "salas": 20, "imagem": "caminho/a.png", "blocoId" : 1},
        { "id": 2, "numero": "2", "salas": 17, "imagem": "caminho/a.png", "blocoId" : 1},
        { "id": 3, "numero": "3", "salas": 23, "imagem": "caminho/a.png", "blocoId" : 1},
        { "id": 4, "numero": "4", "salas": 5, "imagem": "caminho/a.png", "blocoId" : 1}

    ]
}

function ConfigurarEdificio({ dados }) {
    const data = dados || {};
    const [operacao, setOperacao] = useState(0);
    const selecionarDados = [
        [dados_json.campus,["id", "nome", "cidade", "logradouro"]],
        [dados_json.blocos,["id", "nome", "campusId", "pavimentos"]],
        [dados_json.pavimentos,["id", "numero", "blocoId", "salas"]]
    ]
    return(
            <Box>
                <Colapse nome = "Consultar dados" estadoInicial={true}>
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
                    <CampusOpcoes dados={dados_json.campus}></CampusOpcoes>
                </Colapse>

               <Colapse nome = "Blocos">
                    <BlocosOpcoes dados={dados_json}></BlocosOpcoes>
                </Colapse>
               <Colapse nome = "Pavimentos">
                    <PavimentosOpcoes dados={dados_json}></PavimentosOpcoes>
                </Colapse>
            </Box>
    )
}

export default ConfigurarEdificio;