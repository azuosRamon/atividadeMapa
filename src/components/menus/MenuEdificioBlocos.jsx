import { useState, useEffect} from "react";
import styled from "styled-components";
import useBancoDeDados from "../BdSupabase";
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas"
import Title from "../SubTitleH2";
import cores from "../Cores.js"

import Button from "../SubButton";
import BussolaCarregando from "../BussolaLoading.jsx";
import Modal from "../SubModal.jsx";

import { supabase } from "/supabaseClient";



async function LerNovosDados(empresaId, imovelId) {
    //informar uma lista composta de ['coluna', valorProcurado] para utilizar a condicao
    let query = supabase
    .from('blocos')
    .select(`
                *,
                pavimentos(
                    *,
                    comodos(*)
                    )
        `)
    .eq("empresa_id", empresaId)
    .eq('imovel_id', imovelId)
    .order('nome')
    ;

    try {
    const { data, error } = await query;
    
    if (error) {
      console.error("Erro ao ler dados na tabela:", error);
      return [];
    }
    
    return data || [];
} catch (err) {
    console.error("Erro inesperado ao ler dados de ", err);
    return [];
}
}

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

function BlocosOpcoes({ usuarioLogado, operacaoEnviada, item = null,imovelId=null, onAtualizar }) {
    const tabela = mapa.blocos;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            !item ?
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id" ? usuarioLogado.empresa_id: k == "imovel_id" ? imovelId : v.valor]))
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

      const atualizarDados = async (e)=>{
        e.preventDefault();
        try {
            await fazerEnvio(e);
            if (onAtualizar) await onAtualizar(); // 🔹 atualiza lista e fecha modal
        }
        catch(error){
            console.error("erro ao cadastrar bloco", err.message);
        }
      }

   
    return(
            <div>
                <TitleSublinhado>BLOCOS</TitleSublinhado>
                <FormGrid onSubmit={atualizarDados}>
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

/** 
 * Cria um card visual para efeturar crud no bloco
 * @param dadosBlocos recebe os dados do imovel selecionado;
 *  @param dadosUsuario recebe os dados do usuario para obtenção da empresa_id;
 * @param selecao utilizado para guardar o objeto selecionado
 * @param setSelecao deve receber o setBlocoSelecionado
 */
function CardBloco({dadosBlocos, dadosUsuario, selecao, setSelecao}) {
    const [operacao, setOperacao] = useState("1")
    const [itemModificar, setItemModificar] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false);
    const [blocos, setBlocos] = useState(dadosBlocos?.blocos || []);

    const imovelId = dadosBlocos?.imovel_id;

    const atualizarLista = async () => {
        const novosDados = await LerNovosDados(dadosUsuario.empresa_id, imovelId);
        if (novosDados.length > 0) {
        setBlocos(novosDados || []);
        }
      };

    useEffect(() => {
    if (!itemModificar && blocos.length > 0) {
        setItemModificar(blocos[0]);
    }
    }, [blocos]);


    return (
        <BoxBlocos>
        <Modal aberto={mostrarModal} onFechar={() => setMostrarModal(false)}>
            <BlocosOpcoes 
                usuarioLogado={dadosUsuario} 
                operacaoEnviada={operacao} 
                item={itemModificar}
                imovelId={dadosBlocos?.imovel_id || null}
                onAtualizar={async () => {
                    await atualizarLista();
                    setMostrarModal(false);
            }}>
            </BlocosOpcoes>

        </Modal>
        <TituloHorizontal>Blocos</TituloHorizontal>
        {blocos.length > 0 ? 
        <>
        <BoxVertical>
            
            <DivInformacaoVertical>
            <TextoSelecione>Selecione:</TextoSelecione>
            <Select 
            value={selecao?.bloco_id || ""} 
            onChange={(e) => {
                const bloco = blocos.find(
                  (b) => b.bloco_id === Number(e.target.value)
                );
                setSelecao(bloco);
              }}
            >
                {blocos.map((item)=>(
                    
                    <option key={item.bloco_id} value={item.bloco_id}><Nome>{item.nome}</Nome></option>
                ))}
            </Select>
                <LinhaInformacao>
                    <Chave>Pavimentos:</Chave>
                    <Valor>{selecao?.pavimentos?.length || 0}</Valor>
                </LinhaInformacao>
                <LinhaInformacao>
                    <Chave>Salas:</Chave>
                    <Valor>{selecao?.pavimentos?.comodos?.length || 0}</Valor>
                </LinhaInformacao>
            <HorizontalBtn onClick={(e)=>{
                e.preventDefault();
                setItemModificar(selecao);
                setOperacao("2");
                setMostrarModal(true);
            }} $bgcolor={cores.backgroundBotaoSemFoco}>Atualizar</HorizontalBtn>
            <HorizontalBtn
            onClick={(e)=>{
                    e.preventDefault();
                    setItemModificar(selecao);
                    setOperacao("3");
                    setMostrarModal(true);
                }} 
            $bgcolor={cores.corDeletar}>Excluir</HorizontalBtn>
            </DivInformacaoVertical>
        </BoxVertical>
<HorizontalBtn onClick={(e)=>{
            e.preventDefault();
            setOperacao("1")
            setMostrarModal(true)}
        } $bgcolor={cores.backgroundBotaoSemFoco} style={{width: "100%"}}>+ Adicionar Bloco</HorizontalBtn></>
        : <AdicionarBtn onClick={(e)=>{
            e.preventDefault();
            setOperacao("1")
            setMostrarModal(true)}
        }>+ Adicionar  Bloco</AdicionarBtn>
    
    }
            </BoxBlocos>
    )
}

export default CardBloco;



// ESTILOS


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

const LinhaInformacao = styled.div`
    display: flex;
    flex-direction: row;
    margin: 5px 10%;
    gap: 10px;
    justify-content: space-between;
    `;

const AdicionarBtn = styled(Button)`
    min-height: 100px;
    height: 100%;
    width: 90%;
    margin: 10px auto;
    background-color: ${cores.cor3Transparente};
    `;
const HorizontalBtn = styled(Button)`
    height: 3rem;
    width: 80%;
    margin: 5px auto;
    `;
const TituloHorizontal = styled.h3`
    color: ${cores.corTextoClaro};
    background-color: ${cores.cor3};
    width: 100%;
    padding: 10px 0;
    margin: 0;
    `;

const BoxVertical = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 5px 0;
    height: inherit;
    `;
const DivInformacaoVertical = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: auto;
    justify-content: space-evenly;
`;
const BoxBlocos = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${cores.boxShadow};
    grid-column: span 3;
    height: 100%;
    `;
const Nome = styled.h1`
  background-color: ${cores.cor5}  ;
  padding: 20px;
  font-size: 2rem;
    margin: 10%;
`;
const Select = styled.select`
    background-color: ${cores.cor5}  ;
    padding: 20px;
    font-size: 1.5rem;
    margin: 0 10%;
    color: ${cores.corTextoClaro};
    font-weight:bold;
    text-align: center;
`;
const TextoSelecione = styled(Chave)`
 text-align: left;
 margin: 0 10%;
`;
