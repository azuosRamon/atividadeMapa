import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"


function LerDados({setLoading = false, tabela = "campi", listaColunas = ["id", "nome"], campoDesejado = listaColunas, condicao = null }) {
  const [dados, setDados] = useState([])
  const select = listaColunas.join(", ")
  let query = supabase
    .from(tabela)
    .select(select)
    if (condicao) {
      query = query.eq(condicao.coluna, condicao.valor)
    }
  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const { data, error } = await query
      
      if (error) {
        console.error("Erro ao buscar dados:", error)
      } else {
        //console.log(data);
        setLoading(false)
        setDados(data)
      }
    }

    fetch()
  }, [])

  return (dados)
}

export default LerDados;