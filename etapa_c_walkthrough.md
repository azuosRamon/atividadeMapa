# Walkthrough: Consolidação Inicial do Projeto

Este documento valida e detalha o que foi concluído hoje na etapa de estabilização do `atividadeMapa` (conhecida como "Recomendação C do Brainstorm"), visando adequar dívidas técnicas e fechar brechas críticas de segurança antes de escalar o software.

### Alterações Realizadas

1. **Schema Seguro (Banco de Dados)**
   - O arquivo **[SUPABASE.SQL](file:///c:/Users/ramon/Documents/mapa/atividadeMapa/SUPABASE.SQL)** foi inteiramente renovado com a versão corrigida exportada da base real (livre de colunas com senhas não encriptadas e erros de sintaxe).
   - Ao final desse mesmo arquivo, **adicionamos os comandos `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`** para garantir que a base de dados em produção não fique aberta para varreduras públicas e invasões através da `anon_key`.

2. **Segurança Frontend (EmailJS e LocalStorage)**
   - **[ObserverEmail.jsx](file:///c:/Users/ramon/Documents/mapa/atividadeMapa/src/components/ObserverEmail.jsx)**: removemos as chaves (`SERVICE_ID` e `PUBLIC_KEY`) que estavam hardcoded. Agora a aplicação vai buscar por variáveis de ambiente (`import.meta.env.VITE_EMAILJS...`) no seu arquivo `.env`, o que reduz muito o risco de exporem seu serviço de email.
   - **[PaginaLogin.jsx](file:///c:/Users/ramon/Documents/mapa/atividadeMapa/src/components/pages/PaginaLogin.jsx)**: arrumamos o salvamento do `usuario` no `localStorage`. Agora o Front vai descartar senhas, dados cadastrais pesados ou confidenciais, guardando em disco **apenas** informações de relevância rápida para a Interface (ex: `user_id`, `nóme`, `tipo` e a `imagem` de perfil). Isso foi feito para garantir a sua instrução de que a **foto de perfil de logs continue aparecendo na plataforma sem que isso vire uma brecha XSS**.

3. **Remoção de Mocks Pesados ([App.jsx](file:///c:/Users/ramon/Documents/mapa/atividadeMapa/src/App.jsx))**
   - Retiramos da linha 49 até 194 quase **150 linhas de dados hardcoded** (CPFs falsos, telefones e senhas) que estavam estaticamente incluídos no projeto. O array inicial agora reside alinhado limpo e preparado para a futura integração total de API.

4. **Vulnerabilidade `eval()`**
   - Checamos o seu backend em **[backend/main.py](file:///c:/Users/ramon/Documents/mapa/atividadeMapa/backend/main.py)** e **constatamos** que ele não estava vulnerável, pois já utilizava a conversão inofensiva de JSON (`json.loads(dados)`)! Trata-se de uma dívida paga.

---

### O que foi Testado
-  **Build do Vite:** O comando `npm run build` foi disparado e construiu o bundle em `13.14s` sem erros. A remoção dos Mocks pesados e dependências indevidas não quebrou as estruturas das suas páginas (rotas).

---

### 👉 Próximos Passos (Para você)
1. Certifique-se de preencher as chaves de API do Email no seu `.env`. (`VITE_EMAILJS_SERVICE_ID=...`)
2. Copie os novos comandos do final do arquivo **[SUPABASE.SQL](file:///c:/Users/ramon/Documents/mapa/atividadeMapa/SUPABASE.SQL)** e rode eles diretos no console visual do Supabase (SQL Editor) para "ligar" os cadeados de RLS oficiais.
3. Observe como o dashboard processa a imagem do usuário no cache local com mais naturalidade em seu próximo Login!
