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

function CriarInput({nomeCampo, campo, setFuncao, operacao}){
    return(

            <GridArea $area={campo.nome}>
                <Label htmlFor={campo.nome}>{campo.texto}</Label>
                <Input type={campo.tipo} id={campo.nome} name={campo.nome} onChange={(e) => setFuncao(e, nomeCampo)}/>
            </GridArea>
        
    )
};
function CriarSelect({nomeCampo, campo, setFuncao}){
    return(
            <GridArea $area={campo.nome}>
                <Label htmlFor={campo.nome}>{campo.texto}</Label>
                <SelectComDados id={campo.nome} name={campo.nome} tabela={campo.tabela} listaColunas={campo.lista} itemValue={nomeCampo} change={(e) => setFuncao(e, nomeCampo)} required></SelectComDados>
            </GridArea>
        
    )
};

function CriarCamposFormulario({item, setFuncao = ()=>{}, operacao, setOperacao}){

    if (!item) return null;

    return (
        <>
            {item.tabela?.mostrar && (
                <ExibirTabelaConsulta tabela={item.tabela} ></ExibirTabelaConsulta>
            )}

            <DefinirOperacao operacao={operacao} setOperacao={setOperacao}/>

            {Object.entries(item.campos).map(([nome, campo]) =>{

                    if (campo.campo == "input"){
                        return (
                            <CriarInput key={nome} nomeCampo={nome} campo={campo} setFuncao={setFuncao} operacao={operacao} />
                        )
                    }

                    if (campo.campo =="select"){
                        return(
                            <CriarSelect key={nome}
                                nomeCampo={nome}
                                campo={campo}
                                setFuncao={setFuncao} />
                        )
                    }
                    return null;
                })
            }
                    <GridArea $area="reset">
                        <Button $bgcolor={cores.backgroundBotaoSemFoco} type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
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

