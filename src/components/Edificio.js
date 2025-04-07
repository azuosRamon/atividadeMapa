import React, { useState, useEffect, useMemo} from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Select from "./SubSelect";
import Label from "./SubLabel";
import TabelaCompleta from "./Tabela";
import CampusOpcoes from "./Campus";
import BlocosOpcoes from "./Blocos";
import Colapse from "./SubColapse";


const FormGrid = styled.form`
height: ${(props) => (props.$mostrar ? 'auto' : '0')};
opacity: ${(props) => (props.$mostrar ? 1 : 0)};
transform: ${(props) => (props.$mostrar ? 'scale(1)' : 'scale(0.98)')};
pointer-events: ${(props) => (props.$mostrar ? 'auto' : 'none')};
transition: 
opacity 0.2s ease, 
height 0.2s ease, 
transform 0.5s ease;
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "operacao operacao idCampus"
    "nome nome qtdBlocos"
    "cep cidade estado"
    "rua rua rua"
    "complemento complemento complemento"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "tabela"
        "operacao"
        "idCampus"
        "nome"
        "reset"
        "botoes";
}
`;


const dados_json = {
    "campus":[
        { "id": 1, "blocos": 1, "nome": "Campus I", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "rodoviaria" },
        { "id": 2, "blocos": 4,"nome": "Campus II", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "quadra" },
        { "id": 3, "blocos": 1,"nome": "Campus III", "cidade": "Vassouras", "estado" : "RJ", "cep": "27700000", "logradouro": "Av. Expedicionário Oswaldo de Almeida Ramos", "complemento": "280" }
    ],
    "blocos":[
        { "id": 1, "nome": "A", "pavimentos": 4, "imagem": "caminho/a.png", "campusId" : 1}
    ],
    "pavimentos":[
        { "id": 1, "numero": "1", "salas": 20, "imagem": "caminho/a.png", "blocoId" : 1}

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
                <Colapse nome = "Consultar dados">
                    <Label htmlFor="operacao">Selecione a tabela a visualizar:</Label>
                        <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(Number(e.target.value))}}>
                        <option value="0">Campus</option>
                        <option value="1">Blocos</option>
                        <option value="2">Pavimentos</option>
                        </Select>
                    <TabelaCompleta dados={selecionarDados[operacao][0]} lista={selecionarDados[operacao][1]}></TabelaCompleta>
                </Colapse>

                <Colapse nome = "Campus">
                    <CampusOpcoes dados={dados_json.campus}></CampusOpcoes>
                </Colapse>

               <Colapse nome = "Blocos">
                    <BlocosOpcoes dados={dados_json}></BlocosOpcoes>
                </Colapse>
            </Box>
    )
}

export default ConfigurarEdificio;