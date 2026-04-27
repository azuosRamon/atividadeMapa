    import React, { useState, useEffect, useMemo} from "react";
    import Box from "./SubBox";
    import Input from "./SubInput";
    import Select from "./SubSelect";
    import Label from "./SubLabel";
    import Button from "./SubButton";
    import GridArea from "./SubGridArea";
    import DivSeparador from "./SubDivSeparador";
    import TabelaCompleta from "./SubTabela";
    import SubCardsConsulta from "./SubCardsConsulta";
    import Colapse from "./SubColapse"
    import cores from "./Cores"
    import SelectComDados from "./BdSelectComDados";
    import LerDados from "./BdLerTabela";
    import { data } from "react-router-dom";
    import { supabase } from "../../supabaseClient";
    import CriarInputImagemCrop from "./SubCriarImputImagem";
    import { FaAsterisk } from "react-icons/fa";

    function IconeObrigatorio({ required }) {
        if (!required) return null;
        return <FaAsterisk title="Campo obrigatório" style={{color: cores.corDeletar, fontSize: '10px', marginLeft: '4px', verticalAlign: 'super'}} />
    }

    function DefinirOperacao({operacao, setOperacao}){
        return (
            <GridArea $area="operacao">
                    <Select id="operacao" autoFocus name="operacao" required onChange={(e) => {setOperacao(e.target.value)}}>
                    <option value="0">Selecione a operação desejada</option>
                    <option value="1">Adicionar</option>
                    <option value="2">Alterar</option>
                    <option value="3">Deletar</option>
                    </Select>
            </GridArea>
        );
    };

    function ExibirTabelaConsulta({tabela, setOperacao, setObjeto, fecharColapse, triggerFechar}){
        /*
        @cria uma tabela com os dados do banco de dados
        @param deve receber objeto.tabela
        */
    const [loading, setLoading] = useState(true)
    const data = LerDados({setLoading: setLoading, tabela:tabela.nome,listaColunas:tabela.lista})
        return(
            <GridArea $area="tabela">
                    <DivSeparador></DivSeparador>
                    <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={false} fecharTrilho={triggerFechar}>
                        {loading
                            ? <div style={{padding: "16px", color: 'white'}}>Carregando...</div>
                            : <SubCardsConsulta dados={data} listaColunas={tabela.lista} setOperacao={setOperacao} setObjeto={setObjeto} onAction={fecharColapse}/>
                        }
                    </Colapse>
                    <DivSeparador></DivSeparador>
                </GridArea>
        );
    };


    // Função auxiliar para validar CPF
    const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
    };

    // Função auxiliar para validar CNPJ
    const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, "");
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado == digitos.charAt(1);
    };

    function CriarInput({ nomeCampo, campo, setFuncao, operacao, objeto }) {
    const [erro, setErro] = useState("");
    const valor = String(objeto?.[nomeCampo] ?? "");

    // Define máscara automática
    let mask = campo.mask ?? null;
    if (!mask) {
        switch (nomeCampo.toLowerCase()) {
        case "cep":
            mask = "99999-999";
            break;
        case "cpf":
            mask = "999.999.999-99";
            break;
        case "cnpj":
            mask = "99.999.999/9999-99";
            break;
        case "telefone":
        case "celular":
            mask = "(99) 99999-9999";
            break;
        default:
            mask = null;
            break;
        }
    }

    const handleChange = (e) => {
        const valorDigitado = e.target.value;
        setFuncao(e, nomeCampo);

        // Valida CPF ou CNPJ quando completo
        if (nomeCampo.toLowerCase() === "cpf" && valorDigitado.replace(/\D/g, "").length === 11) {
        setErro(validarCPF(valorDigitado) ? "" : "CPF inválido");
        } else if (nomeCampo.toLowerCase() === "cnpj" && valorDigitado.replace(/\D/g, "").length === 14) {
        setErro(validarCNPJ(valorDigitado) ? "" : "CNPJ inválido");
        } else {
        setErro("");
        }
    };

    return (
        <GridArea $area={campo.nome}>
        <Label htmlFor={campo.nome}>
            {campo.texto !== "" ? campo.texto : campo.nome}:
            <IconeObrigatorio required={campo.required} />
        </Label>
        <Input
            required={campo.required ?? false}
            disabled={nomeCampo.includes("_id") && Number(operacao) <= 1}
            value={valor}
            type={campo.tipo || "text"}
            id={campo.nome}
            name={campo.nome}
            mask={mask}
            onChange={handleChange}
            $color={erro ? "red" : undefined}
            placeholder={campo.placeholder ?? ""}
        />
        {erro && (
            <span style={{ color: "red", fontSize: "13px" }}>
             {erro}
            </span>
        )}
        </GridArea>
    );
    }


    function CriarSelect({nomeCampo, campo, visualizar = null, setFuncao, objeto, condicao = null}){
        return(
                <GridArea $area={campo.nome}>
                    <Label htmlFor={campo.nome}>
                        {campo.texto != "" ? campo.texto : campo.nome}:
                        <IconeObrigatorio required={campo.required} />
                    </Label>
                    <SelectComDados 
                    value={objeto?.[nomeCampo] ?? "0"} 
                    id={campo.nome} 
                    name={campo.nome} 
                    tabela={campo.tabela} 
                    listaColunas={campo.lista} 
                    campoDesejado={visualizar ?? campo.lista}
                    itemValue={nomeCampo}
                    condicao={condicao}
                    change={setFuncao} required={campo.required ?? false}></SelectComDados>
                </GridArea>
            
        )
    };

    function CriarCamposFormulario({item, setFuncao = ()=>{}, operacao, setOperacao, objeto, setObjeto, children}) {
        const [btnSubmit, setBtnSubmit] = useState("");
        const [backgroundBotao, setBackground] = useState(cores.backgroundBotaoSemFoco2);
        const [fecharTrigger, setFecharTrigger] = useState(0);
        useEffect(()=>{
            switch(operacao){
                case "0":
                    setBtnSubmit("Selecione a operação");
                    break;
                case "1":
                    setBackground(cores.corAdicionar);
                    setBtnSubmit("Adicionar");
                    break;
                case "2":
                    setBackground(cores.corEditar);
                    setBtnSubmit("Atualizar");
                    break;
                case "3":
                    setBackground(cores.corDeletar);
                    setBtnSubmit("Excluir");
                    break;
            }
        }, [operacao])
        if (!item) return null;

            const buscarCep = async(cep) => {
            const cepLimpo = cep.replace(/\D/g, "");
            if (cepLimpo.length === 8){
                try{
                    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                    const dados = await resposta.json();

                    if (!dados.erro){
                        setObjeto({
                            logradouro: dados.logradouro,
                            cidade: dados.localidade,
                            estado: dados.uf,
                        });
                        console.log(dados);
                    } else {
                        alert("CEP não encontrado.")
                    }
                }
                catch(error){
                    console.error("Erro ao buscar o CEP: ", error);
                    alert("Erro ao buscar o CEP.")
                }
            }
        };

        useEffect(() => {
            if (operacao === "0") {
                setOperacao("1"); // Força para modo Adicionar no início
            }
        }, [operacao, setOperacao]);


        return (
            <>
                {(item.tabela?.mostrar ?? false) && (
                    <ExibirTabelaConsulta 
                        tabela={item.view ?? item.tabela} 
                        setOperacao={setOperacao} 
                        setObjeto={setObjeto} 
                        fecharColapse={() => setFecharTrigger(prev=>prev+1)}
                        triggerFechar={fecharTrigger}
                    ></ExibirTabelaConsulta>
                )}

                {Object.entries(item.campos).map(([nome, campo]) =>{
                        if ((campo.mostrar ?? true )&& campo.campo == "input"){
                            // Esconde a chave primária de formulários, mas a mantém no objeto no backend para edição funcionar
                            if (nome === item.tabela?.lista?.[0] || campo.nome === item.tabela?.lista?.[0]) return null;

                            switch(campo.nome){
                                case "cep":
                                    return(
                                        <CriarInput key={nome} nomeCampo={nome} campo={campo} objeto={objeto}
                                        setFuncao={async (e, nomeCampo) => {
                                            // Atualiza o valor do campo CEP normalmente
                                            setFuncao(e, nomeCampo);
                                            
                                            const valorCep = e.target.value.replace(/\D/g, "");
                                            if (valorCep.length === 8) {
                                                try {
                                                    const resp = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`);
                                                    const dados = await resp.json();
                                                    if (!dados.erro) {
                                                        // Preenche automaticamente os campos relacionados
                                                        setFuncao({ target: { name: "logradouro", value: dados.logradouro } }, "logradouro");
                                                        setFuncao({ target: { name: "cidade", value: dados.localidade } }, "cidade");
                                                        setFuncao({ target: { name: "estado", value: dados.uf } }, "estado");
                                                    }
                                                } catch (err) {
                                                    console.error("Erro ao buscar CEP:", err);
                                                }
                                            }
                                        }}
                                        operacao={operacao}
                                        />
                                    )
                                                                
                                case 'nome':
                                    return(
                                        <CriarInput autoFocus key={nome} nomeCampo={nome} campo={campo} objeto={objeto} setFuncao={setFuncao} operacao={operacao} />        
                                    )
                                
                                case 'imagem':
                                    return (
                                    <CriarInputImagemCrop
                                        key={nome}
                                        nomeCampo={nome}
                                        campo={campo}
                                        objeto={objeto}
                                        setFuncao={setFuncao}
                                    />
                                    );
                                case 'dia_da_semana':
                                    const diasSemana = [
                                        { valor: "1", nome: "Dom", titulo: "Domingo" },
                                        { valor: "2", nome: "Seg", titulo: "Segunda-feira" },
                                        { valor: "3", nome: "Ter", titulo: "Terça-feira" },
                                        { valor: "4", nome: "Qua", titulo: "Quarta-feira" },
                                        { valor: "5", nome: "Qui", titulo: "Quinta-feira" },
                                        { valor: "6", nome: "Sex", titulo: "Sexta-feira" },
                                        { valor: "7", nome: "Sáb", titulo: "Sábado" },
                                    ];
                                    const valorAtual = String(objeto?.dia_da_semana ?? "0");
                                    return(
                                        <GridArea $area={'dia_da_semana'}>
                                            <Label>Dia da semana:<IconeObrigatorio required={campo.required} /></Label>
                                            <div style={{display: 'flex', gap: '5px', overflowX: 'auto', alignItems: 'center'}}>
                                                {diasSemana.map((dia) => (
                                                    <button 
                                                        key={dia.valor} 
                                                        type="button"
                                                        title={dia.titulo}
                                                        onClick={() => setFuncao({target: {name: "dia_da_semana", value: dia.valor}}, "dia_da_semana")}
                                                        style={{
                                                            flex: 1,
                                                            padding: '10px 4px',
                                                            borderRadius: '5px',
                                                            border: valorAtual === dia.valor ? `2px solid ${cores.corWhite}` : '1px solid transparent',
                                                            backgroundColor: valorAtual === dia.valor ? cores.corHover : cores.backgroundBotaoSemFoco,
                                                            color: cores.corTexto,
                                                            cursor: 'pointer',
                                                            fontWeight: valorAtual === dia.valor ? 'bold' : 'normal',
                                                            transition: 'all 0.2s',
                                                            minWidth: '40px'
                                                        }}
                                                    >
                                                        {dia.nome}
                                                    </button>
                                                ))}
                                            </div>
                                        </GridArea>
                                    )

                            }
                            return (
                                <CriarInput key={nome} nomeCampo={nome} campo={campo} objeto={objeto} setFuncao={setFuncao} operacao={operacao} />
                            )
                        }
                        
                        if ((campo.mostrar ?? true )&& campo.campo =="select"){
                            return(
                                <CriarSelect key={nome}
                                nomeCampo={nome}
                                campo={campo}
                                visualizar={campo.visualizar?? campo.lista}
                                condicao={campo.condicao ?? null}
                                setFuncao={setFuncao}
                                objeto={objeto} />
                            )
                        }
                        return null;
                    })
                }       
                    {children}
                        <GridArea $area="reset">
                            <Button $bgcolor={cores.backgroundBotaoSemFoco} type="button" onClick={() => {
                                setOperacao("1");
                                if (setObjeto && item.campos) {
                                    const objInicial = Object.fromEntries(
                                        Object.entries(item.campos).map(([k, v]) => [k, v.valor])
                                    );
                                    setObjeto(objInicial);
                                }
                            }}>Limpar / Novo</Button>   
                        </GridArea>
                        <GridArea $area="botoes">
                            <Button disabled={operacao=="0"} $bgcolor={backgroundBotao}>{btnSubmit}</Button>   
                        </GridArea>
            </>
        )
        
    };

    export default CriarCamposFormulario;

