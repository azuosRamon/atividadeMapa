# 🧠 Brainstorm: Visão Geral do Projeto — atividadeMapa

> Gerado em: 17/03/2026

---

## 📌 O que é o projeto?

Uma **plataforma SaaS multi-tenant** para gestão e mapeamento de espaços físicos de instituições (universidades, empresas, colégios). O sistema permite:

- Localizar salas/ambientes em plantas baixas interativas (imagem + coordenadas)
- Gerenciar quadro de funcionamento (quem ocupa qual espaço, quando)
- Cadastrar empresas/instituições como clientes
- Controlar usuários com hierarquia de funções

### Hierarquia de Funções
```
Moderador (Devs) → Administrador (Empresa) → Gerente → Usuário Básico → Visitante
```

---

## 🏗️ Arquitetura Atual

```
Frontend (React + Vite) → Supabase (Auth + PostgreSQL)
                               ↓
                     Backend FastAPI (Python)
                               ↓
                       Redis Upstash (cache/sessão)
                               ↓
                     Vercel (deploy frontend)
```

| Camada | Tecnologia | Status |
|--------|-----------|--------|
| Frontend | React + Vite + React Router | ✅ Ativo |
| Auth / DB | Supabase | ✅ Ativo |
| Backend | FastAPI (Python) | ⚠️ Parcial |
| Cache | Redis (Upstash) | ✅ Integrado |
| Deploy | Vercel | ✅ Ativo |

---

## 🗂️ Módulos do Sistema

| Módulo | Rota | Status |
|--------|------|--------|
| Pesquisa pública de salas | `/` | ✅ |
| Mapa interativo (Slide) | `/slide` | ✅ |
| Login / Auth | `/login` | ✅ |
| Recuperar / Redefinir Senha | `/RecuperarSenha` | ✅ |
| Dashboard logado | `/dashboard` | ✅ |
| Perfil do usuário | `/editarPerfil` | ✅ |
| Edificios (Campus/Bloco/Pavimento/Sala) | `/edificio` | ✅ |
| Horários / Períodos | `/periodoHorarios` | ✅ |
| Cursos / Categorias | `/categorias` | ✅ |
| Disciplinas / Produtos | `/produtos` | ✅ |
| Quadro de Aulas | `/quadroAulas` | ✅ |
| Cadastro de usuários | `/cadastroUsuario` | ✅ |
| Empresas | `/cadastroEmpresas` | ✅ |
| Funções / Cargos | `/funcoes`, `/cargos` | ✅ |
| Tipos de Área | `/tiposAreas` | ✅ |
| Modelos | `/modelos` | ✅ |
| Contratos | `/cadastroContrato` | ✅ |
| Disponibilidade | `/cadastrarDisponibilidade` | ✅ |
| Agenda Semanal | `/visualizarAgendaSemanal` | ✅ |
| Relacionar Usuários | `/relacionarUsuarios` | ✅ |

---

## 🔍 Evolução do Schema (Tendência de Generalização)

O projeto está migrando de "Mapa de Universidade" para um produto horizontal genérico:

| Nome Antigo (Universitário) | Nome Novo (Genérico) |
|----------------------------|----------------------|
| `campi` | `imoveis` |
| `salas` | `comodos` |
| `cursos` | `categorias` |
| `disciplinas` | `produtos` |
| `quadro_de_aulas` | `quadro_de_funcionamento` |

---

## ⚠️ Dívidas Técnicas Identificadas

| Área | Problema | Risco |
|------|---------|-------|
| [App.jsx](file:///c:/Users/Daniel/Desktop/Projetin%20FELAS/atividadeMapa/src/App.jsx) | Dados mock hardcoded (usuários, salas, horários) | ⚠️ Médio |
| [SUPABASE.SQL](file:///c:/Users/Daniel/Desktop/Projetin%20FELAS/atividadeMapa/SUPABASE.SQL) | Erros de sintaxe (`PRIMAY KEY`, `set default`, `unique INT`) | ⚠️ Médio |
| [backend/main.py](file:///c:/Users/Daniel/Desktop/Projetin%20FELAS/atividadeMapa/backend/main.py) linha 94 | `eval(dados)` — vulnerabilidade de execução de código | 🔴 Crítico |
| Rotas do frontend | Inconsistentes (`/produtos` = disciplinas, `/categorias` = cursos) | ⚠️ Baixo |
| Backend FastAPI | Apenas login/sessão — resto vai direto ao Supabase | ⚠️ Médio |

---

## 💡 Direções Estratégicas

### Opção A — Finalizar o SaaS Universitário
Completar o produto voltado para universidades com foco em mapa + quadro de aulas + ocupação de salas.

✅ Escopo claro e já bem desenvolvido  
✅ Mercado educacional brasileiro é grande  
❌ Concorrência com ERPs acadêmicos estabelecidos  
📊 **Esforço:** Médio

---

### Opção B — Pivotar para SaaS Genérico de Espaços
O renaming das tabelas já aponta para isso. Atender qualquer negócio que gerencie espaços físicos (coworkings, clínicas, hotéis, escolas).

✅ Mercado maior  
✅ A base de código já está caminhando para isso  
❌ Requer rebranding e generalização das telas  
📊 **Esforço:** Médio-Alto

---

### Opção C — Consolidar Antes de Expandir *(Recomendada como 1º passo)*
Resolver dívidas técnicas: remover dados mock, corrigir schema, eliminar `eval()`, padronizar rotas.

✅ Base sólida para escalar  
✅ Reduz bugs e riscos de segurança  
❌ Não gera funcionalidades novas visíveis  
📊 **Esforço:** Baixo-Médio

---

## 🎯 Recomendação Final

> **C → B** (em sequência)

**Primeiro consolidar**, corrigindo as dívidas técnicas críticas (especialmente a vulnerabilidade de segurança no backend). **Depois generalizar** o produto, já que o schema está caminhando nessa direção.

A arquitetura atual suporta a evolução. O maior risco hoje é técnico, não estratégico.
