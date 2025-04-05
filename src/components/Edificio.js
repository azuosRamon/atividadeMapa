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


const TabelaContainer = styled.div`
    width: 100%;
    height: 200px;
    overflow-x: auto;
    margin-bottom: 25px;
`;
const TabelaHorarios = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: left;
`;

const Th =styled.th`
    background-color: #0066cc;
    color: #fff;
    font-weight: bold;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
    
`;
const Td =styled.td`
    text-align: center;
    color: #fff;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);


`;
const Tr =styled.tr`
&:nth-child(2n){
    background-color: rgba(255, 255, 255, 0.2);
}
&:hover{
    background-color: rgba(0, 102, 204, 0.2);
}
`;
const Tbody =styled.tbody`
    background-color: rgba(255, 255, 255, 0.3);
`;



const FormGrid = styled.form`
display: grid;
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
                <Title>Campus</Title>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        <TabelaContainer>
                            <TabelaHorarios>
                                <thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>NOME</Th>
                                    </Tr>
                                </thead>
                                <Tbody>
                                {pesquisa.length > 0 ? (
                                        pesquisa.map(disciplina => (
                                            <Tr key={disciplina.id}>
                                                <Td>{disciplina.id}</Td>
                                                <Td>{disciplina.nome}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan="2">Nenhuma disciplina encontrada</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </TabelaHorarios>
                        </TabelaContainer>
                        
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
                        <Input type="numero" id="cep" value={cep} name="cep" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setCep(e.target.value)} required/>
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
                        <Input type="numero" id="qtdBlocos" value={qtdBlocos} name="qtdBlocos" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setQtdBlocos(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="reset" onClick={()=> setId("")}>
                        <Button $bgcolor="rgb(38, 38, 38)" type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
                <DivSeparador></DivSeparador>
                <Title>Blocos</Title>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        <TabelaContainer>
                            <TabelaHorarios>
                                <thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>NOME</Th>
                                    </Tr>
                                </thead>
                                <Tbody>
                                {pesquisa.length > 0 ? (
                                        pesquisa.map(disciplina => (
                                            <Tr key={disciplina.id}>
                                                <Td>{disciplina.id}</Td>
                                                <Td>{disciplina.nome}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan="2">Nenhuma disciplina encontrada</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </TabelaHorarios>
                        </TabelaContainer>
                        
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
                                    <Input type="numero" id="qtdBlocos" value={qtdBlocos} name="qtdBlocos" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setNome(e.target.value)} required/>
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