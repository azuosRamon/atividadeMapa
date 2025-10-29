import { useState} from "react";
import styled from "styled-components";
import useBancoDeDados from "../BdSupabase";
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas"
import Title from "../SubTitleH2";
import Box from "../SubBox";
import Button from "../SubButton";
import cores from "../Cores.js"
import Modal from "../SubModal.jsx";


const FormGrid = styled.form`
gap: 10px;
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "operacao operacao idCampus"
    "nome nome nome"
    "cep cidade estado"
    "logradouro logradouro latitude"
    "complemento complemento longitude"
    "reset . botoes";

@media (max-width: 768px) {
    display: flex;
    flex-direction: column;
}
`;

const TitleSublinhado = styled(Title)`
    border-bottom: 2px solid;
    margin-bottom: 20px;
`

function CampusOpcoes({ usuarioLogado, operacaoEnviada, item = null }) {
    const tabela = mapa.imoveis;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            !item ?
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id"?usuarioLogado.empresa_id:v.valor]))
            :
            Object.entries(item)

        )
    );
    const [operacao, setOperacao] = useState(operacaoEnviada || "1");

      const {
        data,
        pesquisa,
        loading,
        fazerEnvio,
        alterarObjeto
      } = useBancoDeDados({
        nomeTabela: tabela.tabela.nome,
        objeto,
        setObjeto,
        operacao,
        campoId: tabela.tabela.lista[0],
        campoNome: tabela.tabela.lista[1],
      });

   
    return(
            <div>
                <TitleSublinhado>IMÓVEL</TitleSublinhado>
                <FormGrid onSubmit={fazerEnvio}>
                    <CriarCamposFormulario 
                    item={tabela}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto ={objeto}
                    ></CriarCamposFormulario>
                </FormGrid>
            </div>
    )
}

function CardImovel({onClick, dadosImovel=null, dadosUsuario, selecao = null, indice}) {
    const [operacao, setOperacao] = useState("1")
    const [itemModificar, setItemModificar] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false);
    

    const data = selecao || dadosImovel;

    return (
        <>
        {!selecao && indice === 0 &&
        <>
            <AdicionarBtn onClick={(e)=>{
                e.preventDefault();
                setOperacao("1");
                setMostrarModal(true)}
            } >Cadastrar Novo Imóvel</AdicionarBtn>
                    
            <TitleSublinhado>Selecione um imóvel</TitleSublinhado>
            </>
                    }
        <BoxImoveis $dadosImovel={dadosImovel ? true : false}>
        <Modal aberto={mostrarModal} onFechar={() => setMostrarModal(false)}>
            <CampusOpcoes tabindex="0"
                usuarioLogado={dadosUsuario} 
                operacaoEnviada={operacao} 
                item={itemModificar}>
            </CampusOpcoes>

        </Modal>
        <TituloVertical>{dadosImovel ? (` #${indice+1}`): "Imovel"}</TituloVertical>
        {data &&
            <BoxImovel onClick={onClick}>
            <DivInformacao>
                <LinhaInformacao>
                    <Valor>{data.nome}</Valor>
                    <Valor>{data.cidade}/{data.estado}</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Valor>{data.logradouro}</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Valor>{data.complemento}</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Chave>Blocos:</Chave>
                    <Valor>{data?.blocos?.length || 0}</Valor>
                    <Chave>Pavimentos:</Chave>
                    <Valor>{data?.blocos?.reduce((acc, bloco) => acc + (bloco.pavimentos?.length || 0), 0) || 0}</Valor>
                    <Chave>Salas:</Chave>
                    <Valor>{data?.blocos?.reduce((acc, bloco) => acc + (bloco.pavimentos?.reduce((acc, pavimento) => acc + (pavimento.comodos.length || 0), 0) || 0),0) || 0}</Valor>
                </LinhaInformacao>
            </DivInformacao>
            {selecao && 
            <VerticalBtn onClick={(e)=>{
                e.preventDefault();
                setItemModificar(selecao);
                setOperacao("2");
                setMostrarModal(true);
            }} $bgcolor={cores.backgroundBotaoSemFoco}>Atualizar</VerticalBtn>}
        {selecao &&
            <VerticalBtn
            onClick={(e)=>{
                e.preventDefault();
                setItemModificar(selecao);
                setOperacao("3");
                setMostrarModal(true);
            }} 
            $bgcolor={cores.corDeletar}>Excluir</VerticalBtn>
        }
            </BoxImovel>
}
            </BoxImoveis>
        
            </>
    )
}

export default CardImovel;

// ESTILOS

const BoxContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  align-items: flex-start;
  gap: 10px;
`;


const Chave = styled.p`
    font-size: 1rem;
    color: gray;
    font-weight: bold;  
    margin: 0;
    `;
const Valor = styled.p`
    font-size: 1rem;
    color: gray;
    margin: 0;
    `;
const DivInformacao = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 20px;
    width: 80%;
    `;
const LinhaInformacao = styled.div`
    display: flex;
    flex-direction: row;
    margin: 5px 0;
    gap: 10px;
    justify-content: space-between;
    `;


const AdicionarBtn = styled(Button)`
    min-height: 50px;
    height: 100%;
    width: 100%;
    margin: 10px auto;
    background-color: ${cores.cor3Transparente};
    `;

const TituloVertical = styled.h3`
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    color: ${cores.corTextoClaro};
    background-color: ${cores.cor3};
    padding: 10px;
    margin: 0;
    `;

const VerticalBtn = styled(Button)`
    height: 90%;
    width: 10%;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    margin: auto 5px;
    `;
const BoxImoveis = styled.div`
    display: flex;
    border: 1px solid ${cores.boxShadow};
    max-height: 9em;
    grid-column: span 9;
    cursor: ${(props) => (props.$dadosImovel ? "pointer" : "default")};
    margin-bottom: 20px;
`;
const BoxImovel = styled.div`
    display: flex;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 0 5px;
    `;
