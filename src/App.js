import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import Horarios from "./components/Horarios";
import Perfil from "./components/Perfil";
import Cursos from "./components/Curso";
import Usuario_logado from "./components/Usuario_logado";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Pesquisa from "./components/Pesquisa";
import LayoutLogado from "./LayoutLogado";
import './App.css'
import RecuperarSenha from "./components/RecuperarSenha";
import Slide from "./components/Slide";
import terreo from "./components/Plantas/TERREO_PAVIMENTO.png";
import primeiro_pavimento from "./components/Plantas/PRIMEIRO_PAVIMENTO.png";
import segundo_pavimento from "./components/Plantas/SEGUNDO_PAVIMENTO.png";
import terceiro_pavimento from "./components/Plantas/TERCEIRO_PAVIMENTO.png";
import styled from "styled-components";

const imagens = [terreo, primeiro_pavimento, segundo_pavimento, terceiro_pavimento];
const data = [
  { id:0, nome: "Carlos", sobrenome: "Silva", telefone: "21912341234",nascimento:"2025-03-24", email:"carlossilva@mail.com", cpf: "111.222.333-44", matricula:"202411122", funcao: "Administrador", foto: "", senha: "admin"},
  { nome: "Ana", funcao: "Secretaria", foto: "" },
  { nome: "Maria", funcao: "Professor", foto: "" },
]; 


function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="corpo">
            <Header/>
            <Pesquisa key={1}/>
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
            <Login/>
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
        <Route path="/logado" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><Slide lista_imagens={imagens} pagina_inicio={0}/></LayoutLogado>
      }/>
        <Route path="/editarPerfil" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><Perfil dados={data} usuarioId={0}/></LayoutLogado>
        }/>
        <Route path="/periodoHorarios" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><Horarios/></LayoutLogado>
        }/>
        <Route path="/edificio" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><Cadastro/></LayoutLogado>
        }/>
        <Route path="/cursos" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><Cursos/></LayoutLogado>
        }/>
        <Route path="/disciplinas" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><Cadastro/></LayoutLogado>
        }/>
        <Route path="/professores" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><Cadastro/></LayoutLogado>
        }/>
        <Route path="/quadroAulas" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><Cadastro/></LayoutLogado>
        }/>
        <Route path="/cadastro" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><Cadastro/></LayoutLogado>
        }/>
        <Route path="/slide" element={<Slide/>}/>

      </Routes>
    </Router>
  );
}

export default App;