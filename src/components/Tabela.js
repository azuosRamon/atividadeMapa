import React from "react";
import styled from "styled-components";


const TabelaContainer = styled.div`
    width: 100%;
    height: auto;
    max-height: 200px;
    overflow-x: auto;
    margin-bottom: 25px;
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



const TabelaCompleta = ({ dados }) => {
    return (
        <TabelaContainer>
            <Tabela>
                <thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>NOME</Th>
                    </Tr>
                </thead>
                <Tbody>
                {dados.length > 0 ? (
                        dados.map(item => (
                            <Tr key={item.id}>
                                <Td>{item.id}</Td>
                                <Td>{item.nome}</Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan="2">Dados não encontrados!</Td>
                        </Tr>
                    )}
                </Tbody>
            </Tabela>
        </TabelaContainer>
    )
}

export default TabelaCompleta;