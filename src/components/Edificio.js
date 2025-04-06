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


function ConfigurarDisciplinas({ tableDisciplinas }) {
    const data = tableDisciplinas || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState(1);
    const [idDisciplinas, setId] = useState("");
    const [nome, setNome] = useState("");
    const [qtdBlocos, setQtdBlocos] = useState(0);
    const [qtdAndares, setQtdAndares] = useState(0);
    const [qtdSalas, setQtdSalas] = useState(0);
    const [cep, setCep] = useState();
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [rua, setRua] = useState("");
    const [complemento, setComplemento] = useState("");
    const [campus, setCampus] = useState(true)
    const [blocos, setBlocos] = useState(false)
    const [andares, setAndares] = useState(false)

    const pesquisa2 = useMemo(() => {
        return disciplinas.disciplinas.filter(disciplina => 
            (idDisciplinas ? disciplina.id === idDisciplinas : disciplina.nome.toLowerCase().includes(nome.toLowerCase()))
        );
    }, [nome, idDisciplinas]);
    
    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);

    useEffect(() => {
        const disciplinaSelecionada = disciplinas.disciplinas.find(disciplina => disciplina.id === Number(idDisciplinas));
        setNome(disciplinaSelecionada ? disciplinaSelecionada.nome : "");
    }, [idDisciplinas]);


    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log("enviado!");
    }
    return(
            <Box>
                <DivColapse onClick={()=>setCampus(campus => !campus)}>
                    <Span $ativo={campus}><FaChevronRight /></Span>
                    <Title>Campus</Title>
                </DivColapse>
                <FormGrid $mostrar={campus} onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        <TabelaCompleta dados={pesquisa}></TabelaCompleta>
                        
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
                            <option value="1">Adicionar Campus</option>
                            <option value="2">Alterar Campus</option>
                            <option value="3">Deletar Campus</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="idCampus">
                        <Label htmlFor="idCampus">ID:</Label>
                        <Input type="number" id="idCampus" name="idCampus" disabled={!operacao || Number(operacao)<=1} onChange={(e) => setId(e.target.value ? Number(e.target.value) : "")}/>
                    </GridArea>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome do Campus:</Label>
                        <Input type="text" id="nome" value={nome} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setNome(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="cep">
                        <Label htmlFor="cep">Cep:</Label>
                        <Input type="number" id="cep" value={cep} name="cep" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setCep(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="cidade">
                        <Label htmlFor="cidade">Cidade:</Label>
                        <Input type="text" id="cidade" value={cidade} name="cidade" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setCidade(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="estado">
                        <Label htmlFor="estado">Estado:</Label>
                        <Input type="text" id="estado" value={estado} name="estado" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setEstado(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="rua">
                        <Label htmlFor="rua">Rua:</Label>
                        <Input type="text" id="rua" value={rua} name="rua" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setRua(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="complemento">
                        <Label htmlFor="complemento">Complemento:</Label>
                        <Input type="text" id="complemento" value={complemento} name="complemento" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setComplemento(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="qtdBlocos">
                        <Label htmlFor="qtdBlocos">Quandidade de blocos:</Label>
                        <Input type="number" id="qtdBlocos" value={qtdBlocos} name="qtdBlocos" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setQtdBlocos(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="reset" onClick={()=> setId("")}>
                        <Button $bgcolor="rgb(38, 38, 38)" type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
                <DivSeparador></DivSeparador>
                <DivColapse onClick={()=>setBlocos(blocos => !blocos)}>
                    <Span $ativo={blocos}><FaChevronRight /></Span>
                    <Title>Blocos</Title>
                </DivColapse>
                <FormGrid $mostrar={blocos} onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        
                        <DivSeparador></DivSeparador>
                    </GridArea>

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
                    ): (console.log(""))}
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