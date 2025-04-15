import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./components/Login";
import MenuCadastro from "./components/MenuCadastro";
import MenuHorarios from "./components/MenuHorarios";
import Perfil from "./components/MenuPerfil";
import MenuCursos from "./components/MenuCursos";
import MenuDisciplinas from "./components/MenuDisciplinas";
import MenuEdificios from "./components/MenuEdificio";
import MenuQuadroAulas from "./components/MenuQuadroAulas";
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
import BotaoFlutuante from "./components/SubButtonFlutuante";

const imagens = [terreo, primeiro_pavimento, segundo_pavimento, terceiro_pavimento];
const data = [
  { id:0, nome: "Carlos", sobrenome: "Silva", telefone: "21912341234",nascimento:"2025-03-24", email:"carlossilva@mail.com", cpf: "111.222.333-44", matricula:"202411122", funcao: "Administrador", foto: "", senha: "admin"},
  { nome: "Ana", funcao: "Secretaria", foto: "" },
  { nome: "Maria", funcao: "Professor", foto: "" },
]; 

const dadosJson = {
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
  "pessoas": [
    {"id":0, "nome": "Carlos", "sobrenome": "Silva", "telefone": "21912341234","nascimento":"2025-03-24", "email":"carlossilva@mail.com", "cpf": "111.222.333-44", "matricula":"202411122", "funcao": "Administrador", "foto": "", "senha": "admin"},
    {"id":1, "nome": "Tereza", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":2, "nome": "Maria", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":3, "nome": "Renato", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":4, "nome": "Mauricio", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":5, "nome": "Vanderlei", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":6, "nome": "Vanderleia", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":7, "nome": "Suelen", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":8, "nome": "Andre", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
    {"id":9, "nome": "Mario", "sobrenome": "Souza", "telefone": "21943214321","nascimento":"2025-04-14", "email":"terezinha@mail.com", "cpf": "111.222.333-44", "matricula":"202411123", "funcao": "Professor", "foto": "", "senha": "professor"},
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
      { "id": 1, "numero": "0", "imagem": "caminho/a.png", "blocoId" : 1},
      { "id": 2, "numero": "1", "imagem": "caminho/b.png", "blocoId" : 1},
      { "id": 3, "numero": "2", "imagem": "caminho/c.png", "blocoId" : 1},
      { "id": 4, "numero": "3", "imagem": "caminho/d.png", "blocoId" : 1}

  ],
  "salas":[
      {"id": 1, "numero": 1, "apelido": "Lab. Anatômico Geral","imagem": "001", "pavimentoId": 1},
      {"id": 2, "numero": 2, "apelido": "Lab. Anatômico Veterinário", "imagem": "002", "pavimentoId": 1},
      {"id": 3, "numero": 3, "apelido": "Lab. Sala de Preparo", "imagem": "003", "pavimentoId": 1},
      {"id": 4, "numero": 4, "apelido": "Lab. Microbiologia","imagem": "004", "pavimentoId": 1},
      {"id": 5, "numero": 5, "apelido": "Lab. Biologia","imagem": "005", "pavimentoId": 1},
      {"id": 6, "numero": 6, "apelido": "Lab. Mecânica dos solos","imagem": "006", "pavimentoId": 1},
      {"id": 7, "numero": 7, "apelido": "Lab. Tecnicas construtivas","imagem": "007", "pavimentoId": 1},
      {"id": 8, "numero": 8, "apelido": "Lab. Elétrica","imagem": "008", "pavimentoId": 1},
      {"id": 9, "numero": 10, "apelido": "","imagem": "110", "pavimentoId": 2},
      {"id": 10, "numero": 11, "apelido": "","imagem": "111", "pavimentoId": 2},
      {"id": 11, "numero": 12, "apelido": "","imagem": "112", "pavimentoId": 2},
      {"id": 12, "numero": 14, "apelido": "","imagem": "114", "pavimentoId": 2},
      {"id": 13, "numero": 15, "apelido": "","imagem": "115", "pavimentoId": 2},
      {"id": 14, "numero": 16, "apelido": "","imagem": "116", "pavimentoId": 2},
      {"id": 15, "numero": 17, "apelido": "","imagem": "117", "pavimentoId": 2},
      {"id": 16, "numero": 18, "apelido": "Lab. Informática 01","imagem": "201", "pavimentoId": 3},
      {"id": 17, "numero": 19, "apelido": "Lab. Informática 02","imagem": "202", "pavimentoId": 3},
      {"id": 18, "numero": 20, "apelido": "Lab. Informática 03","imagem": "203", "pavimentoId": 3},
      {"id": 19, "numero": 21, "apelido": "Lab. Informática 04","imagem": "204", "pavimentoId": 3},
      {"id": 20, "numero": 22, "apelido": "","imagem": "222", "pavimentoId": 3},
      {"id": 21, "numero": 23, "apelido": "","imagem": "223", "pavimentoId": 3},
      {"id": 22, "numero": 24, "apelido": "","imagem": "224", "pavimentoId": 3},
      {"id": 23, "numero": 25, "apelido": "","imagem": "225", "pavimentoId": 3},
      {"id": 24, "numero": 26, "apelido": "","imagem": "226", "pavimentoId": 3},
      {"id": 25, "numero": 27, "apelido": "","imagem": "227", "pavimentoId": 3},
      {"id": 26, "numero": 28, "apelido": "","imagem": "228", "pavimentoId": 3},
      {"id": 27, "numero": 29, "apelido": "Lab. de Química","imagem": "329", "pavimentoId": 4},
      {"id": 28, "numero": 30, "apelido": "Lab. Anatomia Palpatória","imagem": "330", "pavimentoId": 4},
      {"id": 29, "numero": 31, "apelido": "Lab. de Antropometria","imagem": "331", "pavimentoId": 4},
      {"id": 30, "numero": 32, "apelido": "Lab. Técnicas dietéticas","imagem": "332", "pavimentoId": 4},
      {"id": 31, "numero": 34, "apelido": "","imagem": "334", "pavimentoId": 4},
      {"id": 32, "numero": 35, "apelido": "","imagem": "335", "pavimentoId": 4},
      {"id": 33, "numero": 36, "apelido": "","imagem": "336", "pavimentoId": 4},
      {"id": 34, "numero": 37, "apelido": "","imagem": "337", "pavimentoId": 4},
      {"id": 35, "numero": 38, "apelido": "","imagem": "338", "pavimentoId": 4},
      {"id": 36, "numero": 39, "apelido": "","imagem": "339", "pavimentoId": 4},

  ],
  "cursos":[
        { "id": 1, "nome": "Engenharia Civil"},
        { "id": 2, "nome": "Engenharia de Software"},
        { "id": 3, "nome": "Engenharia Ambiental"},
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
    "quadroDeAulas":[
      { "id": 1, "disciplinaId": 1, "cursoId":1, "professorId":1, "diaSemana":[1], "inicioId":1,"terminoId": 1, "campusId":1, "blocoId":1, "pavimentoId":0,"salaId": 0},
      { "id": 2, "disciplinaId": 2, "cursoId":2, "professorId":2, "diaSemana":[2], "inicioId":2,"terminoId": 2, "campusId":1, "blocoId":1, "pavimentoId":1,"salaId": 1},
      { "id": 3, "disciplinaId": 3, "cursoId":1, "professorId":3, "diaSemana":[3], "inicioId":3,"terminoId": 3, "campusId":1, "blocoId":1, "pavimentoId":2,"salaId": 1},
      { "id": 4, "disciplinaId": 4, "cursoId":4, "professorId":4, "diaSemana":[4], "inicioId":4,"terminoId": 4, "campusId":1, "blocoId":1, "pavimentoId":3,"salaId": 1},
      { "id": 5, "disciplinaId": 5, "cursoId":3, "professorId":5, "diaSemana":[5], "inicioId":1,"terminoId": 1, "campusId":1, "blocoId":1, "pavimentoId":0,"salaId": 1},
      { "id": 6, "disciplinaId": 1, "cursoId":2, "professorId":6, "diaSemana":[1], "inicioId":2,"terminoId": 2, "campusId":1, "blocoId":1, "pavimentoId":1,"salaId": 1},
      { "id": 7, "disciplinaId": 2, "cursoId":1, "professorId":7, "diaSemana":[2], "inicioId":3,"terminoId": 3, "campusId":1, "blocoId":1, "pavimentoId":2,"salaId": 1},
      { "id": 8, "disciplinaId": 3, "cursoId":2, "professorId":8, "diaSemana":[3], "inicioId":4,"terminoId": 4, "campusId":1, "blocoId":1, "pavimentoId":3,"salaId": 1},
      { "id": 9, "disciplinaId": 1, "cursoId":2, "professorId":9, "diaSemana":[4], "inicioId":1,"terminoId": 1, "campusId":1, "blocoId":1, "pavimentoId":1,"salaId": 1}
    ]
}


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
          <LayoutLogado usuarioDados={data} usuarioId={0}><MenuHorarios tableHorarios={dadosJson.horarios}/></LayoutLogado>
        }/>
        <Route path="/edificio" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><MenuEdificios/></LayoutLogado>
        }/>
        <Route path="/cursos" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><MenuCursos tableCursos={dadosJson.cursos}/></LayoutLogado>
        }/>
        <Route path="/disciplinas" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><MenuDisciplinas tableDisciplinas={dadosJson.disciplinas}/></LayoutLogado>
        }/>
        <Route path="/professores" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}></LayoutLogado>
        }/>
        <Route path="/quadroAulas" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><MenuQuadroAulas table={dadosJson} imagens={imagens}/></LayoutLogado>
        }/>
        <Route path="/cadastro" element={
          <LayoutLogado usuarioDados={data} usuarioId={0}><MenuCadastro/></LayoutLogado>
        }/>
        <Route path="/slide" element={
          <Slide
          lista_imagens={imagens}
          pagina_inicio={0}
        />
          }/>

      </Routes>
      <BotaoFlutuante/>
    </Router>
  );
}

export default App;