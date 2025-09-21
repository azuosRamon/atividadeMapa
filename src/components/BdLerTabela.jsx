import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import Select from "./SubSelect";


function SelectComDados({tabela = "", listaColunas = ["id", "nome"], campoDesejado = listaColunas, itemValue, change, condicao = null }) {
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
      const { data, error } = await query
        
      if (error) {
        console.error("Erro ao buscar dados:", error)
      } else {
        setDados(data)
      }
    }

    fetch()
  }, [])

  return (
    <Select value={itemValue} onChange={(e) => change((prev) => ({ ...prev, [listaColunas[0]]: Number(e.target.value) }))}>
      <option value="0">Selecione uma opção</option>
      {dados.map((c) => (
        <option key={c[listaColunas[0]]} value={c[listaColunas[0]]}>
          {
          campoDesejado.map(item => c[item]).join(" - ")
          }
        </option>
      ))}
    </Select>
  )
}

export default SelectComDados;