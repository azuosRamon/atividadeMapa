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

function DefinirOperacao({operacao, setOperacao}){
    return (
        <GridArea $area="operacao">
            <Label htmlFor="operacao">Selecione a operacao:</Label>
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
    const data = LerDados({setLoading: setLoading, tabela:tabela.nome,listaColunas:tabela.lista})
    return(
        <GridArea $area="tabela">
                <DivSeparador></DivSeparador>
                <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={false}>
                    {loading
                        ? <div style={{padding: "16px"}}>Carregando...</div>
                        : <TabelaCompleta dados={data} lista={tabela.lista} camposPesquisa={false} />
                    }
                </Colapse>
                <DivSeparador></DivSeparador>
            </GridArea>
    );
};

function CriarInput({campo, setFuncao}){
    return(

            <GridArea $area={campo.nome}>
                <Label htmlFor={campo.nome}>{campo.texto}</Label>
                <Input type={campo.tipo} id={campo.nome} name={campo.nome} disabled={!operacao || Number(operacao)<=1} onChange={(e) => setFuncao(e, String(campo))}/>
            </GridArea>
        
    )
};
function CriarSelect({campo, setFuncao}){
    return(
            <GridArea $area={campo.nome}>
                <Label htmlFor={campo.nome}>{campo.texto}</Label>
                <SelectComDados id={campo.nome} name={campo.nome} tabela={campo.tabela.nome} listaColunas={campo.tabela.lista} itemValue={campo[2]} change={setFuncao} required></SelectComDados>
            </GridArea>
        
    )
};

function CriarCamposFormulario({item, setFuncao = ()=>{}, operacao, setOperacao}){
    
    Object.keys(item).map((chave, valor) =>{
        if (chave == "tabela" && item.tabela.mostrar){
            console.log(item.tabela);
        return(
            <ExibirTabelaConsulta tabela={item.tabela} ></ExibirTabelaConsulta>
    )
        }
    })
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

