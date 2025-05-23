import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Select from "./SubSelect";
import Input from "./SubInput";
import Label from "./SubLabel";
import Button from "./SubButton";
import GridArea from "./SubGridArea";
import cores from "./Cores"


const FormGrid = styled.form`
gap: 10px;
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "operacao operacao idCampus"
    "nome nome nome"
    "cep cidade estado"
    "logradouro logradouro logradouro"
    "complemento complemento complemento"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
           "operacao"
           "idCampus"
            "nome"
            "cep"
            "cidade"
            "estado"
            "logradouro"
            "complemento"
            "reset"
            "botoes";
}
`;


function CampusOpcoes({ dados }) {
    const data = dados || {};
    const [operacao, setOperacao] = useState(1);
    const [idItem, setId] = useState("");
    const [nome, setNome] = useState("");
    const [cep, setCep] = useState();
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [complemento, setComplemento] = useState("");

    useEffect(() => {
        const itemSelecionado = data.find(item => item.id === Number(idItem));
        setNome(itemSelecionado ? itemSelecionado.nome : "");
        setCidade(itemSelecionado ? itemSelecionado.cidade : "");
        setEstado(itemSelecionado ? itemSelecionado.estado : "");
        setCep(itemSelecionado ? itemSelecionado.cep : "");
        setLogradouro(itemSelecionado ? itemSelecionado.logradouro : "");
        setComplemento(itemSelecionado ? itemSelecionado.complemento : "");
    }, [idItem]);


    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log("enviado!");
    }

    return(
            <div>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
                            <option value="0">Selecione a operação</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
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
                    <GridArea $area="reset" onClick={()=> setId("")}>
                        <Button $bgcolor={cores.backgroundBotaoSemFoco} type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </div>
    )
}

export default CampusOpcoes;