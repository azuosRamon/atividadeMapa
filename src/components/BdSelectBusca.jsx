// SelectBancoDeDados.js
import { supabase } from "../../supabaseClient"

async function SelectBancoDeDados({ nomeTabela, setData, setLoading }) {
  setLoading(true)
  const { data, error } = await supabase.from(nomeTabela).select("*")

  if (error) {
    console.error(error)
    alert("Erro ao carregar dados!")
  } else {
    setData(data || [])
  }
  //console.log("=============="+nomeTabela+"==============")
  //console.log(data)
  setLoading(false)
}

export default SelectBancoDeDados

