import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Select from "./SubSelect";
import Input from "./SubInput";
import Label from "./SubLabel";
import Button from "./SubButton";
import GridArea from "./SubGridArea";
import cores from "./Cores"
import useBancoDeDados from "./UseBancoDados";
import SelectBancoDeDados from "./SelectBuscaBd";

const FormGrid = styled.form`
gap: 10px;
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "operacao operacao idSala"
    "campusId campusId campusId"
    "blocoId blocoId pavimento"
    "numero apelido apelido"
    "imagem imagem croqui"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
        "operacao"
        "idSala"
        "campusId"
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


function SalaOpcoes() {
    const [objeto, setObjeto] = useState({
        sala_id: "",
        numero: "",
        apelido: "",
        tipo_area_id: 1,
        pavimento_id: "",
        imagem: "url da imagem",
        lista_coordenadas: "[123,123]",
    });
    const [operacao, setOperacao] = useState("1");

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

    const [listaPavimentos, setListaPavimentos] = useState([])
    const [loadingPavimentos, setLoadingPavimentos] = useState(true)
    const [listaBlocos, setListaBlocos] = useState([])
    const [listaCampus, setListaCampus] = useState([])
    const [loadingCampus, setLoadingCampus] = useState(true)
    const [loadingBlocos, setLoadingBlocos] = useState(true)
    useEffect(() => {
        SelectBancoDeDados({nomeTabela: 'campi', setData: setListaCampus, setLoading: setLoadingCampus })
        SelectBancoDeDados({nomeTabela: 'blocos', setData: setListaBlocos, setLoading: setLoadingBlocos })
        SelectBancoDeDados({nomeTabela: 'pavimentos', setData: setListaPavimentos, setLoading: setLoadingPavimentos })
    }, [])

    return(
            <div>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); alterarObjeto(e, 'sala_id')}}>
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
                            <GridArea $area="campusId">
                            <Label htmlFor="campusId">Selecione o campus:</Label>
                                <Select autoFocus id="campusId" name="campusId" required onChange={(e) => {setCampusSelecionado(e.target.value)}}>
                                    <option value="0">Selecione o Campus</option>
                                { loadingCampus ? 
                                        <option value={0} disabled> Carregando... </option>
                                        :                                         
                                    listaCampus.map(campus => (
                                        <option key={campus.campus_id} value={campus.campus_id}> {campus.nome + " - " + campus.cidade} </option>
                                    ))
                                }
                                </Select>
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
                    <GridArea $area="imagem">
                        <Label htmlFor="imagem">Imagem:</Label>
                        <Input type="text" id="imagem" value={objeto.imagem} name="imagem" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'imagem')}/>
                    </GridArea>
                    <GridArea $area="croqui">
                        <Label htmlFor="croqui">Croqui:</Label>
                        <Input type="text" id="croqui" value={objeto.croqui} name="croqui" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'lista_coordenadas')}/>
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