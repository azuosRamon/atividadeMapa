import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "./SubInput";
import Select from "./SubSelect";
import Label from "./SubLabel";
import Button from "./SubButton";
import GridArea from "./SubGridArea";
import cores from "./Cores"
import { use } from "react";
import useBancoDeDados from "./UseBancoDados";
import SelectBancoDeDados from "./SelectBuscaBd";

const FormGrid = styled.form`
gap: 10px;
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "campusId campusId campusId"
    "blocoId blocoId blocoId"
    "operacao operacao pavimentosId"
    "nome nome imagem"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "campusId"
        "blocoId"
        "operacao"
        "pavimentosId"
        "nome"
        "imagem"
        "reset"
        "botoes";
}
`;


function BlocosOpcoes({ dados }) {
    const [objeto, setObjeto] = useState({
        pavimento_id: "",
        numero: "",
        bloco_id: "",
        imagem: ""
        });
        const [operacao, setOperacao] = useState("1");
    
        const {
        data,
        pesquisa,
        loading2,
        fazerEnvio,
        alterarObjeto
        } = useBancoDeDados({
        nomeTabela: "pavimentos",
        objeto,
        setObjeto,
        operacao,
        campoId: "pavimento_id",
        campoNome: "numero"
        });
    
    const [campusSelecionado, setCampusSelecionado] = useState("")

    const [listaBlocos, setListaBlocos] = useState("")
    const [listaCampus, setListaCampus] = useState("")
    const [loadingCampus, setLoadingCampus] = useState(true)
    const [loadingBlocos, setLoadingBlocos] = useState(true)
    useEffect(() => {
        SelectBancoDeDados({nomeTabela: 'campi', setData: setListaCampus, setLoading: setLoadingCampus })
        SelectBancoDeDados({nomeTabela: 'blocos', setData: setListaBlocos, setLoading: setLoadingBlocos })
    }, [])


    return(
        
                    <FormGrid onSubmit={fazerEnvio}>
                        <GridArea $area="campusId">
                            <Label htmlFor="campusId">Selecione o campus:</Label>
                                <Select autoFocus id="campusId" name="campusId" required onChange={(e) => {setCampusSelecionado(e.target.value)}}>
                                    <option value="0">Selecione o Campus</option>
                                { loadingCampus ? 
                                        <option value={0} disabled> Carregando... </option>
                                        :                                         
                                    listaCampus.map(campus => (
                                        <option value={campus.campus_id}> {campus.nome + " - " + campus.cidade} </option>
                                    ))
                                }
                                </Select>
                        </GridArea>
                        <GridArea $area="blocoId">
                            <Label htmlFor="blocoId">Selecione o bloco:</Label>
                                <Select id="blocoId" type='number' name="blocoId" required onChange={(e) => { alterarObjeto(e, 'bloco_id', 'numero')}}>
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

                        <GridArea $area="operacao">
                            <Label htmlFor="operacao">Operacao:</Label>
                                <Select id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value);alterarObjeto(e, 'pavimento_id')}}>
                                <option value="0">Selecione a operação desejada</option>
                                <option value="1">Adicionar</option>
                                <option value="2">Alterar</option>
                                <option value="3">Deletar</option>
                                </Select>
                        </GridArea>
                        <GridArea $area="pavimentosId">
                            <Label htmlFor="pavimentosId">ID do Pavimento:</Label>
                            <Input type="number" id="pavimentosId" name="pavimentosId" alt="Apenas para alteração ou exclusão" disabled={!operacao || Number(operacao)<=1} onChange={(e) => alterarObjeto(e, 'pavimento_id')}/>
                        </GridArea>
                        <GridArea $area="nome">
                            <Label htmlFor="nome">Número do pavimento:</Label>
                            <Input type="number" id="nome" value={objeto.numero} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'numero', 'numero')} required/>
                        </GridArea>
                        <GridArea $area="imagem">
                            <Label htmlFor="imagem">Foto do pavimento:</Label>
                            <Input type="text" id="imagem" name="imagem" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'imagem')}/>
                        </GridArea>

                        <GridArea $area="reset">
                            <Button $bgcolor={cores.backgroundBotaoSemFoco} type="reset">Limpar</Button>   
                        </GridArea>
                        <GridArea $area="botoes">
                            <Button type="submit">Salvar</Button>   
                        </GridArea>

                    </FormGrid>
    )
}

export default BlocosOpcoes;