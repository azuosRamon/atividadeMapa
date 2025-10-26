import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../SubInput";
import Label from "../SubLabel";
import Button from "../SubButton";
import GridArea from "../SubGridArea";
import cores from "../Cores"
import { use } from "react";
import useBancoDeDados from "../BdSupabase";
import SelectBancoDeDados from "../BdSelectBusca";
import mapa from "../BdObjetoTabelas"
import Title from "../SubTitleH2";
import CriarCamposFormulario from "../SubCriadorForm";

import Box from "../SubBox";
import terreo from "../..//components/Plantas/TERREO_PAVIMENTO.png";
import BussolaCarregando from "../BussolaLoading.jsx";
import Modal from "../SubModal.jsx";
import { supabase } from "/supabaseClient";

async function LerNovosDados(empresaId, blocoId) {
    //informar uma lista composta de ['coluna', valorProcurado] para utilizar a condicao
    let query = supabase
    .from('pavimentos')
    .select(`
                *,
                comodos(*)
        `)
    .eq("empresa_id", empresaId)
    .eq('bloco_id', blocoId)
    .order('numero')
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
    "numero imagem imagem"
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


function PavimentosOpcoes({ usuarioLogado, operacaoEnviada, item = null, blocoId=null, onAtualizar }) {
    const tabela = mapa.pavimentos;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            !item ?
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id" ? 
                usuarioLogado.empresa_id: k == "bloco_id" ? blocoId : v.valor]))
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
            console.error("erro ao cadastrar pavimentos", err.message);
        }
      }

   
    return(
            <div>
                <TitleSublinhado>PAVIMENTOS</TitleSublinhado>
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
 * 
 * @param dadosPavimentos são os dados do bloco
 * @param dadosUsuario dados do usuario apenas para pegar o id da empresa
 * @param selecao dados do pavimento que esta sendo selecionado
 * @param setSelecao deve receber o setPavimentoSelecionado do elemento pai
 * @param blocoId recebe o bloco id, essainformação tambem esta presente em dadospavimntos porem fiz para testar uma alternativa
 * @returns 
 */

function CardPavimento({key, dadosPavimentos, dadosUsuario, selecao, setSelecao, blocoId = null}) {
    const [operacao, setOperacao] = useState("1")
    const [itemModificar, setItemModificar] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false);
    const [pavimentos, setPavimentos] = useState(dadosPavimentos.pavimentos || []);

    const atualizarLista = async () => {
        const novosDados = await LerNovosDados(dadosUsuario.empresa_id, blocoId);
        if (novosDados.length > 0) {
        setPavimentos(novosDados || []);
        }

      };


    useEffect(() => {
    if (!itemModificar && pavimentos.length > 0) {
        setItemModificar(pavimentos[0]);
    }
    }, [pavimentos]);

    useEffect(() => {
        setPavimentos(dadosPavimentos?.pavimentos || []);
        }, [dadosPavimentos]);
    

    return (
        <BoxPavimentos>
        <Modal aberto={mostrarModal} onFechar={() => setMostrarModal(false)}>
            <PavimentosOpcoes 
                usuarioLogado={dadosUsuario} 
                operacaoEnviada={operacao} 
                item={itemModificar}
                blocoId={blocoId || null}
                onAtualizar={async () => {
                    await atualizarLista();
                    setMostrarModal(false);
            }}>
            </PavimentosOpcoes>

        </Modal>
        <TituloHorizontal>Pavimentos</TituloHorizontal>
        {pavimentos.length > 0 ? 
        <>
        <BoxPavimento>
            <DivInformacaoPavimentos>
                <TextoSelecione>Selecione:</TextoSelecione>   
                <Select
                    value={selecao?.pavimento_id || ""}
                    onChange={(e) => {
                        const pav = pavimentos.find(p => p.pavimento_id === Number(e.target.value));
                        setSelecao(pav);
                    }}
                    >
                        <option value="" disabled hidden>
                        ---
                        </option>
                    {pavimentos.map((item) => (
                        <option key={item.pavimento_id} value={item.pavimento_id}>
                        {item.numero === 0 ? "Térreo" : `${item.numero}º`}
                        </option>
                    ))}
                    </Select>
                <LinhaInformacaoPavimentos>
                    <Chave>Salas:</Chave>
                        <Valor>{pavimentos?.comodos?.length || 0}</Valor>
                </LinhaInformacaoPavimentos>
                <LinhaInformacaoPavimentos>
                    <Valor style={{color: cores.backgroundBotaoSemFoco2}}>|</Valor>
                </LinhaInformacaoPavimentos>
                <HorizontalBtn
                    onClick={(e)=>{
                    e.preventDefault();
                    setItemModificar(selecao);
                    setOperacao("2");
                    setMostrarModal(true);
                }}
                $bgcolor={cores.backgroundBotaoSemFoco}>Atualizar</HorizontalBtn>
                <HorizontalBtn
                onClick={(e)=>{
                    e.preventDefault();
                    setItemModificar(selecao);
                    setOperacao("3");
                    setMostrarModal(true);
                }} 
                
                $bgcolor={cores.corDeletar}>Excluir</HorizontalBtn>
            </DivInformacaoPavimentos>
            <ImagemPavimento src={terreo}></ImagemPavimento>
        </BoxPavimento>
                <HorizontalBtn onClick={(e)=>{
            e.preventDefault();
            setItemModificar(null)
            setOperacao("1");
            setMostrarModal(true)}}
                $bgcolor={cores.backgroundBotaoSemFoco} style={{width: "100%"}}>+ Adicionar pavimento</HorizontalBtn>
        </>
    : <AdicionarBtn onClick={(e)=>{
            e.preventDefault();
            setOperacao("1");
            setMostrarModal(true)}}>+ Adicionar Pavimento</AdicionarBtn>}
            </BoxPavimentos>
    )
}


export default CardPavimento;




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
    margin: 5px 0;
    gap: 10px;
    justify-content: space-between;
    `;
const LinhaInformacaoPavimentos = styled(LinhaInformacao)`
    margin: 0 10%;
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
const DivInformacaoVertical = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: auto;
    justify-content: space-evenly;
`;
const DivInformacaoPavimentos = styled(DivInformacaoVertical)`
    `;

const BoxPavimentos = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${cores.boxShadow};
    grid-column: span 7;
    height:100%;
    `;
const BoxPavimento = styled.div`
    display: flex;
    flex-direction: row;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 5px 0;
    height: inherit;
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
const ImagemPavimento = styled.img`
  width: 60%;
  height: fit-content;  
  margin: auto;
`;
const TextoSelecione = styled(Chave)`
 text-align: left;
 margin: 0 10%;
`;
