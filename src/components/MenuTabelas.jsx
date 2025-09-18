import React, { useState } from "react";
import Box from "./SubBox";
import Select from "./SubSelect";
import Label from "./SubLabel";
import TabelaCompleta from "./SubTabela";
import Colapse from "./SubColapse";



function ConfigurarEdificio({ dados }) {
    const data = dados || {};
    const [operacao, setOperacao] = useState(0);
    const selecionarDados = [
        [data.campus,["id", "nome", "cidade", "logradouro"]],
        [data.blocos,["id", "nome", "campusId"]],
        [data.pavimentos,["id", "numero", "blocoId"]],
        [data.pessoas,["id", "nome", "sobrenome", "funcao"]],
        [data.horarios,["id", "ano", "semestre", "inicio", "termino"]],
        [data.salas,["id", "numero", "apelido","pavimentoId"]],
        [data.cursos,["id", "nome"]],
        [data.quadroDeAulas,["id", "disciplinaId", "cursoId", "pessoasId", "diaSemana"]]
    ]
    return(
            <Box>
                <div>
                    <Label htmlFor="operacao">Selecione a tabela a visualizar:</Label>
                        <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(Number(e.target.value))}}>
                            {selecionarDados.map((_, idx) => (
                                <option key={idx} value={idx}>
                                    {["Campus", "Blocos", "Pavimentos","Pessoas", "Horarios", "Salas", "Cursos", "Quadro de Aulas"][idx]}
                                </option>
                                ))}
                        </Select>
                    <TabelaCompleta key={operacao} dados={selecionarDados[operacao][0]} lista={selecionarDados[operacao][1]} exportar = {true}></TabelaCompleta>
                </div>

            </Box>
    )
}

export default ConfigurarEdificio;