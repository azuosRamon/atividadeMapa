import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import Button from "../SubButton";
import { useNavigate } from 'react-router-dom';
import Box from "../SubBox";
import cores from "../Cores"
import Colapse from "../SubColapse";
import { pegarNomenclatura } from "../Nomenclaturas";
import Modal from "../SubModal";
import { supabase } from "/supabaseClient";

const BoxEditada = styled(Box)`
    min-width: 100px;
    padding: 20px;
    max-width: 200px;
`;

const DivContentInformacoes = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 10px;
`;

const Imagem = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
`;

const Titulo3 = styled.h3`
    color: ${cores.corTexto};
    font-size: 20px;
    padding: 0;
    margin: 0 auto;
`;


const ParagrafoInformacao = styled.p`
    color: ${cores.corTexto};
    font-size: 12px;
    margin: 5px auto;
`;

const DivContent = styled.div`

    margin-top: 15px;
`;



function Usuario({ fecharMenu, mobile=false, logo=false }) {
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

    const telaAtual = useNavigate();
    const [usuario, setUsuario] = useState(capturarUsuarioLogadoLocalStorage());
    const navegar = (rota) => {
        telaAtual(rota);
        if (mobile) fecharMenu();
    }
    
    const nomes = pegarNomenclatura();
    const nomeCategoria = nomes.categorias;
    const nomeProduto = nomes.produtos;
    const nomeImovel = nomes.imoveis;
    const nomeComodo = nomes.comodos;

    const [vinculos, setVinculos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {
        if (usuario && usuario.usuario_id) {
            supabase.from('usuarios_empresas')
                .select('empresa_id, funcao_id, funcoes(nome), empresas(nome, modelo_id)')
                .eq('usuario_id', usuario.usuario_id)
                .then(({ data }) => {
                    if (data && data.length > 1) {
                        setVinculos(data);
                    }
                });
        }
    }, [usuario]);
    
    return (
        <React.Fragment>
            <BoxEditada>
            <DivContent>
                {usuario?.imagem ? (
                    <Imagem src={usuario.imagem} alt={`${usuario.nome} - imagem`} />
                ) : (
                    <CgProfile size={80} color="#999" />
                )}
                <DivContentInformacoes>
                    <Titulo3>{usuario.nome}</Titulo3>
                </DivContentInformacoes>
                <DivContentInformacoes>
                    <ParagrafoInformacao>{usuario.funcao}</ParagrafoInformacao>
                </DivContentInformacoes>
                {vinculos.length > 1 && (
                    <DivContentInformacoes>
                        <Button 
                            onClick={() => setModalAberto(true)} 
                            $bgcolor={cores.backgroundBotaoSemFoco2} 
                            style={{marginTop: '10px', fontSize: '12px', padding: '5px 15px'}}>
                            Trocar de Empresa
                        </Button>
                    </DivContentInformacoes>
                )}
            </DivContent>
            
            <DivContent>
                { (usuario.funcao?.toLowerCase() === "moderador(a)") && (
                    <React.Fragment>
                        <Button onClick={()=>{navegar('/dashboard')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                        <Button onClick={()=>{navegar('/pesquisarDados')}} $bgcolor="rgb(38, 38, 38)">Pesquisa</Button>
                        <Button onClick={()=>{navegar('/cadastrarDisponibilidade')}} $bgcolor="rgb(38, 38, 38)">Disponibilidade</Button>
                        <Button onClick={()=>{navegar('/visualizarAgendaSemanal')}} $bgcolor="rgb(38, 38, 38)">Agenda</Button>
                        <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                            <Colapse fontSize="1.2rem" nome = "Gerenciar" estadoInicial={false}> 
                            <Button onClick={()=>{navegar('/categorias')}} $bgcolor="rgb(38, 38, 38)">{nomeCategoria}</Button>
                            <Button onClick={()=>{navegar('/produtos')}} $bgcolor="rgb(38, 38, 38)">{nomeProduto}</Button>
                            <Button onClick={()=>{navegar('/periodoHorarios')}} $bgcolor="rgb(38, 38, 38)">Horários</Button>
                            <Button onClick={()=>{navegar('/edificio')}} $bgcolor="rgb(38, 38, 38)">Edifício</Button>
                            <Button onClick={()=>{navegar('/quadroAulas')}} $bgcolor="rgb(38, 38, 38)">Quadro de funcionamento</Button>
                            <Button onClick={()=>{navegar('/cadastroUsuario')}} $bgcolor="rgb(38, 38, 38)">Usuários</Button>
                        </Colapse>
                            <Colapse fontSize="1.2rem" nome = "Empresa" estadoInicial={false}>
                            <Button onClick={()=>{navegar('/tiposAreas')}} $bgcolor="rgb(38, 38, 38)">Tipos de Áreas</Button>
                            <Button onClick={()=>{navegar('/relacionarUsuarios')}} $bgcolor="rgb(38, 38, 38)">Relacionamento</Button>
                            <Button onClick={()=>{navegar('/cargos')}} $bgcolor="rgb(38, 38, 38)">Cargos</Button>
                        </Colapse>
                            <Colapse fontSize="1.2rem" nome = "M.A.P.A." estadoInicial={false}>
                            <Button onClick={()=>{navegar('/cadastroUsuario')}} $bgcolor="rgb(38, 38, 38)">Usuários</Button>
                            <Button onClick={()=>{navegar('/cadastroEmpresas')}} $bgcolor="rgb(38, 38, 38)">Empresas</Button>
                            <Button onClick={()=>{navegar('/cadastroContrato')}} $bgcolor="rgb(38, 38, 38)">Contratos</Button>
                            <Button onClick={()=>{navegar('/modelos')}} $bgcolor="rgb(38, 38, 38)">Modelos</Button>
                            <Button onClick={()=>{navegar('/funcoes')}} $bgcolor="rgb(38, 38, 38)">Funcoes</Button>
                        </Colapse>
                    </React.Fragment>
                )}
                    { (usuario.tipo.toLowerCase() === "sakdnaskdja") && (
                    <React.Fragment>
                        <Button onClick={()=>{navegar('/dashboard')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                        <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                        <Button onClick={()=>{navegar('/cadastroEmpresas')}} $bgcolor="rgb(38, 38, 38)">Empresa</Button>
                        <Button onClick={()=>{navegar('/funcoes')}} $bgcolor="rgb(38, 38, 38)">Funcoes</Button>
                    </React.Fragment>
                )}
                    { (usuario.tipo.toLowerCase() === "empresa") && (
                        <React.Fragment>
                        <Button onClick={()=>{navegar('/dashboard')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                        <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                        <Button onClick={()=>{navegar('/pesquisarDados')}} $bgcolor="rgb(38, 38, 38)">Tabelas</Button>
                        <Button onClick={()=>{navegar('/edificio')}} $bgcolor="rgb(38, 38, 38)">Edifício</Button>
                        <Button onClick={()=>{navegar('/periodoHorarios')}} $bgcolor="rgb(38, 38, 38)">Períodos e Horários</Button>
                        <Button onClick={()=>{navegar('/categorias')}} $bgcolor="rgb(38, 38, 38)">Cursos</Button>
                        <Button onClick={()=>{navegar('/produtos')}} $bgcolor="rgb(38, 38, 38)">Disciplinas</Button>
                        <Button onClick={()=>{navegar('/quadroAulas')}} $bgcolor="rgb(38, 38, 38)">Quadro de aulas</Button>
                        <Button onClick={()=>{navegar('/cadastroUsuario')}} $bgcolor="rgb(38, 38, 38)">Adicionar usuário</Button>
                        <Button onClick={()=>{navegar('/cargos')}} $bgcolor="rgb(38, 38, 38)">Cargos</Button>
                        <Button onClick={()=>{navegar('/relacionarUsuarios')}} $bgcolor="rgb(38, 38, 38)">Relacionar Usuários</Button>
                    </React.Fragment>
                )}
                { (usuario.funcao?.toLowerCase() === "administrador(a)") && (
                    <React.Fragment>
                        <Button onClick={()=>{navegar('/dashboard')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                        <Button onClick={()=>{navegar('/cadastrarDisponibilidade')}} $bgcolor="rgb(38, 38, 38)">Disponibilidade</Button>
                        <Button onClick={()=>{navegar('/visualizarAgendaSemanal')}} $bgcolor="rgb(38, 38, 38)">Agenda</Button>
                        <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                    </React.Fragment>
                )}
            </DivContent>


        </BoxEditada>
            {/* Modal de Mudança de Empresa */}
            <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)}>
                <Box>
                  <Titulo3 style={{marginBottom: '10px', textAlign: 'center'}}>Escolha o ambiente de trabalho</Titulo3>
                  <ParagrafoInformacao style={{textAlign: 'center', marginBottom: '20px'}}>Você possui vínculo com múltiplas contas empresariais.</ParagrafoInformacao>
                  
                  {vinculos.map((vinculo) => (
                    <Button 
                      key={vinculo.empresa_id} 
                      $bgcolor={usuario.empresa_id === vinculo.empresa_id ? cores.corAdicionar : cores.backgroundBotaoSemFoco2}
                      onClick={async () => {
                        const userModelado = {
                          ...usuario,
                          empresa_id: vinculo.empresa_id,
                          funcao_id: vinculo.funcao_id,
                          funcao: vinculo.funcoes?.nome || '',
                          empresa_nome: vinculo.empresas?.nome || ''
                        };
                        localStorage.setItem("usuario", JSON.stringify(userModelado));
                        
                        // Busca modelo
                        if (vinculo.empresas?.modelo_id) {
                            const { data: modeloData } = await supabase
                              .from('modelos')
                              .select('*')
                              .eq('modelo_id', vinculo.empresas.modelo_id)
                              .single();
                            if (modeloData) {
                              localStorage.setItem("modelo", JSON.stringify(modeloData));
                            } else {
                              localStorage.removeItem("modelo");
                            }
                        } else {
                            localStorage.removeItem("modelo");
                        }
                        
                        setModalAberto(false);
                        window.location.reload();
                      }}
                      style={{ marginBottom: '10px', width: '100%', padding: '15px' }}
                    >
                      {vinculo.empresas?.nome} ({vinculo.funcoes?.nome})
                    </Button>
                  ))}
                </Box>
            </Modal>
        </React.Fragment>
    )
}
export default Usuario;
