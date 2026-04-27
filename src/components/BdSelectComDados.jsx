import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import Select from "./SubSelect";
import SubSelectAutocomplete from "./SubSelectAutocomplete";


function SelectComDados({tabela = "", listaColunas = ["id", "nome"], campoDesejado = listaColunas, value, itemValue, change, condicao = null }) {
  const [dados, setDados] = useState([])
  const select = listaColunas.join(", ")
  let usuarioLocal = localStorage.getItem("usuario");
  let usuarioInfo = usuarioLocal ? JSON.parse(usuarioLocal) : null;
  let empresaIdLocal = usuarioInfo?.empresa_id || null;

  let query = supabase
    .from(tabela)
    .select("*")
    
  const tabelasSemEmpresa = ["funcoes", "modelos", "tipos_areas", "usuarios"];

  if (condicao) {
    query = query.eq(condicao.coluna, condicao.valor)
  } else if (empresaIdLocal && !tabelasSemEmpresa.includes(tabela)) {
    query = query.eq('empresa_id', empresaIdLocal)
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
    <SubSelectAutocomplete 
        dados={dados} 
        itemValue={itemValue} 
        campoDesejado={campoDesejado} 
        listaColunas={listaColunas} 
        value={value} 
        onChange={change} 
    />
  )
}

export default SelectComDados;