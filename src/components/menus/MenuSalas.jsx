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

const imagens = [terreo, primeiro_pavimento, segundo_pavimento, terceiro_pavimento];


const FormGrid = styled.form`
gap: 10px;
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "operacao operacao idSala"
    "campusId campusId lotacao"
    "blocoId blocoId pavimento"
    "numero apelido apelido"
    "tipoArea tipoArea croqui"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
        "operacao"
        "idSala"
        "campusId"
        "tipoArea"
        "lotacao"
        "blocoId" 
        "pavimento"
        "numero" 
        "apelido"
        "imagem"
        "croqui"
        "reset"
        "botoes";
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


function SalaOpcoes() {
    const [pontos, setPontos] = useState("[]");
    const [objeto, setObjeto] = useState({
        sala_id: "",
        numero: "",
        apelido: "",
        tipo_area_id: 1,
        lotacao: 0,
        pavimento_id: "",
        lista_coordenadas: pontos,
    });
    const [operacao, setOperacao] = useState("1");

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
        nomeTabela: "salas",
        objeto,
        setObjeto,
        operacao,
        campoId: "sala_id",
        campoNome: "numero"
    });

    const [campusSelecionado, setCampusSelecionado] = useState(0)
    const [blocoSelecionado, setBlocoSelecionado] = useState(0)

    const [listaSalas, setListaSalas] = useState([])
    const [loadingSalas, setLoadingSalas] = useState(true)

    const [listaPavimentos, setListaPavimentos] = useState([])
    const [loadingPavimentos, setLoadingPavimentos] = useState(true)
    const [listaBlocos, setListaBlocos] = useState([])
    const [listaCampus, setListaCampus] = useState([])
    const [loadingCampus, setLoadingCampus] = useState(true)
    const [loadingBlocos, setLoadingBlocos] = useState(true)
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        setCampusSelecionado(objeto.campus_id);
        setBlocoSelecionado(objeto.bloco_id);
        console.log(objeto)
    }, [objeto,campusSelecionado])
    
    useEffect(() => {
        SelectBancoDeDados({nomeTabela: 'campi', setData: setListaCampus, setLoading: setLoadingCampus })
        SelectBancoDeDados({nomeTabela: 'blocos', setData: setListaBlocos, setLoading: setLoadingBlocos })
        SelectBancoDeDados({nomeTabela: 'pavimentos', setData: setListaPavimentos, setLoading: setLoadingPavimentos })
        SelectBancoDeDados({nomeTabela: 'salas', setData: setListaSalas, setLoading: setLoadingSalas })
    }, [])

       const [mostrarMapa, setMostrarMapa] = useState(false)
       const abrirImagem = () => {
           setMostrarMapa(true)
       }
   
       const fecharImagem = () => {
           setMostrarMapa(false)
       }
       
       const retirarCampusId = (e)=>{
        const { campus_id: _, ...objetoSemCampus} = objeto;
        fazerEnvio(e)
    }
    

    return(
            <div>
                <FormGrid onSubmit={retirarCampusId}>
                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value)}}>
                            <option value="0">Selecione a operação</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                           <option value="3">Deletar</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="idSala">
                        <Label htmlFor="idSala">ID:</Label>
                        <Input type="number" id="idSala" name="idSala" disabled={!operacao || Number(operacao)<=1} onChange={(e) => alterarObjeto(e, 'sala_id')}/>
                    </GridArea>
                    <GridArea $area="numero">
                        <Label htmlFor="numero">Numero:</Label>
                        <Input type="number" id="numero" value={objeto.numero} name="numero" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'numero')} required/>
                    </GridArea>
                    <GridArea $area="apelido">
                        <Label htmlFor="apelido">Apelido:</Label>
                        <Input type="text" id="apelido" value={objeto.apelido} name="apelido" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'apelido')} required/>
                    </GridArea>
                    <GridArea $area="tipoArea">
                        <Label htmlFor="tipoArea">Tipo de área:</Label>
                        <SelectComDados id="tipoArea" name="tipoArea" tabela="tipos_areas" listaColunas={["tipo_area_id", "nome"]} itemValue={objeto.tipo_area_id} change={setObjeto} required></SelectComDados>
                    </GridArea>
                    <GridArea $area="lotacao">
                        <Label htmlFor="lotacao">Lotação:</Label>
                        <Input type="text" id="lotacao" value={objeto.lotacao} name="tipoArea" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'lotacao')} required/>
                    </GridArea>
                            <GridArea $area="campusId">
                            <Label htmlFor="campusId">Selecione o campus:</Label>
                            <SelectComDados id="campusId" name="campusId" tabela="campi" campoDesejado={["nome","cidade"]} listaColunas={["campus_id", "nome", "cidade"]} itemValue={objeto.campoId} change={setObjeto}  required></SelectComDados>
                        </GridArea>
                        <GridArea $area="blocoId">
                            <Label htmlFor="blocoId">Selecione o bloco:</Label>
                                <Select id="blocoId" type='number' name="blocoId" required onChange={(e) => { setBlocoSelecionado(e.target.value)}}>
                                    <option value="0">Selecione o Bloco</option>
                                {!loadingBlocos && 
                                    listaBlocos.filter(bloco => (
                                        Number(bloco.campus_id) === Number(campusSelecionado)
                                    )).length > 0 ? (
                                        listaBlocos
                                        .filter(bloco => Number(bloco.campus_id) === Number(campusSelecionado))
                                        .map(bloco => (
                                            <option key={bloco.bloco_id} value={Number(bloco.bloco_id)}>
                                            {`Bloco ${bloco.nome}`}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="0" disabled>Nenhum bloco encontrado</option>
                                    )
                                    }
                                </Select>
                        </GridArea>
                    <GridArea $area="pavimento">
                        <Label htmlFor="pavimento">Pavimento:</Label>
                                <Select id="pavimento" type='number' name="pavimento" required onChange={(e) => { alterarObjeto(e, 'pavimento_id')}}>
                                    <option value="0">Selecione o Pavimento</option>
                                {!loadingPavimentos && 
                                    listaPavimentos.filter(pavimento => (
                                        Number(pavimento.bloco_id) === Number(blocoSelecionado)
                                    )).length > 0 ? (
                                        listaPavimentos
                                        .filter(pavimento => Number(pavimento.bloco_id) === Number(blocoSelecionado))
                                        .map(pavimento => (
                                            <option key={pavimento.pavimento_id} value={Number(pavimento.pavimento_id)}>
                                            {`${pavimento.numero}º - Pavimento`}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="0" disabled>Nenhum pavimento encontrado</option>
                                    )
                                    }
                                </Select>
                    </GridArea>
                    <GridArea $area="croqui">
                        <Label htmlFor="croqui">Croqui:</Label>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            setMostrarModal(true);
                        }}>Editar sala</Button>
                        <Modal aberto={mostrarModal} onFechar={() => setMostrarModal(false)}>
                            <Slide
                                lista_imagens={[terreo]}
                                pagina_inicio={0}
                                capturarCoordenadas = {true}
                                setPontosArea={setPontos}
                                />
                            <ButtonVoltar $bgcolor="rgb(38, 38, 38)" onClick={() => setMostrarModal(false)}>
                                Voltar
                            </ButtonVoltar>
                        </Modal>
                        
                    </GridArea>


                    <GridArea $area="reset">
                        <Button $bgcolor={cores.backgroundBotaoSemFoco} type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>

            </div>
    )
}

export default SalaOpcoes;