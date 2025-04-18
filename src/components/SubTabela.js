import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import GridArea from "./SubGridArea";
import Input from "./SubInput";
import Label from "./SubLabel";
import Button from "./SubButton";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import cores from "./Cores";

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

const Th = styled.th`
    background-color: ${cores.cor3};
    color: #fff;
    font-weight: bold;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;

    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const Td = styled.td`
    text-align: center;
    color: #fff;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    @media (max-width: 768px) {
        padding: 0;
    }
`;

const Tr = styled.tr`
    &:nth-child(2n) {
        background-color: rgba(255, 255, 255, 0.2);
    }
    &:hover {
        background-color: rgba(195, 195, 195, 0.2);
    }
`;

const Tbody = styled.tbody`
    background-color: rgba(255, 255, 255, 0.3);
`;

const FormGrid = styled.form`
    display: grid;
    box-sizing: border-box;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 
        "tabela tabela tabela"
        "botoes botoes botoes"
        "nome nome idItem";

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-areas: 
            "tabela"
            "idItem"
            "botoes"
            "nome";
    }
`;

const CampoContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0;
`;

const BotoesContainer = styled.div`
    grid-area: botoes;
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
`;

const JustifiedButton = styled(Button)`
    width: 100%;
    background-color: ${cores.backgroundBotaoSemFoco};
    margin-bottom: 15px;
`;

function TabelaCompleta({ dados, lista = [] }) {
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
            ))
        );
    }, [nome, idItem]);

    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);

    useEffect(() => {
        setId("");
        setNome("");
        setPesquisa(dados);
    }, [dados]);

    useEffect(() => {
        const itemSelecionado = data.find(item => item.id === Number(idItem));
        setNome(itemSelecionado ? itemSelecionado.nome : "");
    }, [idItem]);

    const gerarPDF = () => {
        const doc = new jsPDF();
        const headers = [lista.map(campo => campo.toUpperCase())];
        const rows = pesquisa.map(item => lista.map(campo => item[campo]));

        autoTable(doc, {
            head: headers,
            body: rows,
            styles: { fontSize: 10 },
            margin: { top: 10 },
        });

        doc.save("tabela.pdf");
    };

    const gerarExcel = () => {
        const ws = XLSX.utils.table_to_sheet(document.getElementById("tabela"));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Tabela");
        XLSX.writeFile(wb, "tabela.xlsx");
    };

    const imprimirTabela = () => {
        window.print();
    };

    return (
        <FormGrid>
            <GridArea $area="tabela">
                <TabelaContainer>
                    <Tabela id="tabela">
                        <thead>
                            <Tr>
                                {lista.map((campo) => (
                                    <Th key={campo}>{campo.toUpperCase()}</Th>
                                ))}
                            </Tr>
                        </thead>
                        <Tbody>
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

            <GridArea $area="idItem">
                <CampoContainer>
                    <Label htmlFor="idItem">ID:</Label>
                    <Input
                        type="number"
                        id="idItem"
                        name="idItem"
                        onChange={(e) => setId(e.target.value ? Number(e.target.value) : "")}
                    />
                </CampoContainer>
            </GridArea>

            <GridArea $area="nome">
                <CampoContainer>
                    <Label htmlFor="nome">Pesquisa:</Label>
                    <Input
                        type="text"
                        id="nome"
                        value={nome}
                        name="nome"
                        onChange={(e) => setNome(e.target.value)}
                    />
                </CampoContainer>
            </GridArea>

            <GridArea $area="botoes">
                <BotoesContainer>
                    <JustifiedButton type="button" onClick={gerarPDF}>
                        Exportar para PDF
                    </JustifiedButton>
                    <JustifiedButton type="button" onClick={gerarExcel}>
                        Exportar para Excel
                    </JustifiedButton>
                </BotoesContainer>
            </GridArea>
        </FormGrid>
    );
}

export default TabelaCompleta;