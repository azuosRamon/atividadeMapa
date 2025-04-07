import React, { useState, useEffect, useMemo} from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Select from "./SubSelect";
import Input from "./SubInput";
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
    "nome nome blocos"
    "cep cidade estado"
    "logradouro logradouro logradouro"
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
const Span = styled.span`
color: white;
display: inline-block;
transition: transform 0.3s ease;
transform: rotate(${props => (props.$ativo ? '90deg' : '0deg')});
margin: auto 15px;
font-size: 24px;
`;


function CampusOpcoes({ dados }) {
    const data = dados || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState(1);
    const [idItem, setId] = useState("");
    const [nome, setNome] = useState("");
    const [blocos, setQtdBlocos] = useState(0);
    const [cep, setCep] = useState();
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [complemento, setComplemento] = useState("");
    const [campus, setCampus] = useState(false)

    const pesquisa2 = useMemo(() => {
        return data.filter(item => 
            (idItem ? item.id === idItem : item.nome.toLowerCase().includes(nome.toLowerCase()))
        );
    }, [nome, idItem]);
    
    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);

    useEffect(() => {
        const itemSelecionado = data.find(item => item.id === Number(idItem));
        setNome(itemSelecionado ? itemSelecionado.nome : "");
        setCidade(itemSelecionado ? itemSelecionado.cidade : "");
        setEstado(itemSelecionado ? itemSelecionado.estado : "");
        setCep(itemSelecionado ? itemSelecionado.cep : "");
        setLogradouro(itemSelecionado ? itemSelecionado.logradouro : "");
        setComplemento(itemSelecionado ? itemSelecionado.complemento : "");
        setQtdBlocos(itemSelecionado ? itemSelecionado.blocos : 0);
    }, [idItem]);


    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log("enviado!");
    }

    return(
            <div>

                <DivColapse onClick={()=>setCampus(campus => !campus)}>
                    <Span $ativo={campus}><FaChevronRight /></Span>
                    <Title>Campus</Title>
                </DivColapse>
                <FormGrid $mostrar={campus} onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        
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
                    <GridArea $area="logradouro">
                        <Label htmlFor="logradouro">Rua:</Label>
                        <Input type="text" id="logradouro" value={logradouro} name="logradouro" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setLogradouro(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="complemento">
                        <Label htmlFor="complemento">Complemento:</Label>
                        <Input type="text" id="complemento" value={complemento} name="complemento" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setComplemento(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="blocos">
                        <Label htmlFor="blocos">Quandidade de blocos:</Label>
                        <Input type="number" id="blocos" value={blocos} name="blocos" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setQtdBlocos(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="reset" onClick={()=> setId("")}>
                        <Button $bgcolor="rgb(38, 38, 38)" type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </div>
    )
}

export default CampusOpcoes;