import React, { useState, useEffect, useMemo} from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Input from "./SubInput";
import Select from "./SubSelect";
import Label from "./SubLabel";
import Button from "./SubButton";
import Title from "./SubTitleH2";
import GridArea from "./SubGridArea";
import DivSeparador from "./SubDivSeparador";
import { FaChevronRight } from "react-icons/fa";
import TabelaCompleta from "./Tabela";
import CampusOpcoes from "./Campus";



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

const DivColapse = styled.div`
display: flex;
justify-content: flex-start;
align-items: center;
background-color: rgb(38, 38, 38);
border-radius: 5px;
padding: 10px;
margin-bottom: 20px;
margin-top: 20px;

`;

const DivColapseContent = styled.div`
height: ${(props) => (props.$mostrar ? 'auto' : '0')};
opacity: ${(props) => (props.$mostrar ? 1 : 0)};
transform: ${(props) => (props.$mostrar ? 'scale(1)' : 'scale(0.98)')};
pointer-events: ${(props) => (props.$mostrar ? 'auto' : 'none')};
transition: 
opacity 0.2s ease, 
height 0.2s ease, 
transform 0.5s ease;
`;
const Span = styled.span`
color: white;
display: inline-block;
transition: transform 0.3s ease;
transform: rotate(${props => (props.$ativo ? '90deg' : '0deg')});
margin: auto 15px;
font-size: 24px;
`;

const disciplinas = {
    "disciplinas":[
        { "id": 1, "nome": "Empreendedorismo e inovação"},
        { "id": 2, "nome": "Banco de Dados Relacionais"},
        { "id": 3, "nome": "Estrutura de Dados Avançados"},
        { "id": 4, "nome": "Gestão Ambiental e Desenvolvimento Sustentável"},
        { "id": 5, "nome": "Infraestrutura de TI"},
        { "id": 6, "nome": "Interface Humano-Computador"},
        { "id": 7, "nome": "Práticas Extensionistas Integradoras IV"},
        { "id": 8, "nome": "Processo de Desenvolvimento de Software"},
    ] 
}

const dados_json = {
    "campus":[
        { "id": 1, "blocos": 1, "nome": "Campus I", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "rodoviaria" },
        { "id": 2, "blocos": 4,"nome": "Campus II", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "quadra" },
        { "id": 3, "blocos": 1,"nome": "Campus III", "cidade": "Vassouras", "estado" : "RJ", "cep": "27700000", "logradouro": "Av. Expedicionário Oswaldo de Almeida Ramos", "complemento": "280" }
    ] 
}

function ConfigurarDisciplinas({ tableDisciplinas }) {
    const data = tableDisciplinas || {};
    const [operacao, setOperacao] = useState(1);
    const [consulta, setConsulta] = useState(false);
    const [nome, setNome] = useState("");
    const [idItem, setId] = useState("");
    const [qtdBlocos, setQtdBlocos] = useState(0);
    const [qtdAndares, setQtdAndares] = useState(0);
    const [qtdSalas, setQtdSalas] = useState(0);
    const [campus, setCampus] = useState(false)
    const [blocos, setBlocos] = useState(false)
    const [andares, setAndares] = useState(false)



    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log("enviado!");
    }
    return(
            <Box>
                <DivColapse onClick={()=>{setConsulta(consulta => !consulta)}}>
                    <Span $ativo={consulta}><FaChevronRight /></Span>
                    <Title>Consultar dados</Title>
                </DivColapse>
                <DivColapseContent $mostrar={consulta}>
                <Label htmlFor="operacao">Selecione a tabela a visualizar:</Label>
                    <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value)}}>
                    <option value={dados_json.campus}>Campus</option>
                    <option value="2">Blocos</option>
                    <option value="3">Andares</option>
                    </Select>
                <TabelaCompleta dados={dados_json.campus} lista={["id", "nome", "cidade", "logradouro"]}></TabelaCompleta>
                </DivColapseContent>

                <CampusOpcoes dados={dados_json.campus}></CampusOpcoes>

                <DivColapse onClick={()=>{setBlocos(blocos => !blocos); setCampus(false)}}>
                    <Span $ativo={blocos}><FaChevronRight /></Span>
                    <Title>Blocos</Title>
                </DivColapse>
                <FormGrid $mostrar={blocos} onSubmit={fazerEnvio}>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
                            <option value="1">Adicionar Bloco</option>
                            <option value="2">Alterar Bloco</option>
                            <option value="3">Deletar Bloco</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="idCampus">
                        <Label htmlFor="idCampus">ID:</Label>
                        <Input type="number" id="idCampus" name="idCampus" disabled={!operacao || Number(operacao)<=1} onChange={(e) => setId(e.target.value ? Number(e.target.value) : "")}/>
                    </GridArea>
                    {qtdBlocos > 0 ? (
                        Array.from({length:qtdBlocos}, (_,x)=>(
                            <React.Fragment key={x}>
                                <GridArea $area="nome">
                                    <Label htmlFor="nome">Nome ou Número do bloco:</Label>
                                    <Input type="text" id="nome" value={nome} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setNome(e.target.value)} required/>
                                </GridArea>
                                <GridArea $area="qtdBlocos">
                                    <Label htmlFor="qtdBlocos">Quandidade de andares:</Label>
                                    <Input type="number" id="qtdBlocos" value={qtdBlocos} name="qtdBlocos" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setNome(e.target.value)} required/>
                                </GridArea>
                            </React.Fragment>
                        ))                                            
                    ): ""}
                    <GridArea $area="reset" onClick={()=> setId("")}>
                        <Button $bgcolor="rgb(38, 38, 38)" type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default ConfigurarDisciplinas;