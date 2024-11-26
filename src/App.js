import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Pesquisa from "./components/Pesquisa";
import './App.css'
import RecuperarSenha from "./components/RecuperarSenha";
import Slide from "./components/Slide";

import terreo from "./components/Plantas/TERREO_PAVIMENTO.png";
import primeiro_pavimento from "./components/Plantas/PRIMEIRO_PAVIMENTO.png";
import segundo_pavimento from "./components/Plantas/SEGUNDO_PAVIMENTO.png";
import terceiro_pavimento from "./components/Plantas/TERCEIRO_PAVIMENTO.png";
const imagens = [terreo, primeiro_pavimento, segundo_pavimento, terceiro_pavimento];

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="corpo">
            <Header/>
            <Pesquisa/>
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
        <Route path="/cadastro" element={<Cadastro/>}/>
        <Route path="/slide" element={<Slide/>}/>

      </Routes>
    </Router>
  );
}

export default App;