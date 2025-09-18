import { useState, useEffect} from "react";
import axios from "axios";

function SelectBancoDeDados({ nomeTabela, setData, setLoading }) {


    setLoading(true);
    axios.get(`https://backend-mapa.onrender.com/${nomeTabela}/`)
      .then(resp => setData(resp.data))
      .catch(() => alert("Erro ao carregar dados!"))
      .finally(() => setLoading(false));


}

export default SelectBancoDeDados;
