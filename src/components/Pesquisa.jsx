import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CriarCard from "./Card";
import Box from "./SubBox";
import Button from "./SubButton";
import Input from "./SubInput";
import Select from "./SubSelect";
import Container from "./SubContainer";
import logo_cliente from "../components/assets/UniVassouras-Vertical-Branca.png"
import { MdHeight } from "react-icons/md";
import InputAutocomplete from "./SubInputAutocomplete";
import cores from "./Cores";

const Title = styled.h2`
margin: 0 0 20px;
color: white;
`;

const Formulario = styled.form`
    gap: 0 10px;
    display: grid;
    grid-template-columns: 1fr;
    @media (min-width: 481px) and (max-width: 968px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const Modal = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: fixed;
    z-index: 999;
    overflow: auto;
    background-color: #222;
    border-radius: 5px;
    padding: 40px 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.8);
    max-height: 80%;
    `;
const ContainerModal = styled.div`
    display: ${(props)=>(props.$aberto ? "flex": "none")};
    ${(props)=>(props.$aberto ? "align-content: center; justify-content: center;    align-items: center;": '')}
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 997;
    top: 0;
    left: 0;
`;
const BackgroundModal = styled.div`
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 998;
    top: 0;
    left: 0;
`;

const CardsContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props)=>((props.$quantidade > 1 ) ? "repeat(3, 1fr)" : "1fr")};
    max-width: 90%;
    gap: 10px;
    align-items: center;
    align-content: center;
    justify-content: center;
    
    @media (max-width: 960px) {
        grid-template-columns: ${(props)=>((props.$quantidade > 1 ) ? "repeat(2, 1fr)" : "1fr")};

    }
    @media (max-width: 767px) {
        grid-template-columns: ${(props)=>((props.$quantidade > 1 ) ? "repeat(1, 1fr)" : "1fr")};

    }
`;

const Img = styled.img`
height: 100px;
margin: 15px auto;
`;

const Ul = styled.ul`
position: absolute;
top: 100%;
left: 0;
right: 0;
zIndex: 1000;
background: white;
color: black;
listStyle: none;
padding: 0;
margin: 0;
border: 1px solid #ccc;
maxHeight: 150px;
overflowY: auto;
`;

const ButtonVoltar = styled(Button)`
height: 100%;
margin-top: 0;
`;

/*
const data = [
    { professor: "Carlos Silva", bloco: "1", andar: "2", sala: "12", materia: "Física para Engenharia", dia: "Segunda-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "Ana Souza", bloco: "1", andar: "3", sala: "03", materia: "Front End", dia: "Terça-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "João Pereira", bloco: "1", andar: "3", sala: "03", materia: "POO", dia: "Quarta-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "Maria Oliveira", bloco: "1", andar: "2", sala: "12", materia: "Práticas Extensionistas Integradoras III", dia: "Quinta-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "Pedro Santos", bloco: "1", andar: "3", sala: "03", materia: "Estrutura de Dados", dia: "Sexta-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "Lucia Costa", bloco: "1", andar: "2", sala: "12", materia: "Engenharia Econômica", dia: "Sabado", horario: "18:50 - 22:10", foto: "" }
]; 
*/

function converterDados(dados){
    const dadosCovertidos =  dados.quadroDeAulas.map((item) => (
        {
          "id": item.id, 
          "disciplina": dados.disciplinas.filter(informacoes => informacoes.id === item.disciplinaId)[0].nome, 
          "curso": dados.cursos.filter(informacoes => informacoes.id === item.cursoId)[0].nome, 
          "usuario": dados.usuarios.filter(informacoes => informacoes.id === item.pessoasId)[0].funcao + " - " +  dados.usuarios.filter(informacoes => informacoes.id === item.pessoasId)[0].nome + " " + dados.usuarios.filter(informacoes => informacoes.id === item.pessoasId)[0].sobrenome, 
          "diaSemana": dados.dias.filter(informacoes => informacoes.id === item.diaSemana)[0].nome, 
          "inicio": dados.horarios.filter(informacoes => informacoes.id === item.inicioId)[0].inicio,
          "termino": dados.horarios.filter(informacoes => informacoes.id === item.terminoId)[0].termino, 
          "campus":dados.campus.filter(informacoes => informacoes.id === item.campusId)[0].nome, 
            "bloco":dados.blocos.filter(informacoes => informacoes.id === item.blocoId)[0].nome, 
          "pavimento":dados.pavimentos.filter(informacoes => informacoes.id === item.pavimentoId)[0].numero,
          "sala": dados.salas.filter(informacoes => informacoes.id === item.salaId)[0].numero.toString() + " - " + dados.salas.filter(informacoes => informacoes.id === item.salaId)[0].apelido,
          "salaApelido": dados.salas.filter(informacoes => informacoes.id === item.salaId)[0].apelido,
          "ano": dados.horarios.filter(informacoes => informacoes.id === item.inicioId)[0].ano,
          "foto": dados.usuarios.filter(informacoes => informacoes.id === item.pessoasId)[0].foto
        }
    ));
    return dadosCovertidos;
}


function Pesquisa({dados}){
    const data = dados || {};
    const quadroDeAulasConvertido = converterDados(data);
    
    const ano_atual = new Date().getFullYear();
    const quadroAulasAnoAtual = quadroDeAulasConvertido.filter((item) => item.ano === ano_atual);
    
    const horariosAula = Array.from(new Set(quadroAulasAnoAtual.map((item)=>item.inicio)));
    
    
    const [resultadoPesquisa, confResultadoPesquisa] = useState([]);
    const professoresAula = Array.from(new Set(data.usuarios.map((item)=> item.funcao + " - " + item.nome + " " + item.sobrenome)));
    const [procurarProfessor, confProcurarProfessor] = useState("");
    
    const [procurarSala, confProcurarSala] = useState("");
    const [sala, confSala] = useState("");
    const salas = data.salas.map((item) => ((item.apelido.length>0) ? item.numero.toString() + " - " + item.apelido : item.numero.toString())) || [];
    
    const [procurarCurso, confProcurarCurso] = useState("");
    const cursos = Array.from(new Set(quadroAulasAnoAtual.map((item)=>item.curso))) || [];
    
    const [procurarDisciplina, confProcurarDisciplina] = useState("");
    const [materia, confMateria] = useState("");
    const disciplinas = Array.from(new Set(quadroAulasAnoAtual.map((dados)=>dados.disciplina))) || [];
    
    const [dia, confDia] = useState("0");
    const [horario, confHorario] = useState("");
    
    
    const [estadoModal, mudarEstadoModal] = useState(false);
    
   

    const cursosEDisciplinas = cursos.concat(disciplinas);


    const buscarResultados = (event) => {
        event.preventDefault();
        console.log(horario);
        
        confResultadoPesquisa(quadroAulasAnoAtual.filter(d =>

            (!procurarProfessor || d.usuario.toLowerCase().includes(procurarProfessor.toLowerCase())) &&
            (!procurarSala || d.sala.toString().toLowerCase().includes(procurarSala.toLocaleLowerCase())) &&
            (!procurarCurso || d.curso.toString().toLowerCase().includes(procurarCurso.toLocaleLowerCase()) || d.disciplina.toString().toLowerCase().includes(procurarCurso.toLocaleLowerCase()) ) && 
            (!dia || (Number(dia) > 0) ? (d.diaSemana === Number(dia)): d.diaSemana)  &&
            (!horario || d.inicio === horario)
        )
    )
        mudarEstadoModal(true);
    }

    useEffect(()=>{
        const apertouTecla = (event) =>  {
            if (event.key === "Escape") mudarEstadoModal(false);
        };
        
        document.addEventListener("keydown", apertouTecla);
        return () => document.removeEventListener("keydown", apertouTecla); 
    });

    return(
        <Container>
            <Box>
                <Img src={logo_cliente} alt="logo_universidade"/>
                <Formulario onSubmit={buscarResultados}>
                    <InputAutocomplete
                        sugestoes={professoresAula}
                        valor={procurarProfessor}
                        onChange={(val) => confProcurarProfessor(val)}       // Atualiza o valor enquanto digita
                        onSelecionar={(val) => confProcurarProfessor(val)}    // Atualiza ao selecionar
                        placeholder="Professor"
                        />
                        <InputAutocomplete
                        sugestoes={salas}
                        valor={procurarSala}
                        onChange={(val) => confProcurarSala(val)}       // Atualiza o valor enquanto digita
                        onSelecionar={(val) => confProcurarSala(val)}    // Atualiza ao selecionar
                        placeholder="Sala"
                        />
                        <InputAutocomplete
                        sugestoes={cursosEDisciplinas}
                        valor={procurarCurso}
                        onChange={(val) => confProcurarCurso(val)}       // Atualiza o valor enquanto digita
                        onSelecionar={(val) => confProcurarCurso(val)}    // Atualiza ao selecionar
                        placeholder="Curso ou disciplina"
                        />
                    
                    <Select id="dia" value={dia} name="dia" onChange={(e) => confDia(e.target.value)}>
                        <option key={0} value="0">Todos os dias</option>
                        <option key={1} value="1">Domingo</option>
                        <option key={2} value="2">Segunda Feira</option>
                        <option key={3} value="3">Terça Feira</option>
                        <option key={4} value="4">Quarta Feira</option>
                        <option key={5} value="5">Quinta Feira</option>
                        <option key={6} value="6">Sexta Feira</option>
                        <option key={7} value="7">Sábado</option>
                        </Select>
                    <Select 
                        value={horario}
                        onChange={(e) => confHorario(e.target.value)}
                    >
                        <option value={""}>Todas os horários</option>
                        {
                            horariosAula.map((item, indice)=>(
                                <option value={item}>{item}</option>
                            ))
                        }
                    </Select>
                    <Button $hovercolor={cores.cor3} $bgcolor={cores.corWhite} $fontColor={cores.corTextoEscuro} type="submit">Buscar</Button>
                </Formulario>
            </Box>
            <ContainerModal $aberto={estadoModal} >
                <BackgroundModal onClick={()=>mudarEstadoModal(false)}></BackgroundModal>
                <Modal>
                    <CardsContainer
                        $quantidade = {resultadoPesquisa.length}
                        >

                    {
                        resultadoPesquisa.map((item, indice)=>(
                            <CriarCard
                            dados = {data}
                            key = {indice}
                            fotoProfessor = {item.foto}
                            nome = {item.usuario}
                            disciplina = {item.disciplina}
                            dia = {item.diaSemana}
                            horarioInicial = {item.inicio}
                            horarioFinal = {item.termino}
                            campus = {item.campus}
                            bloco = {item.bloco}
                            pavimento = {item.pavimento}
                            sala = {item.sala}
                            />
                        ))
                    }
                    <ButtonVoltar $bgcolor="rgb(38, 38, 38)" onClick={()=>mudarEstadoModal(false)}>Voltar</ButtonVoltar>
                    </CardsContainer>
                </Modal>
                </ContainerModal>
        </Container>
    )
}
export default Pesquisa;
