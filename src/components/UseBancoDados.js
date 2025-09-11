import { useState, useEffect, useMemo } from "react";
import axios from "axios";

function useBancoDeDados({ nomeTabela, objeto, setObjeto, operacao, campoId = "id", campoNome = "nome" }) {
  const [data, setData] = useState([]);
  const [pesquisa, setPesquisa] = useState([]);
  const [loading, setLoading] = useState(true);

  const base = "https://backend-mapa-4eyq.onrender.com";

  const atualizarLista = () => {
    setLoading(true);
    axios.get(`${base}/${nomeTabela}/`)
      .then(resp => setData(resp.data))
      .catch(() => alert("Erro ao carregar dados!"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { atualizarLista(); }, []);

  const criar = async (novoObjeto) => {
    const { [campoId]: _omitCampoId, id: _omitId, ...semIds } = novoObjeto || {};
    await axios.post(`${base}/${nomeTabela}/`, semIds);
    atualizarLista();
  };

  const alterar = async (id, dadosAtualizados) => {
    const idStr = String(id || "").trim();
    const { [campoId]: _omitCampoId, id: _omitId, ...payload } = dadosAtualizados || {};
    await axios.put(`${base}/${nomeTabela}/${idStr}`, payload);
    atualizarLista();
  };

  const deletar = async (id) => {
    const idStr = String(id || "").trim();
    await axios.delete(`${base}/${nomeTabela}/${idStr}`);
    atualizarLista();
  };

  const pesquisaFiltrada = useMemo(() => {
    const idStr = String(objeto?.[campoId] ?? "").trim();
    const nome = String(objeto?.[campoNome] ?? "").toLowerCase().trim();

    return data.filter(item => {
      if (idStr) {
        return String(item?.[campoId] ?? "") === idStr;
      }
      return String(item?.[campoNome] ?? "").toLowerCase().includes(nome);
    });
  }, [data, objeto, campoId, campoNome]);

  useEffect(() => { setPesquisa(pesquisaFiltrada); }, [pesquisaFiltrada]);

  useEffect(() => {
    const idStr = String(objeto?.[campoId] ?? "").trim();
    if (!idStr) return;
    const encontrado = data.find(item => String(item?.[campoId] ?? "") === idStr);
    if (encontrado) setObjeto(encontrado);
  }, [objeto?.[campoId], data, campoId, setObjeto]);

  const fazerEnvio = async (event) => {
    event.preventDefault();
    try {
      if (operacao === "1") {
        await criar(objeto);
        alert("Adicionado com sucesso!");
      } else if (operacao === "2") {
        await alterar(objeto?.[campoId], objeto);
        alert("Alterado com sucesso!");
      } else if (operacao === "3") {
        await deletar(objeto?.[campoId]);
        alert("Deletado com sucesso!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Tente novamente.");
    }
  };

  const alterarObjeto = (event, campo) => {
    setObjeto(prev => ({ ...prev, [campo]: event.target.value }));
  };

  return { data, pesquisa, loading, fazerEnvio, alterarObjeto, atualizarLista };
}

export default useBancoDeDados;
