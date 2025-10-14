import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import useBancoDeDados from "../BdCrudSupabase";
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas"
import { use } from "react";


const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: /* VERIFICAR OS NOMES DAS AREAS NO ARQUIVO BdObjeto */
    "tabela tabela tabela"
    "operacao operacao id"
    "empresa_id empresa_id valor"
    "inicio tempo_contrato_meses renovacao"
    "qtd_comodos qtd_produtos qtd_usuarios"
    ". reset botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "tabela"
        "operacao"
        "id"
        "nome"
        "empresa_id"
        "valor"
        "inicio"
        "tempo_contrato_meses"
        "renovacao"
        "qtd_comodos"
        "qtd_produtos"
        "qtd_usuarios"
        "reset"
        "botoes";
}
`;

function CadastroContratos({usuarioLogado}) {
    const tabela = mapa.contratos_empresas;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id"?usuarioLogado.empresa_id:v.valor]))
        )
    );
    const alterarCampo = (valor, campo) => {
        setObjeto((prev) => ({ ...prev, [campo]: valor }))
    }
      const [operacao, setOperacao] = useState("0");
    useEffect(()=>{
        console.log(objeto);
        if (objeto.inicio && objeto.tempo_contrato_meses) {
            const dataInicio = new Date(objeto.inicio);
            const meses = parseInt(objeto.tempo_contrato_meses);
            const dataRenovacao = new Date(dataInicio.setMonth(dataInicio.getMonth() + parseInt(objeto.tempo_contrato_meses)));
            const ano = dataRenovacao.getFullYear();
            const mesesRenovacao = String(dataRenovacao.getMonth() + 1).padStart(2, '0');
            const dia = String(dataRenovacao.getDate()).padStart(2, '0');
            const dataFormatada = `${ano}-${mesesRenovacao}-${dia}`;
            alterarCampo(dataFormatada, "renovacao");
        } 
    }, [objeto.inicio, objeto.tempo_contrato_meses])
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

return(
    <Box>
                <Title>Cadastro Contratos</Title>
                <FormGrid onSubmit={fazerEnvio}>

                    <CriarCamposFormulario 
                    item={tabela}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto ={objeto}
                    ></CriarCamposFormulario>

                    
                </FormGrid>
            </Box>
    )
}

export default CadastroContratos;
