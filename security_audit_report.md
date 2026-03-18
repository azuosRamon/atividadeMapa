# 🛡️ Relatório de Auditoria de Segurança: atividadeMapa

> **Data:** 17/03/2026
> **Severidade Máxima Detectada:** 🔴 CRÍTICA (RCE)
> **Status:** Auditoria Concluída

---

## 🛑 Vulnerabilidades Críticas

### 1. Execução de Código Remoto (RCE) via `eval()`
- **Local:** `backend/main.py:94`
- **Descrição:** A rota `/sessao/{user_id}` utiliza a função `eval()` para processar dados vindos do Redis.
- **Impacto:** Um atacante que consiga manipular os dados no Redis (ou durante o fluxo de login) pode executar qualquer comando Python no servidor, obtendo controle total do backend.
- **Remediação:** Substituir `eval(dados)` por `json.loads(dados)`.

---

## 🟠 Vulnerabilidades de Alto Risco

### 2. Ausência de Row Level Security (RLS) no Supabase
- **Local:** [SUPABASE.SQL](file:///c:/Users/Daniel/Desktop/Projetin%20FELAS/atividadeMapa/SUPABASE.SQL) / Configuração do Banco
- **Descrição:** Não há comandos `ENABLE ROW LEVEL SECURITY` nas tabelas. Por padrão, se o RLS não estiver ativo e configurado com políticas (Policies), qualquer pessoa com a `anon_key` pode ler e escrever em qualquer tabela.
- **Impacto:** Exposição total da base de dados (PII de usuários, fotos, contratos, etc).
- **Remediação:** Ativar RLS em todas as tabelas e criar políticas baseadas em `auth.uid()`.

### 3. Exposição de Segredos de Terceiros no Frontend
- **Local:** `src/components/ObserverEmail.jsx:35-36`
- **Descrição:** Chaves do EmailJS (`SERVICE_ID`, `PUBLIC_KEY`) e IDs de templates estão expostos diretamente no código fonte do frontend.
- **Impacto:** Um atacante pode usar essas credenciais para enviar e-mails em nome da aplicação, consumindo créditos ou realizando phishing.
- **Remediação:** Mover a lógica de envio de e-mail para o backend ou usar variáveis de ambiente (`.env`) via Vite, embora segredos no front sempre sejam tecnicamente visíveis.

### 4. Armazenamento Inseguro de Dados Sensíveis (`localStorage`)
- **Local:** `src/components/pages/PaginaLogin.jsx:104-105`
- **Descrição:** Objetos inteiros de `usuario` e `modelo` são guardados em texto puro no `localStorage`.
- **Impacto:** Se o site sofrer um ataque XSS, o atacante pode roubar todos esses dados instantaneamente.
- **Remediação:** Guardar apenas o necessário (como o token/ID de sessão) e buscar os dados sensíveis do backend sob demanda, mantendo-os apenas em memória (State).

---

## 🟡 Vulnerabilidades de Médio Risco

### 5. Senhas Armazenadas em Tabelas Customizadas
- **Local:** [SUPABASE.SQL](file:///c:/Users/Daniel/Desktop/Projetin%20FELAS/atividadeMapa/SUPABASE.SQL) e [MAPA_UNIVERSIDADES.sql](file:///c:/Users/Daniel/Desktop/Projetin%20FELAS/atividadeMapa/MAPA_UNIVERSIDADES.sql)
- **Descrição:** Existe uma coluna `SENHA` nas tabelas `usuarios` e `empresas`. Mesmo que o Supabase Auth seja usado, manter senhas nessas tabelas (provavelmente em plain text ou hash fraco) é perigoso.
- **Impacto:** Vazamento de credenciais em caso de acesso indevido ao banco de dados.
- **Remediação:** Remover colunas de senha das tabelas de aplicação. Confiar exclusivamente no `auth.users` do Supabase.

### 6. Validação de Sessão Fraca
- **Local:** `src/components/AuthProvider.jsx:16`
- **Descrição:** A sessão é validada no backend passando apenas o `user_id` na URL.
- **Impacto:** Como o `user_id` (UUID) pode ser conhecido ou obtido em outras partes do sistema, um atacante pode tentar "adivinhar" sessões ativas.
- **Remediação:** O backend deve validar o `access_token` (JWT) enviado no header `Authorization`, não apenas o ID na URL.

---

## 🔵 Vulnerabilidades de Baixo Risco / Bugs

### 7. Vazamento de Informação em Erros
- **Local:** Diversos componentes (`alert(error)`)
- **Descrição:** Erros brutos do banco de dados ou da API são exibidos diretamente para o usuário via `alert`.
- **Impacto:** Expõe detalhes da infraestrutura, nomes de colunas e lógica interna para potenciais atacantes (Reconnaissance).
- **Remediação:** Tratar erros no frontend e exibir mensagens amigáveis e genéricas para o usuário.

### 8. Falta de Rate Limiting no Backend
- **Local:** [backend/main.py](file:///c:/Users/Daniel/Desktop/Projetin%20FELAS/atividadeMapa/backend/main.py)
- **Descrição:** Não há limites de requisições por IP nas rotas de login e sessão.
- **Impacto:** Suscetibilidade a ataques de força bruta e negação de serviço (DoS).
- **Remediação:** Implementar Middlewares de Rate Limit no FastAPI (ex: `slowapi`).

---

## 🛠️ Próximos Passos Recomendados

1. **URGENTE:** Corrigir o `eval()` no backend.
2. **PRIORITÁRIO:** Ativar e configurar RLS no Supabase.
3. **SEGURANÇA:** Remover dados sensíveis do `localStorage` e usar apenas tokens.
4. **MELHORIA:** Padronizar as rotas da API para exigirem o Bearer Token do Supabase.

---

*Relatório gerado automaticamente pelo Agente de Auditoria de Segurança.*
