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
import VisualizarAgendaSemanal from "./components/menus/MenuAgendaSemanal";
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




const data = []; 

const dadosJson = {
  "cliente": [],
  "horarios":[],
  "usuarios": [],
  "pessoas": [],
  "campus":[],
  "blocos":[],
  "pavimentos":[],
  "salas":[],
  "cursos":[],
  "disciplinas":[],
  "dias":[
      { "id": 1, "nome": "Domingo"},
      { "id": 2, "nome": "Segunda Feira"},
      { "id": 3, "nome": "Terça Feira"},
      { "id": 4, "nome": "Quarta Feira"},
      { "id": 5, "nome": "Quinta Feira"},
      { "id": 6, "nome": "Sexta Feira"},
      { "id": 7, "nome": "Sábado"}
  ],
  "quadroDeAulas":[]
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
            <LayoutLogado usuarioDados={usuarioLogadoDados}><Perfil usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
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
        <Route path="/visualizarAgendaSemanal" element={
          <RotaProtegida>
            <LayoutLogado usuarioDados={usuarioLogadoDados}><VisualizarAgendaSemanal usuarioLogado={usuarioLogadoDados}/></LayoutLogado>
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