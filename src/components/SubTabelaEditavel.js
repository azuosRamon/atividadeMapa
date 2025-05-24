import React, {useState} from "react";
import styled from "styled-components";
import GridArea from "./SubGridArea";
import Input from "./SubInput";
import Button from "./SubButton";
import cores from "./Cores";
const TabelaContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    margin-bottom: 15px;
    max-width: 80vw;

  @media (max-width: 768px) {
    -webkit-overflow-scrolling: touch;
  }
`;

const Tabela = styled.table`
  width: max-content;
  border-collapse: collapse;
  text-align: left;
  border-radius: 5px;
width: 100%;
`;

const Th =styled.th`
    background-color: ${cores.cor3};
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
    color: ${cores.corTexto};
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
    background-color: rgba(195, 195, 195, 0.2);
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
color: ${cores.corTexto};
border: none;
border-radius: 5px;
font-size: 16px;
cursor: pointer;

&:hover{
transition: .7s;
background-color:${(props) => props.$hovercolor || cores.cor2};
}

@media (min-width: 481px) and (max-width: 968px) {
    height: fit-content;
}
`;
const Wrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
  padding: 0 10px;
`;


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

    const abrirImagem = () => {
        setMostrarMapa(true)
    }

    const fecharImagem = () => {
        setMostrarMapa(false)
    }

        const MapaBG = styled.div`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${cores.backgroundMapa};
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const FecharBotao = styled.button`
        position: absolute;
        top: 20px;
        right: 20px;
        background: ${cores.backgroundBox};
        color: ${cores.corTexto};
        border: none;
        padding: 10px;
        cursor: pointer;
        font-size: 20px;
        border-radius: 50%;
    `;
    const [mostrarMapa, setMostrarMapa] = useState(false)
    return (
        <Wrapper>
            {/*mostrarMapa && (
                <MapaBG>
                    <FecharBotao onClick={fecharImagem}>X</FecharBotao>
                    <Slide
                        lista_imagens={imagens}
                        pagina_inicio={andar-1}
                    />
                </MapaBG>
            )*/}
        <TabelaContainer>

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
                        /*col === "imagem" ? (
                            <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                observarModificacao({ target: { value: file.name } }, indice, col);
                                }
                            }}
                            />*/
                            col === "areas" ? (
                            <Button onClick={()=> {}}>selecionar</Button>
                        ) : (
                            <Input
                            type="text"
                            value={linha[col]}
                            onChange={(e) => observarModificacao(e, indice, col)}
                            />
                        )
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
                    
                    const totalItens = dadosTemporarios.length - 1;
                    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

                    if ((paginaAtual > totalPaginas) && totalPaginas > 0){
                        setPaginaAtual(totalPaginas);
                    }
                    
                    
                }}>🗑️</Button>
                </>
                )}
                </Td>
            </Tr>
            )})}
        </Tbody>
        </Tabela>
        </TabelaContainer>
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
        </Wrapper>
    )

}

export default TabelaCompletaTeste;