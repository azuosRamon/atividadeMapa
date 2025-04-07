import React, { useState } from "react";
import styled from "styled-components";
import Input from "./SubInput";
import Select from "./SubSelect";
import Label from "./SubLabel";
import Button from "./SubButton";
import GridArea from "./SubGridArea";


const FormGrid = styled.form`
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "campusId campusId campusId"
    "operacao operacao blocosId"
    "nome nome nome"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "campusId"
        "operacao"
        "nome"
        "reset . botoes";
}
`;


function BlocosOpcoes({ dados }) {
    const data = dados || {};
    const [operacao, setOperacao] = useState(1);
    const [nome, setNome] = useState("");
    const [idItem, setId] = useState("");
    const [blocos, setBlocos] = useState(false)



    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log("enviado!");
    }
    return(
        
                    <FormGrid onSubmit={fazerEnvio}>

                        <GridArea $area="operacao">
                            <Label htmlFor="operacao">Operacao:</Label>
                                <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
                                <option value="1">Adicionar Bloco</option>
                                <option value="2">Alterar Bloco</option>
                                <option value="3">Deletar Bloco</option>
                                </Select>
                        </GridArea>
                        <GridArea $area="campusId">
                            <Label htmlFor="campusId">Selecione o campus:</Label>
                                <Select autoFocus id="campusId" name="campusId" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
                                {
                                    dados.campus.map(campus => (
                                        <option value={campus.id}> {campus.nome + " - " + campus.cidade} </option>
                                    ))
                                }
                                </Select>
                        </GridArea>
                        <GridArea $area="blocosId">
                            <Label htmlFor="blocosId">ID do Bloco:</Label>
                            <Input type="number" id="blocosId" name="blocosId" alt="Apenas para alteração ou exclusão" disabled={!operacao || Number(operacao)<=1} onChange={(e) => setId(e.target.value ? Number(e.target.value) : "")}/>
                        </GridArea>
                        <GridArea $area="nome">
                            <Label htmlFor="nome">Nome ou Número do bloco:</Label>
                            <Input type="text" id="nome" value={nome} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setNome(e.target.value)} required/>
                        </GridArea>

                        <GridArea $area="reset" onClick={()=> setId("")}>
                            <Button $bgcolor="rgb(38, 38, 38)" type="reset">Limpar</Button>   
                        </GridArea>
                        <GridArea $area="botoes">
                            <Button type="submit">Salvar</Button>   
                        </GridArea>

                    </FormGrid>
    )
}

export default BlocosOpcoes;