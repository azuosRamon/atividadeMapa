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
    if (usuarioLocal?.user_id) {
      // Consulta sessão no backend (Redis)
      axios.get(`https://atividademapa.onrender.com/sessao/${usuarioLocal.user_id}`)
        .then(res => {
          setUser(res.data.user);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("usuario");
        })
        .finally(() => setLoading(false));
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
