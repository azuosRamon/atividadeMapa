import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import RelacionarUsuarios from "./components/menus/MenuRelacionarUsuarios";
import CadastroContratos from "./components/menus/MenuContratos";
import VisualizarAgendaSemanal from "./components/menus/MenuAgendaSemanal";
import MenuDashboardAdmin from "./components/menus/MenuDashboardAdmin";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import PublicSearch from "./components/pages/PublicSearch";

import terreo from "./components/Plantas/TERREO_PAVIMENTO.png";
import primeiro_pavimento from "./components/Plantas/PRIMEIRO_PAVIMENTO.png";
import segundo_pavimento from "./components/Plantas/SEGUNDO_PAVIMENTO.png";
import terceiro_pavimento from "./components/Plantas/TERCEIRO_PAVIMENTO.png";
import LerDados from "./components/BdLerTabela";
import Modal from "./components/SubModal";
import ObserverEmail from "./components/ObserverEmail";
import GlobalCrudModal from "./components/GlobalCrudModal";

const imagens = [terreo, primeiro_pavimento, segundo_pavimento, terceiro_pavimento];




const data = [];

const dadosJson = {
  "cliente": [],
  "horarios": [],
  "usuarios": [],
  "pessoas": [],
  "campus": [],
  "blocos": [],
  "pavimentos": [],
  "salas": [],
  "cursos": [],
  "disciplinas": [],
  "dias": [
    { "id": 1, "nome": "Domingo" },
    { "id": 2, "nome": "Segunda Feira" },
    { "id": 3, "nome": "Terça Feira" },
    { "id": 4, "nome": "Quarta Feira" },
    { "id": 5, "nome": "Quinta Feira" },
    { "id": 6, "nome": "Sexta Feira" },
    { "id": 7, "nome": "Sábado" }
  ],
  "quadroDeAulas": []
}

// Componente para injetar o usuarioLogado dinamicamente a partir do useAuth() context
function DashboardRoute({ Component, ...rest }) {
  const { user } = useAuth();
  return <Component usuarioLogado={user} {...rest} />;
}

// Componente para redirecionar para dashboard se logado, ou raiz '/' se visitante
function RedirectToHome() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div style={{ color: "#fff", textAlign: "center", marginTop: "20px" }}>Carregando...</div>;
  }
  return <Navigate to={user ? "/" : "/"} replace />;
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

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicSearch dados={dadosJson} />} />
          <Route path="/:cnpj" element={<PublicSearch dados={dadosJson} />} />
          <Route path="/login" element={
            <div className="corpo">
              <Header />
              <Login dados={dadosJson} />
              <Footer />
            </div>
          } />
          <Route path="/RecuperarSenha" element={
            <div className="corpo">
              <Header />
              <RecuperarSenha />
              <Footer />
            </div>
          } />
          <Route path="/redefinir-senha" element={
            <div className="corpo">
              <Header />
              <RedefinirSenha />
              <Footer />
            </div>
          } />

          {/* Grupo de rotas compartilhando LayoutLogado sob autenticação global */}
          <Route element={<RotaProtegida><LayoutLogado /></RotaProtegida>}>
            <Route path="/editarPerfil" element={<DashboardRoute Component={Perfil} />} />
            
            {/* Rota restrita de dashboard - apenas empresa, gerente ou moderador(a) */}
            <Route element={<RotaProtegida tiposPermitidos={["empresa"]} funcoesPermitidas={["gerente", "moderador(a)"]} />}>
              <Route path="/dashboard" element={<DashboardRoute Component={MenuDashboardAdmin} />} />
            </Route>

            <Route path="/cadastrarDisponibilidade" element={<DashboardRoute Component={CadastrarDisponibilidade} />} />
            <Route path="/visualizarAgendaSemanal" element={<DashboardRoute Component={VisualizarAgendaSemanal} />} />

            {/* Rotas restritas para tipo "empresa" ou função "gerente" */}
            <Route element={<RotaProtegida tiposPermitidos={["empresa"]} funcoesPermitidas={["gerente", "Moderador(a)"]} />}>
              <Route path="/edificio" element={<DashboardRoute Component={MenuEdificios} dados={dadosJson} />}/>
              <Route path="/cadastroUsuario" element={<DashboardRoute Component={MenuCadastro} />} />
              <Route path="/cargos" element={<DashboardRoute Component={CadastrarCargos} />} />
              <Route path="/relacionarUsuarios" element={<DashboardRoute Component={RelacionarUsuarios} />} />
              <Route path="/tiposAreas" element={<DashboardRoute Component={CadastrarAreas} />} />
            </Route>

            {/* Rotas restritas apenas para a função "gerente" */}
            <Route element={<RotaProtegida tiposPermitidos={["empresa"]} funcoesPermitidas={["Gerente", "Administrador(a)", "moderador(a)"]} />}>
              <Route path="/pesquisarDados" element={<DashboardRoute Component={Tabelas} dados={dadosJson} />} />
              <Route path="/periodoHorarios" element={<DashboardRoute Component={MenuHorarios} tableHorarios={dadosJson.horarios} />} />
              <Route path="/categorias" element={<DashboardRoute Component={ConfigurarCursos} />} />
              <Route path="/produtos" element={<DashboardRoute Component={MenuDisciplinas} />} />
              <Route path="/quadroAulas" element={<DashboardRoute Component={MenuQuadroAulas} />} />
            </Route>

            {/* Rotas restritas apenas para o tipo "sakdnaskdja" (dono da plataforma) da empresa com id específico */}
            <Route element={<RotaProtegida tiposPermitidos={["empresa"]} empresasPermitidas={["149721eb-86af-408e-82e5-c515a87120ce"]} />}>
              <Route path="/cadastroEmpresas" element={<DashboardRoute Component={CadastrarEmpresa} />} />
              <Route path="/funcoes" element={<DashboardRoute Component={CadastrarFuncao} />} />
              <Route path="/modelos" element={<DashboardRoute Component={CadastroModelos} />} />
              <Route path="/cadastroContrato" element={<DashboardRoute Component={CadastroContratos} />} />
            </Route>
          </Route>

          {/* Rota Protegida sem LayoutLogado */}
          <Route element={<RotaProtegida />}>
            <Route path="/slide" element={
              <Slide
                lista_imagens={imagens}
                pagina_inicio={0}
                dados={dadosJson}
                capturarCoordenadas={true}
              />
            } />
          </Route>

          {/* Redirecionamento curinga para rotas não cadastradas */}
          <Route path="*" element={<RedirectToHome />} />

        </Routes>
      </AuthProvider>
      <BotaoFlutuante />
      <ObserverEmail />
      <GlobalCrudModal />
    </Router>
  );
}

export default App;