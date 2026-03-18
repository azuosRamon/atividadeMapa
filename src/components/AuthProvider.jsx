import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import BussolaCarregando from "./BussolaLoading.jsx";
import Modal from "./SubModal.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem("usuario") || "null");
    const sbTokens = JSON.parse(localStorage.getItem("sb_tokens") || "null");

    const revalidarSessaoLocal = async () => {
      // Reconstrói a máscara segura no Supabase local do Vite
      if (sbTokens?.access_token && sbTokens?.refresh_token) {
        // Precisamos do supabaseClient, vamos importa-lo no topo
        const { supabase } = await import('../../supabaseClient.js');
        await supabase.auth.setSession({
          access_token: sbTokens.access_token,
          refresh_token: sbTokens.refresh_token
        });
      }
    };

    if (usuarioLocal?.user_id) {
      revalidarSessaoLocal().then(() => {
        // Consulta sessão no backend (Redis)
        axios.get(`https://atividademapa.onrender.com/sessao/${usuarioLocal.user_id}`)
          .then(res => {
            setUser(res.data.user);
          })
          .catch(() => {
            setUser(null);
            localStorage.removeItem("usuario");
            localStorage.removeItem("sb_tokens");
          })
          .finally(() => setLoading(false));
      });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading }}>
        <BussolaCarregando aberto={loading} onFechar={() => setLoading(false)}>Carregando</BussolaCarregando>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
