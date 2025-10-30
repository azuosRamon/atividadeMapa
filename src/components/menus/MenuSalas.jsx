import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Select from "../SubSelect";
import Input from "../SubInput";
import Label from "../SubLabel";
import Button from "../SubButton";
import GridArea from "../SubGridArea";
import cores from "../Cores"
import useBancoDeDados from "../BdSupabase";
import SelectBancoDeDados from "../BdSelectBusca";
import Slide from "../Slide";
import Modal from "../SubModal";
import SelectComDados from "../BdSelectComDados";
import terreo from "../Plantas/TERREO_PAVIMENTO.png";
import primeiro_pavimento from "../Plantas/PRIMEIRO_PAVIMENTO.png";
import segundo_pavimento from "../Plantas/SEGUNDO_PAVIMENTO.png";
import terceiro_pavimento from "../Plantas/TERCEIRO_PAVIMENTO.png";
import CriarCamposFormulario from "../SubCriadorForm";

import mapa from "../BdObjetoTabelas";
//import terreo from "../..//components/Plantas/TERREO_PAVIMENTO.png";
import BussolaCarregando from "../BussolaLoading.jsx";
import { supabase } from "/supabaseClient";
import Title from "../SubTitleH2";
import { use } from "react";

async function LerNovosDados(empresaId, pavimentoId) {
    //informar uma lista composta de ['coluna', valorProcurado] para utilizar a condicao
    let query = supabase
    .from('comodos')
    .select(`*,
                    tipos_areas(nome)
        `)
    .eq("empresa_id", empresaId)
    .eq('pavimento_id', pavimentoId)
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



const imagens = [terreo, primeiro_pavimento, segundo_pavimento, terceiro_pavimento];


const FormGrid = styled.form`
gap: 10px;
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "numero apelido apelido"
    "tipoArea lotacao croqui"
    "reset . botoes";


@media (max-width: 768px) {
    display: flex;
    flex-direction: column;
}
`;
const ButtonVoltar = styled(Button)`
  height: 100%;
  margin-top: 0;
`;
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

const TitleSublinhado = styled(Title)`
    border-bottom: 2px solid;
    margin-bottom: 20px;
`


function SalaOpcoes({ usuarioLogado, operacaoEnviada, item = null, pavimentoId=null, onAtualizar }) {
    const tabela = mapa.comodos;
    const [pontos, setPontos] = useState("[]");
    const [objeto, setObjeto] = useState(
            Object.fromEntries(
                !item ?
                Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id" ? 
                    usuarioLogado.empresa_id: k == "pavimento_id" ? pavimentoId : v.valor]))
                :
                Object.entries(item)
    
            )
        );

    const [operacao, setOperacao] = useState(operacaoEnviada || "1");

    useEffect(() => {
        setObjeto(prev => ({ ...prev, ["lista_coordenadas"]: pontos }));
    }, [pontos])

    
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
            console.error("erro ao cadastrar salas", err.message);
        }
      }

    
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarMapa, setMostrarMapa] = useState(false)

    useEffect(() => {
        setMostrarMapa(false);
    }, [pontos]);



    return(
            <div>
                <TitleSublinhado>SALA</TitleSublinhado>
                <FormGrid onSubmit={atualizarDados}>
                    <CriarCamposFormulario 
                                        item={tabela}
                                        setFuncao={alterarObjeto}
                                        operacao={operacao}
                                        setOperacao={setOperacao}
                                        objeto ={objeto}
                                        >

                    <GridArea $area="croqui">
                        <Label htmlFor="croqui">Croqui:</Label>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            setMostrarMapa(true);
                        }}>Editar sala</Button>
                        <Modal aberto={mostrarMapa} onFechar={() => setMostrarMapa(false)}>
                            <TitleSublinhado>Croqui</TitleSublinhado>
                            <Slide
                                lista_imagens={[terreo]}
                                pagina_inicio={0}
                                capturarCoordenadas = {true}
                                setPontosArea={setPontos}
                                />
                            <ButtonVoltar $bgcolor="rgb(38, 38, 38)" onClick={() => setMostrarMapa(false)}>
                                Fechar Croqui
                            </ButtonVoltar>
                        </Modal>
                        
                    </GridArea>

                                        </CriarCamposFormulario>
                        


                </FormGrid>

            </div>
    )
}


function CardComodos({key, dados, dadosUsuario, pavimentoId = null, onAtualizar}){
        const [operacao, setOperacao] = useState("1")
        const [itemModificar, setItemModificar] = useState(null)
        const [mostrarModal, setMostrarModal] = useState(false);
        const [comodos, setComodos] = useState(dados.comodos || []);

        const atualizarLista = async () => {
            const novosDados = await LerNovosDados(dadosUsuario.empresa_id, pavimentoId);
            if (novosDados.length > 0) {
            setComodos(novosDados || []);
            }

        };

         useEffect(() => {
                setComodos(dados?.comodos || []);
                }, [dados]);
            
    return(
        <BoxComodos>
            <Modal aberto={mostrarModal} onFechar={() => setMostrarModal(false)}>
                        <SalaOpcoes 
                            usuarioLogado={dadosUsuario} 
                            operacaoEnviada={operacao} 
                            item={itemModificar}
                            pavimentoId={pavimentoId || null}
                            onAtualizar={async () => {
                                await atualizarLista();
                                await onAtualizar();
                                setMostrarModal(false);
                        }}>
                        </SalaOpcoes>
            
                    </Modal>
            <TituloVertical>Salas</TituloVertical>
            <ListaSalas>
                <BoxComodo>
                    <AdicionarBtn  onClick={(e)=>{
                        e.preventDefault();
                        setItemModificar(null);
                        setOperacao("1");
                        setMostrarModal(true)}}>+ Nova Sala</AdicionarBtn>
                </BoxComodo>
                {comodos.map((item)=>(
                    <BoxComodo>
                                <TituloHorizontal>{item.tipos_areas.nome}</TituloHorizontal>
                        <DivInformacao>
                                <Chave>{item.apelido || "Informaçoes"}</Chave>
                            <LinhaInformacao>
                                <Chave>Número:</Chave>
                                <Valor>{item.numero}</Valor>
                            </LinhaInformacao>
                            <LinhaInformacao>
                                <Chave>Lotação:</Chave>
                                <Valor>{item.lotacao}</Valor>
                            </LinhaInformacao>
                        </DivInformacao>
                        <HorizontalBtn 
                          onClick={(e)=>{
                                e.preventDefault();
                                setItemModificar(item);
                                setOperacao("2");
                                setMostrarModal(true);
                            }}
                        $bgcolor={cores.backgroundBotaoSemFoco}>Atualizar</HorizontalBtn>
                        <HorizontalBtn 
                        onClick={(e)=>{
                            e.preventDefault();
                            setItemModificar(item);
                            setOperacao("3");
                            setMostrarModal(true);
                        }}
                        $bgcolor={cores.corDeletar}>Excluir</HorizontalBtn>
                    </BoxComodo>

                ))}
            </ListaSalas>
        </BoxComodos>
    )
}

export default CardComodos;

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
const TituloVertical = styled.h3`
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    color: ${cores.corTextoClaro};
    background-color: ${cores.cor3};
    padding: 10px;
    margin: 0;
    
    @media (max-width: 768px) {
        writing-mode: horizontal-tb;
        transform: none;
}

    `;
const BoxComodos = styled.div`
    display: flex;
    border: 1px solid ${cores.boxShadow};
    grid-column: span 10;
          @media (max-width: 768px) {
        grid-column: span 1;
        flex-direction: column;
}
    `;
const BoxComodo = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 0 5px;
    grid-column: span 3;

       @media (max-width: 768px) {
        grid-column: span 1;
        width: auto;
}
`;
const ListaSalas = styled.div`
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap:10px;
    margin: auto;
    width:100%;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
}
`;
