import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RotaProtegida({ children }) {
  const { user, loading } = useAuth();

  // Ainda carregando sessão → mostra tela neutra
  if (loading) {
    return <div style={{ color: "#fff", textAlign: "center", marginTop: "20px" }}>Verificando sessão...</div>;
  }

  // Não há usuário autenticado → vai pro login
  if (!user){
    console.log("Usuário não autenticado, redirecionando para login...");
    return <Navigate to="/login" replace />;
  }
  // Sessão válida → renderiza a rota normalmente
  return children;
}
