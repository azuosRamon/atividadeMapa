import { useState, useEffect, useMemo } from "react"
import { supabase } from "../../supabaseClient" // importa o cliente já configurado

function useBancoDeDados({
  nomeTabela,
  objeto,
  setObjeto,
  operacao,
  campoId = "id",
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

    const { error } = await supabase
        .from(nomeTabela)
        .update(semId) // agora sem o campo id
        .eq(campoId, id)

    if (error) throw error
    atualizarLista()
    }


  // 🔹 DELETE - deletar registro
  const deletar = async (id) => {
    const { error } = await supabase.from(nomeTabela).delete().eq(campoId, id)
    if (error) throw error
    atualizarLista()
  }

  

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
