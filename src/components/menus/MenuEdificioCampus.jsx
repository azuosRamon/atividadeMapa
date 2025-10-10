import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Select from "../SubSelect";
import Input from "../SubInput";
import Label from "../SubLabel";
import Button from "../SubButton";
import GridArea from "../SubGridArea";
import cores from "../Cores"
import useBancoDeDados from "../BdSupabase";

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
    grid-template-columns: 1fr;
    grid-template-areas:
           "operacao"
           "idCampus"
            "nome"
            "cep"
            "cidade"
            "estado"
            "logradouro"
            "complemento"
            "latitude"
            "longitude"
            "reset"
            "botoes";
}
`;


function CampusOpcoes({ usuarioLogado, dados }) {
    const [objeto, setObjeto] = useState({
        imovel_id: "",
        nome: "",
        logradouro: "",
        complemento: "",
        cep: "",
        cidade: "",
        estado: "",
        latitude: "",
        longitude: "",
        empresa_id: usuarioLogado.empresa_id
    });
    const [operacao, setOperacao] = useState("1");

    const {
        data,
        pesquisa,
        loading,
        fazerEnvio,
        alterarObjeto
    } = useBancoDeDados({
        nomeTabela: "imoveis",
        objeto,
        setObjeto,
        operacao,
        campoId: "imovel_id",
        campoNome: "nome"
    });
   
   /* useEffect(() => {
        const itemSelecionado = data.find(item => item.id === Number(idItem));
        setNome(itemSelecionado ? itemSelecionado.nome : "");
        setCidade(itemSelecionado ? itemSelecionado.cidade : "");
        setEstado(itemSelecionado ? itemSelecionado.estado : "");
        setCep(itemSelecionado ? itemSelecionado.cep : "");
        setLogradouro(itemSelecionado ? itemSelecionado.logradouro : "");
        setComplemento(itemSelecionado ? itemSelecionado.complemento : "");
    }, [idItem]);
*/

    return(
            <div>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); alterarObjeto(e, 'imovel_id')}}>
                            <option value="0">Selecione a operação</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="idCampus">
                        <Label htmlFor="idCampus">ID:</Label>
                        <Input type="number" id="idCampus" name="idCampus" disabled={!operacao || Number(operacao)<=1} onChange={(e) => alterarObjeto(e, 'imovel_id')}/>
                    </GridArea>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome do Campus:</Label>
                        <Input type="text" id="nome" value={objeto.nome} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'nome')} required/>
                    </GridArea>
                    <GridArea $area="cep">
                        <Label htmlFor="cep">Cep:</Label>
                        <Input type="number" id="cep" value={objeto.cep} name="cep" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'cep')} required/>
                    </GridArea>
                    <GridArea $area="cidade">
                        <Label htmlFor="cidade">Cidade:</Label>
                        <Input type="text" id="cidade" value={objeto.cidade} name="cidade" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'cidade')} required/>
                    </GridArea>
                    <GridArea $area="estado">
                        <Label htmlFor="estado">Estado:</Label>
                        <Input type="text" id="estado" value={objeto.estado} name="estado" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'estado')} required/>
                    </GridArea>
                    <GridArea $area="logradouro">
                        <Label htmlFor="logradouro">logradouro:</Label>
                        <Input type="text" id="logradouro" value={objeto.logradouro} name="logradouro" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'logradouro')} required/>
                    </GridArea>
                    <GridArea $area="complemento">
                        <Label htmlFor="complemento">Complemento:</Label>
                        <Input type="text" id="complemento" value={objeto.complemento} name="complemento" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'complemento')} required/>
                    </GridArea>
                    <GridArea $area="latitude">
                        <Label htmlFor="latitude">latitude:</Label>
                        <Input type="text" id="latitude" value={objeto.latitude} name="latitude" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'latitude')} required/>
                    </GridArea>
                    <GridArea $area="longitude">
                        <Label htmlFor="longitude">Longitude:</Label>
                        <Input type="text" id="longitude" value={objeto.longitude} name="longitude" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'longitude')} required/>
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

export default CampusOpcoes;