import { useState, useEffect, useMemo } from "react"
import { supabase } from "../../supabaseClient" // importa o cliente já configurado
import AbrirModalSubmit from "./SubModalSubmit"

// 🔧 Função auxiliar para extrair path de URL pública
function extractPathFromUrl(publicUrl, bucketName = "imagens") {
  if (!publicUrl) return null;
  try {
    const urlPart = `/public/${bucketName}/`;
    const pathIndex = publicUrl.indexOf(urlPart);
    if (pathIndex > -1) {
      return publicUrl.substring(pathIndex + urlPart.length);
    }
    return null;
  } catch (e) {
    console.error("Erro ao extrair path da URL:", e);
    return null;
  }
}



function useBancoDeDados({
  nomeTabela,
  objeto,
  setObjeto,
  operacao,
  campoId = "id",
  campoNome = "nome",
}) {
  const [data, setData] = useState([]);
  const [pesquisa, setPesquisa] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔹 READ - buscar todos os registros
  const atualizarLista = async () => {
    setLoading(true)
    const { data: rows, error } = await supabase.from(nomeTabela).select("*")

    if (error) {
      console.error(error)
      alert("Erro ao carregar dados!")
    } else {
      setData(rows || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    atualizarLista()
  }, [nomeTabela])

  // 🔹 CREATE - inserir registro
    const criar = async (novoObjeto) => {
    // remove o campo id (disciplina_id ou outro campoId)
    const { [campoId]: _, ...semId } = novoObjeto

    const { error } = await supabase
        .from(nomeTabela)
        .insert([semId])

    if (error) throw error
    atualizarLista()
    }

  // 🔹 UPDATE - alterar registro
    const alterar = async (id, dadosAtualizados) => {
    // remove o campo de id do objeto
    const { [campoId]: _, ...semId } = dadosAtualizados

      // 🔹 Remove qualquer campo temporário (por exemplo, "_imagem_anterior")
    const camposValidos = Object.fromEntries(
      Object.entries(semId).filter(([chave]) => !chave.startsWith("_"))
    );

    const { error } = await supabase
        .from(nomeTabela)
        .update(camposValidos) // agora sem o campo id e sem campos temporários
        .eq(campoId, id)

    if (error) throw error

      // 🔹 Após atualizar o banco, deletar imagens antigas marcadas
    const camposAntigos = Object.keys(dadosAtualizados).filter(
      (k) => k.startsWith("_") && k.endsWith("_anterior")
    );
    for (const campo of camposAntigos) {
      const urlAntiga = dadosAtualizados[campo];
      if (!urlAntiga) continue;

      const path = extractPathFromUrl(urlAntiga, "imagens");
      if (path) {
        const { error: removeError } = await supabase.storage
          .from("imagens")
          .remove([path]);
        if (removeError)
          console.warn("Erro ao deletar imagem antiga:", removeError.message);
      }
    }

    atualizarLista()
    }


  // 🔹 DELETE - deletar registro
  const deletar = async (id) => {
    const { error } = await supabase.from(nomeTabela).delete().eq(campoId, id)
    if (error) throw error
    atualizarLista()
  }

  // 🔹 Filtro local (busca por ID ou nome)
  const pesquisaFiltrada = useMemo(() => {
    const idStr = String(objeto?.[campoId] ?? "").trim()
    const nome = String(objeto?.[campoNome] ?? "").toLowerCase().trim()

    return data.filter((item) => {
      if (idStr) {
        return String(item?.[campoId] ?? "") === idStr
      }
      return String(item?.[campoNome] ?? "")
        .toLowerCase()
        .includes(nome)
    })
  }, [data, objeto, campoId, campoNome])

  useEffect(() => {
    setPesquisa(pesquisaFiltrada)
  }, [pesquisaFiltrada])

  // quando o ID mudar, atualiza o objeto com o encontrado
  useEffect(() => {
    const idStr = String(objeto?.[campoId] ?? "").trim()
    if (!idStr) return
    const encontrado = data.find(
      (item) => String(item?.[campoId] ?? "") === idStr
    ) 
    if (encontrado) setObjeto(encontrado)
  }, [objeto?.[campoId], data, campoId, setObjeto])

  // 🔹 Dispara operação CRUD
  const fazerEnvio = async (event) => {
    event.preventDefault()
    console.log("fazerEnvio chamado com operacao:", operacao, "e objeto:", objeto)
    try {
      if (operacao === "1") {
        await criar(objeto)
        alert("Adicionado com sucesso!")
      } else if (operacao === "2") {
        await alterar(objeto?.[campoId], objeto)
        alert("Alterado com sucesso!")
      } else if (operacao === "3") {
        await deletar(objeto?.[campoId])
        alert("Deletado com sucesso!")
      } else {
        alert("Selecione uma operação valida!")
      }
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar. Tente novamente.")
    }
  }

  const alterarObjeto = (event, campo) => {
    setObjeto((prev) => ({ ...prev, [campo]: event.target.value }))
  }

  return { data, pesquisa, loading, fazerEnvio, alterarObjeto, atualizarLista }
}

export default useBancoDeDados
