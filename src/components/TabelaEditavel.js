import React, {useState} from "react";
import styled from "styled-components";
import GridArea from "./SubGridArea";
import Input from "./SubInput";
import Button from "./SubButton";

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
    border-radius: 5px;
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

const ButtonTrocarPagina = styled.button`
padding: 10px;
background-color:${(props) => props.$bgcolor || 'rgb(96, 96, 96)'};
color: white;
border: none;
border-radius: 5px;
font-size: 16px;
cursor: pointer;

&:hover{
transition: .7s;
background-color:${(props) => props.$hovercolor || '#0056b3'};
}

@media (min-width: 481px) and (max-width: 968px) {
    height: fit-content;
}
`;


const dados_json = {
    "campus":[
        { "id": 1, "blocos": 1, "nome": "Campus I", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "rodoviaria" },
        { "id": 2, "blocos": 4,"nome": "Campus II", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "quadra" },
        { "id": 3, "blocos": 1,"nome": "Campus III", "cidade": "Vassouras", "estado" : "RJ", "cep": "27700000", "logradouro": "Av. Expedicionário Oswaldo de Almeida Ramos", "complemento": "280" }
    ],
    "blocos":[
        { "id": 1, "nome": "A", "imagem": "caminho/a.png", "campusId" : 1},
        { "id": 2, "nome": "A", "imagem": "caminho/a.png", "campusId" : 2},
        { "id": 3, "nome": "B", "imagem": "caminho/a.png", "campusId" : 2},
        { "id": 4, "nome": "C", "imagem": "caminho/a.png", "campusId" : 2}
    ],
    "pavimentos":[
        { "id": 1, "numero": "1", "imagem": "caminho/a.png", "blocoId" : 1},
        { "id": 2, "numero": "2", "imagem": "caminho/b.png", "blocoId" : 1},
        { "id": 3, "numero": "3", "imagem": "caminho/c.png", "blocoId" : 1},
        { "id": 4, "numero": "4", "imagem": "caminho/d.png", "blocoId" : 1}

    ]
}

function TabelaCompletaTeste({dados, lista, itensMax = 5}){
    const [editarIndice, setEditarIndice] = useState(null);
    const [dadosTemporarios, setdadosTemporarios] = useState([...dados]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = itensMax;

    const observarModificacao = (e, linhaIndice, campo) =>{
        const atualizacao = [...dadosTemporarios];
        atualizacao[linhaIndice][campo] = e.target.value;
        setdadosTemporarios(atualizacao);
    };

    const salvarEdicao = (indice) => {
        setEditarIndice(null);
        console.log("salvo", dadosTemporarios[indice]);
    };

    const cancelarEdicao = () => {
        setdadosTemporarios([...dados]);
        setEditarIndice(null);
    };

    const adicionarLinha = () =>{
        const novaLinha = {};
        lista.forEach((coluna) => (novaLinha[coluna] = ""));
        const idsExistentes = dadosTemporarios.map((item) => parseInt(item.id, 10) || 0)
        novaLinha.id = Math.max(...idsExistentes, 0) + 1;
        setdadosTemporarios([...dadosTemporarios, novaLinha]);
    };

    const removerLinha = (indice) =>{
        const atualizada = [...dadosTemporarios];
        atualizada.splice(indice, 1);
        setdadosTemporarios(atualizada);
    };


    return (
        <div>
            

        <Tabela>
      <thead>
        <Tr>
          {lista.map((col) => (
            <Th key={col}>{col.toUpperCase()}</Th>
          ))}
          <Th>AÇÕES</Th>
        </Tr>
      </thead>
      <Tbody>
        {//dadosTemporarios.map((linha, indice) => (
        dadosTemporarios.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
            .map((linha, indice) => {
                const indiceReal = (paginaAtual - 1) * itensPorPagina + indice;
                return (
                <Tr key={indiceReal}>
            {lista.map((col) => (
                
              <Td key={col}>
                {editarIndice === indice ? ( col !== "id" ?(
                    <Input
                      value={linha[col]}
                      onChange={(e) => observarModificacao(e, indice, col)}
                      type={col === "imagem" ? "file" : col === "numero" ? "number" : "text"}
                    />
                  ) : (
                    linha[col]
                  )
                ): (
                    linha[col]
                  )
            }
              </Td>
            ))}
            <Td>
              {editarIndice === indice ? (
                <>
                  <Button $bgcolor="#52ece6" $hovercolor="#fff" onClick={() => salvarEdicao(indice)}>💾</Button>
                  <Button $bgcolor="rgb(38,38,38)" $hovercolor="#fff" onClick={cancelarEdicao}>❌</Button>
                </>
              ) : (<>
              
              <Button $bgcolor="rgb(38,38,38)" onClick={() => setEditarIndice(indice)}>✏️</Button>
              <Button $bgcolor="darkred" onClick={() => {
                removerLinha(indice);
                setPaginaAtual(Math.ceil((dadosTemporarios.length - 1) / itensPorPagina));
              }}>🗑️</Button>
              </>
              )}
            </Td>
          </Tr>
        )})}
      </Tbody>
    </Tabela>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '15px 0' }}>

        {Array.from({ length: Math.ceil(dadosTemporarios.length / itensPorPagina) }, (_, i) => (
            <ButtonTrocarPagina
            key={i + 1}
            onClick={() => setPaginaAtual(i + 1)}
            $bgcolor={paginaAtual === i + 1 ? "#52ece6":""}
            >
            {i + 1}
            </ButtonTrocarPagina>
        ))}

    </div>
    <Button onClick={()=>{
        adicionarLinha();
        setPaginaAtual(Math.ceil((dadosTemporarios.length + 1) / itensPorPagina))
        setEditarIndice(dadosTemporarios.length);
    }}>➕ Adicionar item</Button>
        </div>
    )

}

export default TabelaCompletaTeste;