import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"


function LerDados({setLoading = false, tabela = "campi", listaColunas = ["id", "nome"], campoDesejado = listaColunas, condicao = null}) {
  const [dados, setDados] = useState([])
  let usuarioLocal = localStorage.getItem("usuario");
  let usuarioInfo = usuarioLocal ? JSON.parse(usuarioLocal) : null;
  let empresaIdLocal = usuarioInfo?.empresa_id || null;
  
  let modeloLocal = localStorage.getItem("modelo");
  let modeloInfo = modeloLocal ? JSON.parse(modeloLocal) : null;
  const colCategoria = modeloInfo?.categorias || "Categoria";
  const colProduto = modeloInfo?.produtos || "Produto";
  const colComodo = modeloInfo?.comodos || "Cômodo";

  let query = supabase
    .from(tabela)
    .select(tabela === 'quadro_de_funcionamento' ? '*, categorias(nome), produtos(nome), usuarios(nome), comodos(numero)' : '*')
    
  const tabelasSemEmpresa = ["funcoes", "modelos", "tipos_areas", "usuarios"];

  if (condicao) {
    query = query.eq(condicao.coluna, condicao.valor)
  } else if (empresaIdLocal && !tabelasSemEmpresa.includes(tabela)) {
    query = query.eq('empresa_id', empresaIdLocal)
  }
  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const { data, error } = await query
      
      if (error) {
        console.error("Erro ao buscar dados:", error)
      } else {
        if (tabela === "quadro_de_funcionamento") {
            const formatado = data.map(d => ({
                ...d,
                [colCategoria]: d.categorias?.nome || "-",
                [colProduto]: d.produtos?.nome || "-",
                "Funcionário": d.usuarios?.nome || "-",
                [colComodo]: d.comodos?.numero || "-"
            }));
            setDados(formatado);
        } else {
            setDados(data);
        }
        setLoading(false)
      }
    }

    fetch()
  }, [])

  return (dados)
}

export default LerDados;