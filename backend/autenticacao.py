from fastapi import FastAPI, HTTPException
import redis
from supabase import create_client, Client
import os
from pathlib import Path
from dotenv import load_dotenv

app = FastAPI()

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=ROOT / ".env")

# Conexão com Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Conexão com Redis (externo)
r = redis.from_url(
    os.getenv("REDIS_URL"),
    decode_responses=True
)

@app.post("/login")
def login(email: str, senha: str):
    res = supabase.auth.sign_in_with_password({"email": email, "password": senha})
    user = res.user

    if not user:
        raise HTTPException(status_code=401, detail="Usuário ou senha inválidos")

    # Salva os dados no Redis com o user_id como chave
    r.set(f"user:{user.id}", user.model_dump_json(), ex=3600 * 24)  # expira em 24h

    return {"message": "Login bem-sucedido", "user_id": user.id}

@app.get("/sessao/{user_id}")
def verificar_sessao(user_id: str):
    dados = r.get(f"user:{user_id}")
    if not dados:
        raise HTTPException(status_code=401, detail="Sessão expirada ou inválida")
    return {"user": dados}
