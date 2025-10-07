import React, { useState, useEffect, useMemo} from "react";
import Box from "./SubBox";
import Input from "./SubInput";
import Select from "./SubSelect";
import Label from "./SubLabel";
import Button from "./SubButton";
import GridArea from "./SubGridArea";
import DivSeparador from "./SubDivSeparador";
import TabelaCompleta from "./SubTabela";
import Colapse from "./SubColapse"
import cores from "./Cores"
import SelectComDados from "./BdSelectComDados";
import LerDados from "./BdLerTabela";
import { data } from "react-router-dom";

function DefinirOperacao({operacao, setOperacao}){
    return (
        <GridArea $area="operacao">
            <Label htmlFor="operacao">operacao:</Label>
                <Select id="operacao" autoFocus name="operacao" required onChange={(e) => {setOperacao(e.target.value)}}>
                <option value="0">Selecione a operação desejada</option>
                <option value="1">Adicionar</option>
                <option value="2">Alterar</option>
                <option value="3">Deletar</option>
                </Select>
        </GridArea>
    );
};

function ExibirTabelaConsulta({tabela}){
    /*
    @cria uma tabela com os dados do banco de dados
    @param deve receber objeto.tabela
    */
   const [loading, setLoading] = useState(true)
   const reload = 0
   const data = LerDados({setLoading: setLoading, tabela:tabela.nome,listaColunas:tabela.lista})
    return(
        <GridArea $area="tabela">
                <DivSeparador></DivSeparador>
                <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={false} onclick={data}>
                    {loading
                        ? <div style={{padding: "16px"}}>Carregando...</div>
                        : <TabelaCompleta dados={data} lista={tabela.lista} camposPesquisa={false} />
                    }
                </Colapse>
                <DivSeparador></DivSeparador>
            </GridArea>
    );
};

function CriarInput({nomeCampo, campo, setFuncao, operacao, objeto}){
    const input = <Input 
    required={campo.required ?? false} 
    disabled={nomeCampo.includes('_id') && Number(operacao) <= 1} 
    value={(nomeCampo.includes('_id') && (typeof objeto?.[nomeCampo] != 'string')) ? (objeto?.[nomeCampo] ?? "") : String(objeto?.[nomeCampo] ?? "").toUpperCase()} 
    type={campo.tipo} 
    id={campo.nome} 
    name={campo.nome} 
    onChange={(e) => setFuncao(e, nomeCampo)}/>;
    switch(campo.tipo){
        case "text":
            break;
        case "number":
            break;
        case "email":
            break;
        case "date":
            break;
        case "checkbox":
            break;

    }
    return(

            <GridArea $area={campo.nome}>
                <Label htmlFor={campo.nome}>{campo.texto != "" ? campo.texto : campo.nome}:</Label>
                {input}
            </GridArea>
        
    )
}
function CriarSelect({nomeCampo, campo, setFuncao, objeto}){
    return(
            <GridArea $area={campo.nome}>
                <Label htmlFor={campo.nome}>{campo.texto != "" ? campo.texto : campo.nome}:</Label>
                <SelectComDados 
                value={objeto?.[nomeCampo] ?? "0"} 
                id={campo.nome} 
                name={campo.nome} 
                tabela={campo.tabela} 
                listaColunas={campo.lista} 
                itemValue={nomeCampo} 
                change={setFuncao} required={campo.required ?? false}></SelectComDados>
            </GridArea>
        
    )
};

function CriarCamposFormulario({item, setFuncao = ()=>{}, operacao, setOperacao, objeto}){
    const [btnSubmit, setBtnSubmit] = useState("");
    useEffect(()=>{
        switch(operacao){
            case "0":
                setBtnSubmit("Selecione a operação");
                break;
            case "1":
                setBtnSubmit("Adicionar");
                break;
            case "2":
               console.log(objeto)
                    
                setBtnSubmit("Alterar");
                break;
            case "3":
                setBtnSubmit("Remover");
                break;
        }
    }, [operacao])
    if (!item) return null;

    return (
        <>
            {(item.tabela?.mostrar ?? false) && (
                <ExibirTabelaConsulta tabela={item.view ?? item.tabela} ></ExibirTabelaConsulta>
            )}

            <DefinirOperacao operacao={operacao} setOperacao={setOperacao}/>

            {Object.entries(item.campos).map(([nome, campo]) =>{
                    if ((campo.mostrar ?? true )&& campo.campo == "input"){
                        
                        return (
                            <CriarInput key={nome} nomeCampo={nome} campo={campo} objeto={objeto} setFuncao={setFuncao} operacao={operacao} />
                        )
                    }
                    
                    if ((campo.mostrar ?? true )&& campo.campo =="select"){
                        return(
                            <CriarSelect key={nome}
                            nomeCampo={nome}
                            campo={campo}
                            setFuncao={setFuncao}
                            objeto={objeto} />
                        )
                    }
                    return null;
                })
            }
                    <GridArea $area="reset">
                        <Button $bgcolor={cores.backgroundBotaoSemFoco} type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button disabled={operacao=="0"} type="submit">{btnSubmit}</Button>   
                    </GridArea>
        </>
    )
    

    /*
        if(item == "operacao"){
        return(<DefinirOperacao />)
        } 
        if (item.campo == "input"){
        return(<CriarInput campo={item.campo} setFuncao={setFuncao}/>)
        } 
        if (item.campo == "select"){
            return(<CriarSelect campo={item.campo} setFuncao={setFuncao}  />)
        } 

        console.log("Item não reconhecido:", item);
        return null;*/
    
};

export default CriarCamposFormulario;

