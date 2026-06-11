import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RotaProtegida({ children, tiposPermitidos, funcoesPermitidas, empresasPermitidas }) {
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

  const canAccessDashboard = user.tipo?.toLowerCase() === "empresa" || 
                             ["gerente", "moderador(a)"].includes(user.funcao?.toLowerCase());
  const fallbackRedirect = canAccessDashboard ? "/dashboard" : "/editarPerfil";

  // Validação por empresa_id (se definido)
  if (empresasPermitidas) {
    const listEmpresas = Array.isArray(empresasPermitidas) ? empresasPermitidas : [empresasPermitidas];
    if (!listEmpresas.includes(user.empresa_id)) {
      console.warn(`Acesso negado para a empresa ${user.empresa_id}. Redirecionando para ${fallbackRedirect}...`);
      return <Navigate to={fallbackRedirect} replace />;
    }
  }

  // Validação de permissões:
  // Se ambos forem fornecidos, o usuário passa se atender a pelo menos um (OR).
  // Se apenas um for fornecido, deve atender a esse critério.
  if (tiposPermitidos || funcoesPermitidas) {
    const atendeTipo = tiposPermitidos
      ? tiposPermitidos.map(t => t.toLowerCase()).includes(user.tipo?.toLowerCase())
      : false;

    const atendeFuncao = funcoesPermitidas
      ? funcoesPermitidas.map(f => f.toLowerCase()).includes(user.funcao?.toLowerCase())
      : false;

    if (tiposPermitidos && funcoesPermitidas) {
      if (!atendeTipo && !atendeFuncao) {
        console.warn(`Acesso negado para o tipo ${user.tipo} e função ${user.funcao}. Redirecionando para ${fallbackRedirect}...`);
        return <Navigate to={fallbackRedirect} replace />;
      }
    } else if (tiposPermitidos) {
      if (!atendeTipo) {
        console.warn(`Acesso negado para o tipo ${user.tipo}. Redirecionando para ${fallbackRedirect}...`);
        return <Navigate to={fallbackRedirect} replace />;
      }
    } else if (funcoesPermitidas) {
      if (!atendeFuncao) {
        console.warn(`Acesso negado para a função ${user.funcao}. Redirecionando para ${fallbackRedirect}...`);
        return <Navigate to={fallbackRedirect} replace />;
      }
    }
  }

  // Sessão e permissões válidas → renderiza children ou o Outlet correspondente
  return children ? children : <Outlet />;
}
