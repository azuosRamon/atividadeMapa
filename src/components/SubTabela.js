import React, { useState, useEffect, useMemo} from "react";
import styled from "styled-components";
import GridArea from "./SubGridArea";
import Input from "./SubInput";
import Label from "./SubLabel";
import { Form } from "react-router-dom";

const TabelaContainer = styled.div`
    width: 100%;
    height: auto;
    max-height: 250px;
    overflow-x: auto;
    margin-bottom: 15px;
    `;
    const Tabela = styled.table`
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

    @media (max-width: 768px) {
        font-size: 12px
    };
    
`;
const Td =styled.td`
    text-align: center;
    color: #fff;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    @media (max-width: 768px) {
    padding: 0;
    };


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
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "nome nome idItem";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "tabela"
        "idItem"
        "nome";
}
`;



function TabelaCompleta({ dados, lista=[], camposPesquisa=true  }){
    const data = dados || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [idItem, setId] = useState("");
    const [nome, setNome] = useState("");

    const pesquisa2 = useMemo(() => {
        return data.filter(item => 
            (idItem ? item.id === idItem : Object.values(item).some(
                valor =>
                    valor &&
                    valor.toString().toLowerCase().includes(nome.toLowerCase())
            ) )
        );
    }, [nome, idItem]);
    
    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);
    useEffect(() => {
        setId("");
        setNome("");
        setPesquisa(dados); // ou [] se preferir limpar completamente
      }, [dados]);
    useEffect(() => {
        const itemSelecionado = data.find(item => item.id === Number(idItem));
        setNome(itemSelecionado ? itemSelecionado.nome : "");
    }, [idItem]);
    
    return (
        <FormGrid>
            <GridArea $area="tabela">
                <TabelaContainer>
                    <Tabela>
                        <thead>
                            <Tr>
                            {lista.map((campo) => (
                                    <Th key={campo}>{campo.toUpperCase()}</Th>
                                ))}
                            </Tr>
                        </thead>
                        <Tbody>
                        {/*console.log(Object.keys(pesquisa))*/}
                        {pesquisa.length > 0 ? (
                                pesquisa.map(item => (
                                    <Tr key={item.id}>
                                        {lista.map((campo) => (
                                            <Td key={campo}>{item[campo]}</Td>
                                        ))}
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan={lista.length}>Dados não encontrados!</Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Tabela>
                </TabelaContainer>
            </GridArea>
            { (camposPesquisa ? (
                <GridArea $area="idItem">
                    <Label htmlFor="idItem">ID:</Label>
                    <Input type="number" id="idItem" name="idItem" onChange={(e) => setId(e.target.value ? Number(e.target.value) : "")}/>
                </GridArea>
            ): null)}
            { (camposPesquisa ? (
                <GridArea $area="nome">
                    <Label htmlFor="nome">Pesquisa:</Label>
                    <Input type="text" id="nome" value={nome} name="nome"  onChange={(e) => setNome(e.target.value)}/>

                </GridArea>
            ): null)}
        </FormGrid>

    )
}

export default TabelaCompleta;