import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import Select from "./SubSelect";


function SelectComDados({tabela = "", listaColunas = ["id", "nome"], campoDesejado = listaColunas, value, itemValue, change, condicao = null }) {
  const [dados, setDados] = useState([])
  const select = listaColunas.join(", ")
  let query = supabase
    .from(tabela)
    .select("*")
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
    <Select value={value ?? "0"} onChange={(e) => change(e,listaColunas[0])}>
      <option value="0">Selecione uma opção</option>
      {dados.map((c) => (
        <option key={c[listaColunas[0]]} value={(c?.[`${itemValue}`])}>
          {
          campoDesejado.map(item => c[item]).join(" - ")
          }
        </option>
      ))}
    </Select>
  )
}

export default SelectComDados;