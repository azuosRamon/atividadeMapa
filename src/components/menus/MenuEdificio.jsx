import { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import CardImovel from "./MenuEdificioCampus";
import CardBloco from "./MenuEdificioBlocos";
import CardPavimento from "./MenuEdificioPavimentos";
import CardComodos from "./MenuSalas";
import Button from "../SubButton";
import cores from "../Cores.js"
import BussolaCarregando from "../BussolaLoading.jsx";
import Modal from "../SubModal.jsx";
import { supabase } from "/supabaseClient";
import DivSeparador from "../SubDivSeparador";

const DivSeparadorAjuste = styled(DivSeparador)`
    display: none;
   @media (max-width: 768px) {
    display: block;
   }
`;

async function LerDadosImoveis(empresaId) {
    //informar uma lista composta de ['coluna', valorProcurado] para utilizar a condicao
    let query = supabase
    .from('imoveis')
    .select(`
            *,
            blocos(
                *,
                pavimentos(
                    *,
                    comodos(
                    *,
                    tipos_areas(nome)
                    )
                    ))
        `)
    .eq("empresa_id", empresaId)
    .order('nome', {ascending:true})
    .order('nome', {foreignTable: 'blocos', ascending: true})
    .order('numero', {foreignTable: 'blocos.pavimentos', ascending: true})
    .order('numero', {foreignTable: 'blocos.pavimentos.comodos', ascending: true})
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



const TitleSublinhado = styled.h2`
    border-bottom: 2px solid;
    margin-bottom: 0 0 20px 0;
    color: ${cores.corTexto};
`
function CardContrato({dados}){
    const data = dados
    return(
        <>
        <Chave>Imoveis</Chave><Valor>1/{dados.qtd_comodos}</Valor>
        </>
    )
}

function ConfigurarEdificio() {
  const [usuario, setUsuario] = useState([]);
  const [imoveis, setImoveis] = useState([]);
  const [imovelSelecionado, setImovelSelecionado] = useState(null);
  const [blocoSelecionado, setBlocoSelecionado] = useState(null);
  const [pavimentoSelecionado, setPavimentoSelecionado] = useState(null);
  const [contrato, setContrato] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [contador,  setContador] = useState(0);
    
    const atualizarDados = async ()=>{
    try {
        const dadosImovelSelecionado = await LerDadosImoveis(usuario.empresa_id);// 🔹 atualiza lista e fecha modal
        setImoveis(dadosImovelSelecionado);
        setImovelSelecionado(dadosImovelSelecionado.find(imovel => imovel.imovel_id === imovelSelecionado.imovel_id));
        setContador(contador + 1);
    }
    catch(error){
        console.error("erro ao atualizar", error.message);
    }
    }

    useEffect(() => {
        let blocoAtualizado = imovelSelecionado?.blocos?.find(bloco => bloco.bloco_id === blocoSelecionado?.bloco_id) || null;
        if (!blocoAtualizado) {
            blocoAtualizado = imovelSelecionado?.blocos?.[0] || null;
        }
        let pavimentoAtualizado = blocoAtualizado?.pavimentos?.find(pavimento => pavimento.pavimento_id === pavimentoSelecionado?.pavimento_id) || null;
        if (!pavimentoAtualizado) {
            pavimentoAtualizado = blocoAtualizado?.pavimentos?.[0] || null;
        }
        if (blocoAtualizado) setBlocoSelecionado(blocoAtualizado);
        if (pavimentoAtualizado) setPavimentoSelecionado(pavimentoAtualizado)
    }, [imovelSelecionado, contador]);
    useEffect(() => {
        let pavimentoAtualizado = blocoSelecionado?.pavimentos?.find(pavimento => pavimento.pavimento_id === pavimentoSelecionado?.pavimento_id) || null;
        if (!pavimentoAtualizado) {
            pavimentoAtualizado = blocoSelecionado?.pavimentos?.[0] || null;
        }
        setPavimentoSelecionado(pavimentoAtualizado)
    }, [blocoSelecionado]);

  const handleCardClick = (imovel) => (e) => {
    e.preventDefault();

    setImovelSelecionado(imovel);
    
    // Definição de defaults (com optional chaining para segurança)
    const primeiroBloco = imovel.blocos?.[0];
    const primeiroPavimento = primeiroBloco?.pavimentos?.[0];
    
    setBlocoSelecionado(primeiroBloco || null);
    setPavimentoSelecionado(primeiroPavimento || null);
    
    setMostrarModalSelecao(false);
};
    const carregar = async () => {
        const dadosUsuario = JSON.parse(localStorage.getItem("usuario"));
            if (!dadosUsuario?.empresa_id) {
                console.warn("Usuário não encontrado no localStorage.");
                setCarregando(false);
                return;
            }
            setUsuario(dadosUsuario);
            
            const dadosImoveisCompleto = await LerDadosImoveis(dadosUsuario.empresa_id);
            setImoveis(dadosImoveisCompleto);
            if (!imovelSelecionado && dadosImoveisCompleto.length > 0) {
                const primeiroImovel = dadosImoveisCompleto[0];
                const primeiroBloco = primeiroImovel.blocos?.[0] || null;
                const primeiroPavimento = primeiroBloco?.pavimentos?.[0] || null;
                setImovelSelecionado(primeiroImovel);
                if (primeiroBloco) setBlocoSelecionado(primeiroBloco);
                if (primeiroPavimento) setPavimentoSelecionado(primeiroPavimento)
                }


              setCarregando(false);
    }
    useEffect(() => {
            carregar();
        }, []);

        const [mostrarModalSelecao, setMostrarModalSelecao] = useState(false);
  if (carregando) return <BussolaCarregando aberto={carregando} onFechar={() => setCarregando(false)}>Buscando imóveis</BussolaCarregando>;
    return(
            <BoxContainer>
                <Modal aberto={mostrarModalSelecao} onFechar={() => setMostrarModalSelecao(false)}>
                    {imoveis.map((item, indice) =>{
                        return(
                            <CardImovel 
                            onClick={handleCardClick(item)}
                                key={item.imovel_id}
                                dadosImovel={item}
                                setSelecao={setImovelSelecionado} 
                                dadosUsuario={usuario}
                                indice={indice}/>
                        )

                    })}
                </Modal>
                
                {/*contrato.length === 0 && (<p>A empresa não possui um constrato ativo, por favor entre em contato para adquiri-lo</p>)*/}
                {contrato.length > 0 && <CardContrato dados={contrato}/>}
                {imoveis && <CardImovel 
                selecao={imovelSelecionado} 
                setSelecao={setImovelSelecionado}  
                dadosUsuario={usuario}/>}
                            <VerticalBtn
             onClick={(e)=>{
                    e.preventDefault();
                    setMostrarModalSelecao(true);
                }} >Trocar Imóvel</VerticalBtn>
                <DivSeparadorAjuste></DivSeparadorAjuste>

                {imovelSelecionado && <CardBloco 
                key={imovelSelecionado.imovel_id+contador}
                dadosBlocos={imovelSelecionado} 
                selecao={blocoSelecionado} 
                setSelecao={setBlocoSelecionado} 
                dadosUsuario={usuario}
                onAtualizar={async () => {
                    await atualizarDados();
                }}
                />}

                {blocoSelecionado && <CardPavimento 
                key={blocoSelecionado.bloco_id}
                dadosPavimentos={blocoSelecionado} 
                selecao={pavimentoSelecionado} 
                setSelecao={setPavimentoSelecionado} 
                dadosUsuario={usuario}
                blocoId={blocoSelecionado.bloco_id}
                onAtualizar={async () => {
                    await atualizarDados();
                }}
                />}
                <DivSeparadorAjuste></DivSeparadorAjuste>
                {pavimentoSelecionado && <CardComodos 
                key={pavimentoSelecionado.pavimento_id}
                dadosUsuario={usuario}
                pavimentoId={pavimentoSelecionado.pavimento_id}
                onAtualizar={async () => {
                    await atualizarDados();
                }}
                dados={pavimentoSelecionado}/>}
            </BoxContainer>
    )
}

export default ConfigurarEdificio;

// ESTILOS

const BoxContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  align-items: flex-start;
  gap: 10px;

     @media (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
}
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
const DivInformacaoComodos = styled.div`
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

       @media (max-width: 768px) {
        writing-mode: horizontal-tb;
        transform: none;
        width: 90%;
        margin: 5px auto;
        
}
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
const TituloVertical = styled.h3`
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    color: ${cores.corTextoClaro};
    background-color: ${cores.cor3};
    padding: 10px;
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
const DivInformacaoPavimentos = styled(DivInformacaoVertical)`
    `;
const VerticalBtn = styled(Button)`
    height: 90%;
    width: 100%;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    margin: 0 auto;
    grid-column: span 1;


       @media (max-width: 768px) {
        writing-mode: horizontal-tb;
        transform: none;
        margin: 5px auto;
        
}
    `;
const BoxImoveis = styled.div`
    display: flex;
    border: 1px solid ${cores.boxShadow};
    max-height: 9em;
    grid-column: span 10;
`;
const BoxComodos = styled.div`
    display: flex;
    border: 1px solid ${cores.boxShadow};
    grid-column: span 10;
    `;
const BoxComodo = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 0 5px;
    grid-column: span 3;
`;
const ListaSalas = styled.div`
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap:10px;
    margin: auto;
    width:100%;
`;
const BoxImovel = styled.div`
    display: flex;
    border: 1px solid black;
    background-color: ${cores.backgroundBotaoSemFoco2};
    width: 100%;
    margin: 0 5px;
    `;
const BoxBlocos = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${cores.boxShadow};
    grid-column: span 3;
    height: 100%;
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
