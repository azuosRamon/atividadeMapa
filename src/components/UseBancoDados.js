import { useState, useEffect, useMemo } from "react";
import axios from "axios";

function useBancoDeDados({ nomeTabela, objeto, setObjeto, operacao, campoId = "id", campoNome ='nome' }) {
  const [data, setData] = useState([]);
  const [pesquisa, setPesquisa] = useState([]);
  const [loading, setLoading] = useState(true);

  // Atualiza a lista de dados
  const atualizarLista = () => {
    setLoading(true);
    axios.get(`https://backend-mapa-4eyq.onrender.com//${nomeTabela}/`)
      .then(resp => setData(resp.data))
      .catch(() => alert("Erro ao carregar dados!"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    atualizarLista();
  }, []);

  //  Criar (sem o campoId, ex: id)
  const criar = async (novoObjeto) => {
    const { [campoId]: _, ...semId } = novoObjeto;
    await axios.post(`https://backend-mapa-4eyq.onrender.com//${nomeTabela}/`, semId);
    atualizarLista();
  };

  //  Alterar
  const alterar = async (id, dadosAtualizados) => {
    await axios.put(`https://backend-mapa-4eyq.onrender.com//${nomeTabela}/${id}`, dadosAtualizados);
    atualizarLista();
  };

  //  Deletar
  const deletar = async (id) => {
    await axios.delete(`https://backend-mapa-4eyq.onrender.com//${nomeTabela}/${id}`);
    atualizarLista();
  };

  //  Pesquisa com base em nome ou ID
  const pesquisaFiltrada = useMemo(() => {
  const id = Number(objeto[campoId]);
  const nome = String(objeto[campoNome] || "").toLowerCase();

  return data.filter(item => {
    if (!isNaN(id) && id !== 0) {
      return item[campoId] === id;
    } else {
      return String(item[campoNome] || "").toLowerCase().includes(nome);
    }
  });
}, [data, objeto, campoId, campoNome]);
/*
  const pesquisaFiltrada = useMemo(() => {
    return data.filter(item =>
      objeto[campoId]
        ? item[campoId] === Number(objeto[campoId])
        : isNaN(item[campoNome])?.toLowerCase().includes(isNaN(objeto[campoNome])?.toLowerCase() || "")
    );
  }, [data, objeto[campoNome], objeto[campoId]]);*/

  useEffect(() => {
    setPesquisa(pesquisaFiltrada);
  }, [pesquisaFiltrada]);

  // Atualiza o objeto com os dados do item selecionado (em caso de alteração ou exclusão)
  useEffect(() => {
    const encontrado = data.find(item => item[campoId] === Number(objeto[campoId]));
    if (encontrado) {
      setObjeto(encontrado);
    }
  }, [objeto[campoId], data]);

  // ✉️ Envio de formulário
  const fazerEnvio = async (event) => {
    event.preventDefault();
    try {
      if (operacao === "1") {
        await criar(objeto);
        alert("Adicionado com sucesso!");
      } else if (operacao === "2") {
        await alterar(objeto[campoId], objeto);
        alert("Alterado com sucesso!");
      } else if (operacao === "3") {
        await deletar(objeto[campoId]);
        alert("Deletado com sucesso!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Tente novamente.");
    }
    console.log(objeto)
  };

  // Atualiza o objeto com o valor de um campo
  const alterarObjeto = (event, campo) => {
    event.preventDefault();
      setObjeto({
        ...objeto,
        [campo]: event.target.value
      });

  };

  return {
    data,
    pesquisa,
    loading,
    fazerEnvio,
    alterarObjeto,
    atualizarLista
  };
}

export default useBancoDeDados;
