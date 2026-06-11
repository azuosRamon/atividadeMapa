// SelectBancoDeDados.js
import { supabase } from "../../supabaseClient"

async function SelectBancoDeDados({ nomeTabela, setData, setLoading, condicao = null }) {
  setLoading(true)
  let query = supabase.from(nomeTabela).select("*")
  if (condicao) {
    query = query.eq(condicao.coluna, condicao.valor)
  }
  const { data, error } = await query

  if (error) {
    console.error(error)
    alert("Erro ao carregar dados!")
  } else {
    setData(data || [])
  }
  console.log("=============="+nomeTabela+"==============")
  console.log(data)
  setLoading(false)
}

export default SelectBancoDeDados

