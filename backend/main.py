from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from supabase import create_client, Client
from redis import Redis
from dotenv import load_dotenv
import os
import json
import traceback

# 🔹 Carrega variáveis de ambiente
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
UPSTASH_REDIS_URL = os.getenv("UPSTASH_REDIS_URL")

# 🔹 Instancia clientes
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

redis = None
if UPSTASH_REDIS_URL:
    try:
        # Upstash normalmente usa TLS/SSL (rediss://), mas aceita rediss ou redis.
        redis = Redis.from_url(UPSTASH_REDIS_URL, decode_responses=True, ssl=True, ssl_cert_reqs=None)
        # teste rápido de conexão
        redis.ping()
    except Exception as e:
        print("[WARNING] Não foi possível conectar ao Redis Upstash:", e)
        redis = None

app = FastAPI()

origins = [            # desenvolvimento local
    "http://localhost:5173",
    "https://atividade-mapa.vercel.app",
    "https://atividademapa.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # inclui OPTIONS
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }
    status_code = getattr(exc, 'status_code', 500)
    detail = getattr(exc, 'detail', str(exc))
    return JSONResponse(
        status_code=status_code,
        content={"detail": detail},
        headers=headers,
    )
# ---------------------------
# ROTA DE LOGIN
# ---------------------------
@app.post("/login")
async def login(req: Request):
    try:
        body = await req.json()
        email = body.get("email")
        password = body.get("password")

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email e senha são obrigatórios")

        # 🔹 Login no Supabase
        res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        user = getattr(res, "user", None)
        error = getattr(res, "error", None)

        if error or not user:
            raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")

        # 🔹 Busca dados adicionais
        empresa_res = (
            supabase.from_("empresas")
            .select("empresa_id, user_id, nome, cnpj, email, imagem")
            .eq("user_id", user.id)
            .maybe_single()
            .execute()
        )
        empresa = getattr(empresa_res, "data", None)

        usuario_res = (
            supabase.from_("sessao_usuario_view")
            .select("*")
            .eq("user_id", user.id)
            .maybe_single()
            .execute()
        )
        usuario = getattr(usuario_res, "data", None)

        dados = empresa or usuario
        if not dados:
            raise HTTPException(status_code=404, detail="Dados de usuário não encontrados")

        tipo = "empresa" if empresa else "usuario"
        dados['tipo'] = tipo

        # 🔹 Armazena no Redis com expiração (24h), se disponível
        # Temporariamente desabilitado para evitar erros de conexão
        # if redis:
        #     try:
        #         redis.setex(f"user:{user.id}", 60 * 60 * 24, json.dumps(dados))
        #     except Exception as e:
        #         print("[WARNING] falha ao gravar sessão no Redis:", e)
        # else:
        #     print("[WARNING] redis não configurado: sessão não será persistida")

        return {"mensagem": "Login bem-sucedido", "user": dados}

    except HTTPException:
        raise
    except Exception as e:
        print("[ERROR] login exception:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Erro interno no login")

# ---------------------------
# ROTA DE VALIDAÇÃO
# ---------------------------
@app.get("/sessao/{user_id}")
async def validar_sessao(user_id: str):
    # Temporariamente retorna erro, pois Redis não está funcionando
    raise HTTPException(status_code=503, detail="Sessão Redis não disponível temporariamente")

# ---------------------------
# LOGOUT
# ---------------------------
@app.post("/logout/{user_id}")
async def logout(user_id: str):
    # Temporariamente sem Redis
    # if redis:
    #     try:
    #         redis.delete(f"user:{user_id}")
    #     except Exception as e:
    #         print("[WARNING] falha ao excluir sessão no Redis:", e)
    # else:
    #     print("[WARNING] redis não configurado: logout apenas no cliente")
    return {"mensagem": "Logout realizado com sucesso"}
