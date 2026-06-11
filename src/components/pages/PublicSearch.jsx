import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/supabaseClient";
import Header from "../Header";
import Footer from "../Footer";
import PesquisaPublica from "../PesquisaPublica";
import Slide from "../Slide";
import BussolaCarregando from "../BussolaLoading";
import Box from "../SubBox";
import Button from "../SubButton";
import Container from "../SubContainer";
import cores from "../Cores";
import styled from "styled-components";
import { useAuth } from "../AuthProvider";

// Imagens static do app (fallback)
import terreo from "../Plantas/TERREO_PAVIMENTO.png";
import primeiro_pavimento from "../Plantas/PRIMEIRO_PAVIMENTO.png";
import segundo_pavimento from "../Plantas/SEGUNDO_PAVIMENTO.png";
import terceiro_pavimento from "../Plantas/TERCEIRO_PAVIMENTO.png";

const imagensPadrao = [terreo, primeiro_pavimento, segundo_pavimento, terceiro_pavimento];

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
`;

const Title = styled.h2`
  color: ${cores.corTexto};
  margin-bottom: 15px;
  font-size: 24px;
`;

const Message = styled.p`
  color: ${cores.corTextoClaro};
  font-size: 16px;
  margin-bottom: 25px;
`;

function PublicSearch({ dados }) {
    const { cnpj } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    // Redireciona quando o Supabase enviar tokens de redefinição de senha para a raiz pública
    useEffect(() => {
        const search = window.location.search || "";
        const hash = window.location.hash || "";
        if (search.includes("token=") || hash.includes("access_token") || search.includes("error=") || hash.includes("error=")) {
            const suffix = (search || hash) + "";
            const target = "/redefinir-senha" + suffix;
            navigate(target, { replace: true });
        }
    }, [navigate]);

    const [loading, setLoading] = useState(true);
    const [empresa, setEmpresa] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const targetCnpj = cnpj || "00.000.000/0000-00";

    useEffect(() => {
        let active = true;
        async function fetchEmpresa() {
            try {
                setLoading(true);
                setErrorMsg("");

                const cleanCnpj = targetCnpj.replace(/\D/g, "");
                let query = supabase.from("empresas").select("*");

                if (cleanCnpj.length === 14) {
                    const formatted = `${cleanCnpj.slice(0, 2)}.${cleanCnpj.slice(2, 5)}.${cleanCnpj.slice(5, 8)}/${cleanCnpj.slice(8, 12)}-${cleanCnpj.slice(12, 14)}`;
                    query = query.or(`cnpj.eq."${cleanCnpj}",cnpj.eq."${formatted}"`);
                } else {
                    query = query.or(`cnpj.eq."${targetCnpj}",cnpj.eq."${cleanCnpj}"`);
                }

                const { data, error } = await query;

                if (!active) return;

                if (error) {
                    console.error("Erro ao buscar empresa:", error);
                    // Se for a rota raiz (CNPJ de propaganda) e der erro porque o banco está vazio,
                    // mantemos sem travar a tela
                    if (!cnpj) {
                        setEmpresa(null);
                    } else {
                        setErrorMsg("Erro de conexão ao buscar os dados da empresa.");
                    }
                } else if (!data || data.length === 0) {
                    if (!cnpj) {
                        setEmpresa(null);
                    } else {
                        setErrorMsg(`Empresa com CNPJ "${targetCnpj}" não foi encontrada no sistema.`);
                    }
                } else {
                    setEmpresa(data[0]);
                }
            } catch (err) {
                console.error("Erro inesperado:", err);
                if (cnpj) {
                    setErrorMsg("Erro inesperado ao carregar informações da empresa.");
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchEmpresa();
        return () => {
            active = false;
        };
    }, [cnpj]);

    if (loading || authLoading) {
        return <BussolaCarregando aberto={true} onFechar={() => {}} children="Buscando dados da empresa" />;
    }

    if (errorMsg) {
        return (
            <div className="corpo">
                <Header />
                <ErrorWrapper>
                    <Box style={{ maxWidth: "450px", textAlign: "center" }}>
                        <Title style={{ color: cores.corDeletar }}>Acesso Restrito</Title>
                        <Message>{errorMsg}</Message>
                        <Button $bgcolor={cores.cor3} onClick={() => navigate("/")}>
                            Voltar ao Início
                        </Button>
                    </Box>
                </ErrorWrapper>
                <Footer />
            </div>
        );
    }

    const isPublic = empresa?.visibilidade !== false;
    const isCompanyUser = user && user.empresa_id === empresa?.empresa_id;

    if (!isPublic && !isCompanyUser) {
        return (
            <div className="corpo">
                <Header />
                <ErrorWrapper>
                    <Box style={{ maxWidth: "450px", textAlign: "center" }}>
                        <Title style={{ color: cores.corDeletar }}>Acesso Restrito</Title>
                        <Message>
                            Esta pesquisa está configurada como privada. Apenas funcionários e administradores autorizados desta empresa podem visualizar estas informações.
                        </Message>
                        <Button $bgcolor={cores.cor3} onClick={() => navigate("/login")}>
                            Fazer Login
                        </Button>
                    </Box>
                </ErrorWrapper>
                <Footer />
            </div>
        );
    }

    return (
        <div className="corpo">
            <Header />
            <PesquisaPublica 
                dados={dados} 
                empresaId={empresa?.empresa_id || null} 
                empresaImagem={empresa?.imagem || null} 
            />
           
            <Footer />
        </div>
    );
}

export default PublicSearch;
