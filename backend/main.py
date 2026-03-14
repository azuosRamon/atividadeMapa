from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from redis import Redis
from dotenv import load_dotenv
import os
import json


# 🔹 Carrega variáveis de ambiente
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
UPSTASH_REDIS_URL = os.getenv("UPSTASH_REDIS_URL")
UPTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")

# 🔹 Instancia clientes
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
redis = Redis(UPSTASH_REDIS_URL, decode_responses=True)

app = FastAPI()

origins = [            # desenvolvimento local
    "http://localhost:5173",
    "https://atividade-mapa.vercel.app"   # seu frontend hospedado
]

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods=["*"],  # inclui OPTIONS
    allow_headers=["*"],
)
# ---------------------------
# ROTA DE LOGIN
# ---------------------------
@app.post("/login")
async def login(req: Request):
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
    tipo = "empresa" if empresa else "usuario"

    dados['tipo'] = tipo


    # 🔹 Armazena no Redis com expiração (24h)
    redis.setex(f"user:{user.id}", 60 * 60 * 24, json.dumps(dados))

    return {"mensagem": "Login bem-sucedido", "user": dados}

# ---------------------------
# ROTA DE VALIDAÇÃO
# ---------------------------
@app.get("/sessao/{user_id}")
async def validar_sessao(user_id: str):
    dados = redis.get(f"user:{user_id}")
    if not dados:
        raise HTTPException(status_code=401, detail="Sessão expirada ou não encontrada")
    return {"user": eval(dados)}

# ---------------------------
# LOGOUT
# ---------------------------
@app.post("/logout/{user_id}")
async def logout(user_id: str):
    redis.delete(f"user:{user_id}")
    return {"mensagem": "Logout realizado com sucesso"}
