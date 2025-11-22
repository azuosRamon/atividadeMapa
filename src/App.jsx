import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./components/pages/PaginaLogin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Pesquisa from "./components/Pesquisa";
import LayoutLogado from "./LayoutLogado";
import RotaProtegida from "./components/FcRotaProtegida";
import './App.css'
import RecuperarSenha from "./components/pages/PaginaRecuperarSenha";
import RedefinirSenha from "./components/pages/PaginaRedefinirSenha";
import Slide from "./components/Slide";
import BotaoFlutuante from "./components/SubButtonFlutuante";
import MenuCadastro from "./components/menus/MenuCadastro";
import MenuHorarios from "./components/menus/MenuHorarios";
import Perfil from "./components/menus/MenuPerfil";
import ConfigurarCursos from "./components/menus/MenuCursos";
import MenuDisciplinas from "./components/menus/MenuDisciplinas";
import MenuEdificios from "./components/menus/MenuEdificio";
import MenuQuadroAulas from "./components/menus/MenuQuadroAulas";
import CadastrarDisponibilidade from "./components/menus/MenuDisponibilidade";
import Tabelas from "./components/menus/MenuTabelas";
import CadastrarEmpresa from "./components/menus/MenuEmpresas";
import CadastrarFuncao from "./components/menus/MenuFuncoes";
import CadastrarCargos from "./components/menus/MenuCargos";
import CadastrarAreas from "./components/menus/MenuTipoArea";
import CadastroModelos from "./components/menus/MenuModelos";
import CadastroContratos from "./components/menus/MenuContratos";
import RelacionarUsuarios from "./components/menus/MenuRelacionarUsuarios";
import { AuthProvider } from "./components/AuthProvider";

import terreo from "./components/Plantas/TERREO_PAVIMENTO.png";
import primeiro_pavimento from "./components/Plantas/PRIMEIRO_PAVIMENTO.png";
import segundo_pavimento from "./components/Plantas/SEGUNDO_PAVIMENTO.png";
import terceiro_pavimento from "./components/Plantas/TERCEIRO_PAVIMENTO.png";
import LerDados from "./components/BdLerTabela";
import Modal from "./components/SubModal";
import ObserverEmail from "./components/ObserverEmail";
const imagens = [terreo, primeiro_pavimento, segundo_pavimento, terceiro_pavimento];
const data = [
  { id:0, nome: "Carlos", sobrenome: "Silva", telefone: "21912341234",nascimento:"2025-03-24", email:"carlossilva@mail.com", cpf: "111.222.333-44", matricula:"202411122", funcao: "Administrador", foto: "", senha: "admin"},
  { nome: "Ana", funcao: "Secretaria", foto: "" },
  { nome: "Maria", funcao: "Professor", foto: "" },
]; 

const dadosJson = {
  "cliente": [
    {"nome": "Universidade de Vassouras", "logo": "img", "cor1": "#6d1d20", "cor2":""}
  ],
  "horarios":[
        { "id": 1, "ano": 2024, "semestre": 2, "inicio": "18:50", "termino": "19:40" },
        { "id": 2, "ano": 2024, "semestre": 2, "inicio": "19:40", "termino": "20:30" },
        { "id": 3, "ano": 2024, "semestre": 2, "inicio": "20:30", "termino": "21:20" },
        { "id": 5, "ano": 2025, "semestre": 1, "inicio": "19:40", "termino": "20:30" },
        { "id": 6, "ano": 2025, "semestre": 1, "inicio": "20:30", "termino": "21:20" },
        { "id": 7, "ano": 2025, "semestre": 1, "inicio": "18:50", "termino": "19:40" },
        { "id": 8, "ano": 2025, "semestre": 1, "inicio": "19:40", "termino": "20:30" },
        { "id": 9, "ano": 2025, "semestre": 1, "inicio": "20:30", "termino": "21:20" },
        { "id": 10, "ano": 2025, "semestre": 1, "inicio": "21:20", "termino": "22:10" },
    ],
  "usuarios": [
    {"id":0, "nome": "Carlos", "sobrenome": "Silva", "telefone": "21912341234","nascimento":"2025-03-24", "email":"carlossilva@mail.com", "cpf": "111.222.333-44", "matricula":"202411122", "funcao": "Administrador", "foto": "", "senha": "admin"},
    {"id":1, "nome": "Tereza", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":2, "nome": "Maria", "sobrenome": "Antunes", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":3, "nome": "Renato", "sobrenome": "Sodre", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":4, "nome": "Mauricio", "sobrenome": "Antonio", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":5, "nome": "Vanderlei", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":6, "nome": "Vanderleia", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":7, "nome": "Suelen", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":8, "nome": "Andre", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":9, "nome": "Mario", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
  ],
  "pessoas": [
    {"usuario_id":0, "nome": "Carlos", "sobrenome": "Silva", "telefone": "21912341234","nascimento":"2025-03-24", "email":"carlossilva@mail.com", "cpf": "111.222.333-44", "matricula":2024, "funcao": "Administrador", "foto": "", "senha": "admin", "cargo": "Coordenador", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":1, "nome": "Tereza", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"2026", "funcao": "Professor", "foto": "", "senha": "professor", "cargo": "professor", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":2, "nome": "Maria", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"2027", "funcao": "Professor", "foto": "", "senha": "professor", "cargo": "professor", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":3, "nome": "Renato", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"2028", "funcao": "Professor", "foto": "", "senha": "professor", "cargo": "professor", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":4, "nome": "Mauricio", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"2029", "funcao": "Professor", "foto": "", "senha": "professor", "cargo": "professor", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":5, "nome": "Vanderlei", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"2030", "funcao": "Professor", "foto": "", "senha": "professor", "cargo": "professor", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":6, "nome": "Vanderleia", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"2031", "funcao": "Professor", "foto": "", "senha": "professor", "cargo": "professor", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":7, "nome": "Suelen", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"2032", "funcao": "Professor", "foto": "", "senha": "professor", "cargo": "professor", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":8, "nome": "Andre", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"2033", "funcao": "Professor", "foto": "", "senha": "professor", "cargo": "professor", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":9, "nome": "Mario", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"2034", "funcao": "Professor", "foto": "", "senha": "professor", "cargo": "professor", "informacoes_publicas": 1, "empresa_id": 0 },
    {"usuario_id":10, "nome": "ramon", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"ramon@mail.com", "cpf": "111.222.333-44", "matricula":"1999", "funcao": "moderador", "foto": "", "senha": "1234", "cargo": "Gerente", "informacoes_publicas": 1, "empresa_id": 1 },
    {"usuario_id":10, "nome": "Andre", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"andre@mail.com", "cpf": "111.222.333-44", "matricula":"2025", "funcao": "moderadorSite", "foto": "", "senha": "admin", "cargo": "FrontEnd", "informacoes_publicas": 1, "empresa_id": 1 },
  ],
  "campus":[
      { "id": 1, "nome": "Campus I", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "rodoviaria" },
      /*{ "id": 2, "nome": "Campus II", "cidade": "Maricá", "estado" : "RJ", "cep": "24900000", "logradouro": "Avenida Roberto Silveira", "complemento": "quadra" },
      { "id": 3, "nome": "Campus III", "cidade": "Vassouras", "estado" : "RJ", "cep": "27700000", "logradouro": "Av. Expedicionário Oswaldo de Almeida Ramos", "complemento": "280" }*/
  ],
  "blocos":[
      { "id": 1, "nome": "A", "imagem": "caminho/a.png", "campusId" : 1},
      { "id": 2, "nome": "A", "imagem": "caminho/a.png", "campusId" : 2},
      { "id": 3, "nome": "B", "imagem": "caminho/a.png", "campusId" : 2},
      { "id": 4, "nome": "C", "imagem": "caminho/a.png", "campusId" : 2}
  ],
  "pavimentos":[
      { "id": 1, "numero": 1, "imagem": "caminho/a.png", "blocoId" : 1},
      { "id": 2, "numero": 2, "imagem": "caminho/b.png", "blocoId" : 1},
      { "id": 3, "numero": 3, "imagem": "caminho/c.png", "blocoId" : 1},
      { "id": 4, "numero": 4, "imagem": "caminho/d.png", "blocoId" : 1}

  ],
  "salas":[
      {"id": 1, "numero": 1, "apelido": "Lab. Anatômico Geral","imagem": "001", "pavimentoId": 1, "area": "[]"},
      {"id": 2, "numero": 2, "apelido": "Lab. Anatômico Veterinário", "imagem": "002", "pavimentoId": 1, "area": "[]"},
      {"id": 3, "numero": 3, "apelido": "Lab. Sala de Preparo", "imagem": "003", "pavimentoId": 1, "area": "[]"},
      {"id": 4, "numero": 4, "apelido": "Lab. Microbiologia","imagem": "004", "pavimentoId": 1, "area": "[]"},
      {"id": 5, "numero": 5, "apelido": "Lab. Biologia","imagem": "005", "pavimentoId": 1, "area": "[]"},
      {"id": 6, "numero": 6, "apelido": "Lab. Mecânica dos solos","imagem": "006", "pavimentoId": 1, "area": "[]"},
      {"id": 7, "numero": 7, "apelido": "Lab. Tecnicas construtivas","imagem": "007", "pavimentoId": 1, "area": "[[1927,1097],[2523,1094],[2571,1816],[2423,1816],[2423,1679],[1925,1683]]"},
      {"id": 8, "numero": 8, "apelido": "Lab. Elétrica","imagem": "008", "pavimentoId": 1, "area": "[[1927,1700],[2403,1700],[2402,1832],[2569,1833],[2593,2192],[1930,2193]]"},
      {"id": 9, "numero": 10, "apelido": "","imagem": "110", "pavimentoId": 2, "area": "[]"},
      {"id": 10, "numero": 11, "apelido": "","imagem": "111", "pavimentoId": 2, "area": "[]"},
      {"id": 11, "numero": 12, "apelido": "","imagem": "112", "pavimentoId": 2, "area": "[]"},
      {"id": 12, "numero": 14, "apelido": "","imagem": "114", "pavimentoId": 2, "area": "[]"},
      {"id": 13, "numero": 15, "apelido": "","imagem": "115", "pavimentoId": 2, "area": "[]"},
      {"id": 14, "numero": 16, "apelido": "","imagem": "116", "pavimentoId": 2, "area": "[]"},
      {"id": 15, "numero": 17, "apelido": "","imagem": "117", "pavimentoId": 2, "area": "[]"},
      {"id": 16, "numero": 18, "apelido": "Lab. Informática 01","imagem": "201", "pavimentoId": 3, "area": "[]"},
      {"id": 17, "numero": 19, "apelido": "Lab. Informática 02","imagem": "202", "pavimentoId": 3, "area": "[]"},
      {"id": 18, "numero": 20, "apelido": "Lab. Informática 03","imagem": "203", "pavimentoId": 3, "area": "[]"},
      {"id": 19, "numero": 21, "apelido": "Lab. Informática 04","imagem": "204", "pavimentoId": 3, "area": "[]"},
      {"id": 20, "numero": 22, "apelido": "","imagem": "222", "pavimentoId": 3, "area": "[]"},
      {"id": 21, "numero": 23, "apelido": "","imagem": "223", "pavimentoId": 3, "area": "[]"},
      {"id": 22, "numero": 24, "apelido": "","imagem": "224", "pavimentoId": 3, "area": "[]"},
      {"id": 23, "numero": 25, "apelido": "","imagem": "225", "pavimentoId": 3, "area": "[]"},
      {"id": 24, "numero": 26, "apelido": "","imagem": "226", "pavimentoId": 3, "area": "[]"},
      {"id": 25, "numero": 27, "apelido": "","imagem": "227", "pavimentoId": 3, "area": "[]"},
      {"id": 26, "numero": 28, "apelido": "","imagem": "228", "pavimentoId": 3, "area": "[]"},
      {"id": 27, "numero": 29, "apelido": "Lab. de Química","imagem": "329", "pavimentoId": 4, "area": "[]"},
      {"id": 28, "numero": 30, "apelido": "Lab. Anatomia Palpatória","imagem": "330", "pavimentoId": 4, "area": "[]"},
      {"id": 29, "numero": 31, "apelido": "Lab. de Antropometria","imagem": "331", "pavimentoId": 4, "area": "[]"},
      {"id": 30, "numero": 32, "apelido": "Lab. Técnicas dietéticas","imagem": "332", "pavimentoId": 4, "area": "[]"},
      {"id": 31, "numero": 34, "apelido": "","imagem": "334", "pavimentoId": 4, "area": "[]"},
      {"id": 32, "numero": 35, "apelido": "","imagem": "335", "pavimentoId": 4, "area": "[]"},
      {"id": 33, "numero": 36, "apelido": "","imagem": "336", "pavimentoId": 4, "area": "[]"},
      {"id": 34, "numero": 37, "apelido": "","imagem": "337", "pavimentoId": 4, "area": "[]"},
      {"id": 35, "numero": 38, "apelido": "","imagem": "338", "pavimentoId": 4, "area": "[]"},
      {"id": 36, "numero": 39, "apelido": "","imagem": "339", "pavimentoId": 4, "area": "[]"},

  ],
  "cursos":[
        { "id": 1, "nome": "Engenharia Civil"},
        { "id": 2, "nome": "Engenharia de Software"},
        { "id": 3, "nome": "Engenharia Ambiental"},
        { "id": 4, "nome": "Arquitetura"},
        { "id": 5, "nome": "Engenharia de Petróleo e Gás"},
        { "id": 6, "nome": "Engenharia Elétrica"},
        { "id": 7, "nome": "Engenharia de Telecomunicações"},
        { "id": 8, "nome": "Engenharia Alimentos"},
    ],
    "disciplinas":[
        { "id": 1, "nome": "Empreendedorismo e inovação"},
        { "id": 2, "nome": "Banco de Dados Relacionais"},
        { "id": 3, "nome": "Estrutura de Dados Avançados"},
        { "id": 4, "nome": "Gestão Ambiental e Desenvolvimento Sustentável"},
        { "id": 5, "nome": "Infraestrutura de TI"},
        { "id": 6, "nome": "Interface Humano-Computador"},
        { "id": 7, "nome": "Práticas Extensionistas Integradoras IV"},
        { "id": 8, "nome": "Processo de Desenvolvimento de Software"},
    ],
    "dias":[
        { "id": 1, "nome": "Domingo"},
        { "id": 2, "nome": "Segunda Feira"},
        { "id": 3, "nome": "Terça Feira"},
        { "id": 4, "nome": "Quarta Feira"},
        { "id": 5, "nome": "Quinta Feira"},
        { "id": 6, "nome": "Sexta Feira"},
        { "id": 7, "nome": "Sábado"}
    ],
    "quadroDeAulas":[
      { "id": 1, "disciplinaId": 1, "cursoId":1, "pessoasId":1, "diaSemana":7, "inicioId":1,"terminoId": 1, "campusId":1, "blocoId":1, "pavimentoId":1,"salaId": 1},
      { "id": 2, "disciplinaId": 2, "cursoId":2, "pessoasId":2, "diaSemana":2, "inicioId":2,"terminoId": 2, "campusId":1, "blocoId":1, "pavimentoId":1,"salaId": 2},
      { "id": 3, "disciplinaId": 3, "cursoId":1, "pessoasId":3, "diaSemana":3, "inicioId":3,"terminoId": 3, "campusId":1, "blocoId":1, "pavimentoId":2,"salaId": 10},
      { "id": 4, "disciplinaId": 4, "cursoId":4, "pessoasId":4, "diaSemana":4, "inicioId":5,"terminoId": 6, "campusId":1, "blocoId":1, "pavimentoId":3,"salaId": 18},
      { "id": 5, "disciplinaId": 5, "cursoId":3, "pessoasId":5, "diaSemana":5, "inicioId":6,"terminoId": 8, "campusId":1, "blocoId":1, "pavimentoId":1,"salaId": 3},
      { "id": 6, "disciplinaId": 1, "cursoId":2, "pessoasId":6, "diaSemana":7, "inicioId":6,"terminoId": 8, "campusId":1, "blocoId":1, "pavimentoId":1,"salaId": 13},
      { "id": 7, "disciplinaId": 2, "cursoId":1, "pessoasId":7, "diaSemana":2, "inicioId":5,"terminoId": 8, "campusId":1, "blocoId":1, "pavimentoId":2,"salaId": 20},
      { "id": 8, "disciplinaId": 3, "cursoId":2, "pessoasId":8, "diaSemana":3, "inicioId":6,"terminoId": 8, "campusId":1, "blocoId":1, "pavimentoId":3,"salaId": 34},
      { "id": 9, "disciplinaId": 1, "cursoId":2, "pessoasId":9, "diaSemana":4, "inicioId":1,"terminoId": 1, "campusId":1, "blocoId":1, "pavimentoId":1,"salaId": 6},
      { "id": 10, "disciplinaId": 1, "cursoId":2, "pessoasId":1, "diaSemana":5, "inicioId":1,"terminoId": 3, "campusId":1, "blocoId":1, "pavimentoId":1,"salaId": 6}
    ]
}


function App() {
  // Componente interno para redirecionar quando o Supabase enviar tokens/erros para a raiz
  function RootRedirector() {
    const navigate = useNavigate();
    useEffect(() => {
      const search = window.location.search || '';
      const hash = window.location.hash || '';
      // se houver token, error ou otp_expired, encaminha para /redefinir-senha preservando query/hash
      if (search.includes('token=') || hash.includes('access_token') || search.includes('error=') || hash.includes('error=')) {
        const suffix = (search || hash) + '';
        // navigate preservando o hash/query conforme recebido
        const target = '/redefinir-senha' + suffix;
        navigate(target, { replace: true });
      }
    }, [navigate]);
    return null;
  }
  const capturarUsuarioLogadoLocalStorage = () => {
        let usuario = localStorage.getItem("usuario");
        if (!usuario) return null;
        try {
            let parsedUsuario = JSON.parse(usuario);
            return parsedUsuario
        } catch (error){
            console.log(error);
            return null;
        }
    }
  const [usuarioLogadoDados, setUsuario] = useState(capturarUsuarioLogadoLocalStorage());
  //console.log(usuarioLogadoDados);
  return(
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={
          <div className="corpo">
            <RootRedirector />
            <Header/>
            <Pesquisa dados={dadosJson} key={1}/>
            <Slide
              lista_imagens={imagens}
              pagina_inicio={0}
            />
            <Footer/>
          </div>
          }/>
        <Route path="/login" element={
          <div className="corpo">
            <Header/>
            <Login dados={dadosJson}/>
            <Footer/>
          </div>
        }/>
        <Route path="/RecuperarSenha" element={
          <div className="corpo">
            <Header/>
            <RecuperarSenha/>
            <Footer/>
          </div>
        }/>
        <Route path="/redefinir-senha" element={
          <div className="corpo">
            <Header/>
            <RedefinirSenha/>
            <Footer/>
          </div>
        }/>
        <Route path="/dashboard" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={data} usuarioId={0}><Slide dados={dadosJson} lista_imagens={imagens} pagina_inicio={0}/></LayoutLogado>
          </RotaProtegida>
      }/>
        <Route path="/editarPerfil" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><Perfil/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/periodoHorarios" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><MenuHorarios tableHorarios={dadosJson.horarios}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/edificio" element={
          <RotaProtegida>
            
            <LayoutLogado usuarioDados={usuarioLogadoDados}><MenuEdificios usuarioLogado={usuarioLogadoDados} dados={dadosJson}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/categorias" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><ConfigurarCursos usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/produtos" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><MenuDisciplinas usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/pesquisarDados" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><Tabelas dados={dadosJson}/><pesquisarDados/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/quadroAulas" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><MenuQuadroAulas usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/cadastroUsuario" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><MenuCadastro usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/cadastroEmpresas" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><CadastrarEmpresa/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/funcoes" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><CadastrarFuncao/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/cargos" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><CadastrarCargos usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/tiposAreas" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><CadastrarAreas usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/modelos" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><CadastroModelos usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/cadastroContrato" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><CadastroContratos usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/cadastrarDisponibilidade" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><CadastrarDisponibilidade usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/relacionarUsuarios" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><RelacionarUsuarios usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
          </RotaProtegida>
        }/>
        <Route path="/slide" element={
          <RotaProtegida>
          <Slide
            lista_imagens={imagens}
            pagina_inicio={0}
            dados={dadosJson}
            capturarCoordenadas = {true}
            />
            </RotaProtegida>
          }/>

      </Routes>
      </AuthProvider>
      <BotaoFlutuante/>
      <ObserverEmail />
    </Router>
  );
}

export default App;