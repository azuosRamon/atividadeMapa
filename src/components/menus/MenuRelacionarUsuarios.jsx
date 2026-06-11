import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import useBancoDeDados from "../BdSupabase";
import mapa from "../BdObjetoTabelas";
import CriarCamposFormulario from "../SubCriadorForm";
import { supabase } from "/supabaseClient";
import Modal from "../SubModal";
import Input from "../SubInput";
import Label from "../SubLabel";
import GridArea from "../SubGridArea";
import cores from "../Cores";

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "operacao operacao id"
    "matricula usuario_id usuario_id"
    "funcao_id cargo_id ."
    ". reset botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "tabela"
        "operacao"
        "id"
        "nome"
        "matricula"
        "usuario_id"
        "usuario_id"
        "funcao_id"
        "cargo_id"
        "reset"
        "botoes";
}
`;

const SeletorBotao = styled.button`
  margin: 10px 0;
  border: 1px solid #000;
  width: 100%;
  height: 40px;
  padding: 10px;
  color: ${cores.corTexto};
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${cores.backgroundInput};
  text-align: left;
  
  &:hover {
    background-color: #222;
    transition: 0.5s;
  }
`;

const ThumbMini = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  border: 1px solid ${cores.corWhite};
`;

const MiniAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #555;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  border: 1px solid ${cores.corWhite};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px 5px;
`;

const CardFuncionario = styled.div`
  background-color: ${cores.backgroundBox};
  border: 2px solid ${props => props.$selecionado ? cores.corEditar : "rgba(255, 255, 255, 0.1)"};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
  }
`;

const FotoCard = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #444;
  margin-bottom: 12px;
  border: 2px solid ${cores.corWhite};
`;

const DefaultAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  border: 2px solid ${cores.corWhite};
`;

const NomeCard = styled.div`
  font-weight: bold;
  font-size: 15px;
  color: ${cores.corTexto};
  margin-bottom: 4px;
`;

const CpfCard = styled.div`
  font-size: 12px;
  color: ${cores.corTextoClaro};
`;

function RelacionarUsuarios({ usuarioLogado }) {
    const tabela = mapa.usuarios_empresas;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id"?usuarioLogado.empresa_id:v.valor]))
        )
    );
    const [operacao, setOperacao] = useState("0");
    const [usuarios, setUsuarios] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [busca, setBusca] = useState("");

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
        async function fetchUsuarios() {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .order('nome', { ascending: true });
            if (error) {
                console.error("Erro ao carregar usuários:", error);
            } else {
                setUsuarios(data || []);
            }
        }
        fetchUsuarios();
    }, []);

    const usuarioSelecionado = usuarios.find(u => u.usuario_id === objeto.usuario_id);
    const textoBotao = usuarioSelecionado 
      ? `${usuarioSelecionado.nome} ${usuarioSelecionado.sobrenome || ""}` 
      : "Selecionar Usuário";
    const iniciaisSelecionadas = usuarioSelecionado 
      ? ((usuarioSelecionado.nome?.[0] || "") + (usuarioSelecionado.sobrenome?.[0] || "")).toUpperCase() 
      : "";

    const usuariosFiltrados = usuarios.filter(u => {
        const query = busca.toLowerCase();
        const nomeMatch = `${u.nome || ""} ${u.sobrenome || ""}`.toLowerCase().includes(query);
        const cpfMatch = u.cpf ? u.cpf.includes(query) : false;
        return nomeMatch || cpfMatch;
    });

    return(
        <React.Fragment>
            <Box>
                <Title>Relacionar Usuário</Title>
                <FormGrid onSubmit={fazerEnvio}>

                    <CriarCamposFormulario 
                    item={tabela}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto={objeto}
                    setObjeto={setObjeto}
                    >
                        <GridArea $area="usuario_id">
                            <Label>Selecionar Usuário:<span style={{color: 'red', fontSize: '10px', marginLeft: '4px', verticalAlign: 'super'}}>*</span></Label>
                            <SeletorBotao type="button" onClick={() => setModalAberto(true)}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {usuarioSelecionado?.imagem ? (
                                        <ThumbMini src={usuarioSelecionado.imagem} alt="Foto" />
                                    ) : usuarioSelecionado ? (
                                        <MiniAvatar>{iniciaisSelecionadas}</MiniAvatar>
                                    ) : null}
                                    <span>{textoBotao}</span>
                                </div>
                                <span style={{ fontSize: '13px', color: cores.corTextoClaro }}>
                                    {usuarioSelecionado ? `CPF: ${usuarioSelecionado.cpf}` : "Clique para selecionar"}
                                </span>
                            </SeletorBotao>
                        </GridArea>
                    </CriarCamposFormulario>
                </FormGrid>
            </Box>

            <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)}>
                <Box>
                    <Title style={{ marginBottom: "10px" }}>Selecionar Usuário</Title>
                    <div style={{ color: cores.corTextoClaro, fontSize: "14px", marginBottom: "20px" }}>
                        Escolha o usuário que deseja vincular à empresa.
                    </div>
                    <Input
                        placeholder="Pesquisar por nome ou CPF..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <CardsGrid>
                        {usuariosFiltrados.length === 0 ? (
                            <div style={{ color: "#fff", gridColumn: "1/-1", textAlign: "center", padding: "20px" }}>
                                Nenhum usuário encontrado.
                            </div>
                        ) : (
                            usuariosFiltrados.map((u) => {
                                const iniciais = ((u.nome?.[0] || "") + (u.sobrenome?.[0] || "")).toUpperCase();
                                const selecionado = u.usuario_id === objeto.usuario_id;
                                
                                return (
                                    <CardFuncionario
                                        key={u.usuario_id}
                                        $selecionado={selecionado}
                                        onClick={() => {
                                            setObjeto(prev => ({ ...prev, usuario_id: u.usuario_id }));
                                            setModalAberto(false);
                                            setBusca("");
                                        }}
                                    >
                                        {u.imagem ? (
                                            <FotoCard src={u.imagem} alt={`${u.nome} Foto`} />
                                        ) : (
                                            <DefaultAvatar>{iniciais}</DefaultAvatar>
                                        )}
                                        <NomeCard>
                                            {u.nome} {u.sobrenome || ""}
                                        </NomeCard>
                                        <CpfCard>
                                            CPF: {u.cpf}
                                        </CpfCard>
                                    </CardFuncionario>
                                );
                            })
                        )}
                    </CardsGrid>
                </Box>
            </Modal>
        </React.Fragment>
    )
}
export default RelacionarUsuarios;