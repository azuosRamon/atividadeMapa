  # CODEBASE.md — Guia de Padrões do Projeto atividadeMapa

> **LEIA ANTES DE ESCREVER QUALQUER CÓDIGO.**
> Este documento define os padrões de código que TODOS os agentes devem seguir para manter consistência no projeto.

---

## 🏗️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Vite + React Router DOM |
| Estilização | **Styled Components** (NÃO usar Tailwind, NÃO usar CSS puro inline ad-hoc) |
| Banco de Dados | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (bucket `imagens`) |
| Backend | FastAPI (Python) — apenas auth/sessão |
| Cache | Redis via Upstash |
| Deploy | Vercel |

---

## 🎨 Sistema de Cores — `Cores.js`

**SEMPRE importar e usar as cores do arquivo `src/components/Cores.js`.**
**NUNCA escrever cores hardcoded em styled-components.**

```js
import cores from "../Cores"

// Cores principais
cores.cor1              // #66ffff  (ciano claro – destaque)
cores.cor2              // #33cccc  (ciano médio)
cores.cor3              // #00a2a2  (ciano escuro – cor primária)
cores.corHover          // #33cccc
cores.corBorda          // #00a2a2

// Textos
cores.corTexto          // #fff (texto padrão)
cores.corTextoClaro     // #cccccc
cores.corTextoEscuro    // rgb(38,38,38)

// Backgrounds
cores.backgroundBox          // rgba(70,70,70,1)
cores.backgroundMenus        // rgba(0,0,0,.2)
cores.backgroundBotaoSemFoco // rgb(38,38,38)
cores.backgroundBotaoSemFoco2// rgb(55,55,55)
cores.backgroundColapse      // rgb(38,38,38)
cores.backgroundInput        // #333
cores.backgroundMapa         // rgba(0,0,0,0.9)

// Status / Ações
cores.corAdicionar   // #00a2a2  (verde-ciano – botão Adicionar)
cores.corEditar      // #7c5b08  (marrom – botão Alterar)
cores.corDeletar     // #ff4d4d  (vermelho – botão Deletar)

// Disponibilidade
cores.corDisponivel    // #a2f47b
cores.corIndisponivel  // #f48787
cores.corParcial       // #d17f5b
```

> ⚠️ **Tema escuro por padrão.** Backgrounds são escuros, textos são claros.

---

## 📁 Nomenclatura de Arquivos e Componentes

| Tipo | Prefixo | Exemplo |
|------|---------|---------|
| Componentes visuais reutilizáveis | `Sub` | `SubButton.jsx`, `SubModal.jsx` |
| Hooks/funções de banco Supabase | `Bd` | `BdSupabase.jsx`, `BdLerTabela.jsx` |
| Páginas de menu (rotas logadas) | `Menu` | `MenuCursos.jsx`, `MenuEdificio.jsx` |
| Páginas públicas | `Pagina` | `PaginaLogin.jsx` |
| Arquivo de definição de tabelas | `BdObjeto` | `BdObjetoTabelas.js` |

---

## 🗄️ Padrão de CRUD — `useBancoDeDados` Hook

**SEMPRE usar o hook `useBancoDeDados` de `BdSupabase.jsx` para operações CRUD.**

```jsx
import useBancoDeDados from "../BdSupabase"

const { data, pesquisa, loading, fazerEnvio, alterarObjeto, atualizarLista } = useBancoDeDados({
  nomeTabela: "nome_da_tabela",   // string — nome exato no Supabase
  objeto,                          // estado atual do formulário
  setObjeto,                       // setter do estado
  operacao,                        // "0"=nenhuma, "1"=criar, "2"=alterar, "3"=deletar
  campoId: "nome_id",              // campo PK da tabela (ex: "categoria_id")
  campoNome: "nome",               // campo nome para pesquisa
})
```

**Regras do hook:**
- `operacao` é sempre **string** (`"1"`, `"2"`, `"3"`)
- Campos com prefixo `_` no objeto são tratados como temporários (não enviados ao Supabase)
- Campos com sufixo `_anterior` são usados para deletar imagens antigas do Storage

---

## 📋 Padrão de Definição de Tabelas — `BdObjetoTabelas.js`

**Toda nova tabela/entidade deve ser registrada em `BdObjetoTabelas.js`.**

```js
nomeEntidade: {
  tabela: {
    nome: "nome_tabela_supabase",
    lista: ["campo_id", "nome"],   // colunas para exibir na tabela
    camposPesquisa: false,
    mostrar: true
  },
  operacao: 0,   // 0 = com seletor de operação, 1 = fixo em "Adicionar"
  campos: {
    campo_id: {
      valor: null,
      tipo: "number",
      campo: "input",       // "input" | "select" | "textarea"
      texto: "Id",
      nome: "id",
      mostrar: false        // false = campo oculto no formulário
    },
    nome: {
      valor: "",
      tipo: "text",
      campo: "input",
      texto: "Nome",
      nome: "nome",
      required: true
    },
    // Campo select (FK):
    empresa_id: {
      valor: null,
      tipo: "text",
      campo: "select",
      texto: "Empresa",
      nome: "empresa_id",
      tabela: "empresas",           // tabela estrangeira
      lista: ["empresa_id", "nome"], // [valorId, labelExibição]
      mostrar: false
    }
  }
}
```

---

## 🧩 Padrão de Componente de Menu (Rota Logada)

**Estrutura padrão de um `Menu*.jsx`:**

```jsx
import React, { useState } from "react"
import styled from "styled-components"
import Box from "../SubBox"
import Title from "../SubTitleH2"
import useBancoDeDados from "../BdSupabase"
import CriarCamposFormulario from "../SubCriadorForm"
import mapa from "../BdObjetoTabelas"

// 1. Definir o grid do formulário com styled-components
const FormGrid = styled.form`
  gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "tabela tabela tabela"
    "operacao operacao operacao"
    "nome nome nome"
    ". reset botoes";

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

// 2. Função principal
function MenuNomeEntidade({ usuarioLogado }) {
  const tabela = mapa.nomeEntidade
  const [objeto, setObjeto] = useState(
    Object.fromEntries(
      Object.entries(tabela.campos).map(([k, v]) => [k, v.valor])
    )
  )
  const [operacao, setOperacao] = useState("0")

  const { fazerEnvio, alterarObjeto } = useBancoDeDados({
    nomeTabela: tabela.tabela.nome,
    objeto, setObjeto, operacao,
    campoId: tabela.tabela.lista[0],
    campoNome: tabela.tabela.lista[1],
  })

  return (
    <Box>
      <Title>Título da Seção</Title>
      <FormGrid onSubmit={fazerEnvio}>
        <CriarCamposFormulario
          item={tabela}
          setFuncao={alterarObjeto}
          operacao={operacao}
          setOperacao={setOperacao}
          objeto={objeto}
        />
      </FormGrid>
    </Box>
  )
}

export default MenuNomeEntidade
```

---

## 🎨 Estilização — Styled Components

**Regras:**
1. **SEMPRE** `styled-components` — nunca estilos inline ad-hoc ou classes CSS globais
2. **SEMPRE** usar `cores.*` para cores
3. Layout padrão é `CSS Grid` com `grid-template-areas`
4. Responsividade padrão: breakpoint `768px` → `flex-direction: column`
5. Componentes base (Button, Input, Label etc.) ficam nos arquivos `Sub*.jsx`
6. Extend styled-components quando precisar variações: `styled(Button)\`...\``

```jsx
// ✅ Correto
const Titulo = styled.h2`
  color: ${cores.cor1};
  background: ${cores.backgroundBox};
`

// ❌ Errado
<h2 style={{ color: "#66ffff" }}>...</h2>
```

---

## 🗺️ Grid Areas (Padrão de Layout de Formulário)

Todo formulário segue o padrão de `grid-template-areas`. Os campos do `BdObjetoTabelas.js` usam seus `nome` como grid-area.

```css
grid-template-areas:
  "tabela tabela tabela"
  "operacao operacao operacao"
  "campo1 campo1 campo2"
  ". reset botoes";
```

- `tabela` → exibe a tabela de consulta
- `operacao` → dropdown de Adicionar/Alterar/Deletar
- `reset` → botão Limpar
- `botoes` → botão de Submit

---

## 🔐 Hierarquia de Permissões

```
moderador → administrador → gerente → usuarioBasico → visitante
```

- `empresa_id` do `usuarioLogado` deve ser passado automaticamente nos campos hidden
- Campos com `mostrar: false` e `nome: "empresa_id"` são preenchidos via `usuarioLogado.empresa_id`

---

## 🚫 Anti-Padrões (PROIBIDO)

| Proibido | Use em vez |
|----------|------------|
| Tailwind CSS | Styled Components |
| CSS inline ad-hoc `style={{}}` | Componentes styled |
| Cores hardcoded `"#ff0000"` | `cores.corDeletar` |
| Fetch ao Supabase direto no componente | Hook `useBancoDeDados` |
| Nova entidade sem registro em `BdObjetoTabelas.js` | Registrar SEMPRE |
| `eval()` | `JSON.parse()` |
| Dados mock hardcoded em componentes | Buscar do Supabase |

---

## 📦 Importações Padrão

```js
// Supabase client
import { supabase } from "../../supabaseClient"

// Hook CRUD
import useBancoDeDados from "../BdSupabase"

// Mapa de tabelas
import mapa from "../BdObjetoTabelas"

// Cores
import cores from "../Cores"

// Componentes base
import Box from "../SubBox"
import Title from "../SubTitleH2"
import Button from "../SubButton"
import Input from "../SubInput"
import Label from "../SubLabel"
import Select from "../SubSelect"
import GridArea from "../SubGridArea"
import Modal from "../SubModal"
import Colapse from "../SubColapse"
import TabelaCompleta from "../SubTabela"
import CriarCamposFormulario from "../SubCriadorForm"
```
