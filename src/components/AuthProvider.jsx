import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "/supabaseClient";
import axios from "axios";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;

      if (sessionUser) {
        await carregarDadosCompletos(sessionUser);
        /*setUser(sessionUser);

        try {
          const { data: dados } = await axios.get('https://atividademapa.onrender.com/sessao/${sessionUser.id}');
          setDados {
        }*/



      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      if (sessionUser) carregarDadosCompletos(sessionUser);
      else setUser(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const carregarDadosCompletos = async (sessionUser) => {
    const { data: empresa } = await supabase
      .from("empresas")
      .select("*")
      .eq("user_id", sessionUser.id)
      .maybeSingle();

    const { data: usuario } = await supabase
      .from("sessao_usuario_view")
      .select("*")
      .eq("user_id", sessionUser.id)
      .maybeSingle();

    const dados = empresa
      ? { tipo: "empresa", ...empresa }
      : usuario
      ? { tipo: "usuario", ...usuario }
      : { ...sessionUser };

    setUser(dados);
    localStorage.setItem("usuario", JSON.stringify(dados));
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
