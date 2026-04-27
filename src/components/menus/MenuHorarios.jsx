import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import Input from "../SubInput";
import Label from "../SubLabel";
import GridArea from "../SubGridArea";
import useBancoDeDados from "../BdCrudSupabase";

import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas";

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "operacao operacao id"
    "ano semestre semestre"
    "hora_inicio duracao hora_termino"
    "empresa_id empresa_id empresa_id"
    ". reset botoes";

@media (max-width: 768px) {
    display: flex;
    flex-direction: column;
}
`;

function adicionarTempo(horario, horas = 0, minutos = 0, segundos = 0) {
    if(!horario) return "";
    const split = horario.split(":");
    if(split.length < 2) return horario;
    const h = Number(split[0]);
    const m = Number(split[1]);
    const s = split[2] ? Number(split[2]) : 0;
    
    let data = new Date();
    data.setHours(h + horas, m + minutos, s + segundos);

    return data.toTimeString().slice(0, 5); // Retorna HH:MM
}

function ConfigurarHorarios({usuarioLogado}) {
    const tabela = mapa.horarios;
    const ano_atual = new Date().getFullYear();
    const mes_atual = new Date().getMonth() + 1;
    const semestre_atual = mes_atual <= 6 ? 1 : 2;

    const [objeto, setObjeto] = useState({
        ...Object.fromEntries(Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id"? usuarioLogado?.empresa_id : v.valor]))),
        ano: ano_atual,
        semestre: semestre_atual
    });
    const [operacao, setOperacao] = useState("0");
    const [duracao, setDuracao] = useState(50);
    
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

    useEffect(() => {
        if(objeto.hora_inicio && duracao > 0) {
            setObjeto((prev) => ({ ...prev, ['hora_termino']: adicionarTempo(objeto.hora_inicio, 0, duracao, 0)}));
        }
    }, [objeto.hora_inicio, duracao]);

    return(
        <Box>
            <Title>Cadastrar Horários</Title>
            <FormGrid onSubmit={fazerEnvio}>

                <CriarCamposFormulario 
                    item={tabela}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto={objeto}
                    setObjeto={setObjeto}
                >
                    <GridArea $area="duracao">
                        <Label htmlFor="duracao">Duração (min):</Label>
                        <Input type="number" id="duracao" name="duracao" value={duracao} onChange={(e) =>setDuracao(Number(e.target.value))} />
                    </GridArea>
                </CriarCamposFormulario>
                
            </FormGrid>
        </Box>
    )
}

export default ConfigurarHorarios;