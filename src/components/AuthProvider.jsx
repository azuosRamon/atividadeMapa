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
      if (sbTokens?.access_token && sbTokens?.refresh_token) {
        const { supabase } = await import('../../supabaseClient.js');
        const { error } = await supabase.auth.setSession({
          access_token: sbTokens.access_token,
          refresh_token: sbTokens.refresh_token
        });
        
        if (error) {
           throw new Error("Sessão Inválida");
        }
        return true;
      }
      throw new Error("Sem tokens");
    };

    if (usuarioLocal?.user_id) {
      revalidarSessaoLocal().then(() => {
         // Sessão válida - Módulo Supabase Nativo
         setUser(usuarioLocal);
         setLoading(false);
      }).catch((e) => {
         console.warn("Autenticação falhou: ", e);
         setUser(null);
         localStorage.removeItem("usuario");
         localStorage.removeItem("sb_tokens");
         setLoading(false);
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
