from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import UploadFile, File
import shutil
import os

from rag_engine import retrieve_context
from generator import generate_answer
from verifier import (
    verify_claims,
    calculate_trust_score
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str


# Home Route
@app.get("/")
def home():
    return {"message": "RAG Auditor API Running"}


# Health Check Route
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "forensic-rag-auditor"
    }

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    os.makedirs("documents", exist_ok=True)

    file_path = os.path.join(
        "documents",
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"PDF saved: {file_path}")

    # Build FAISS automatically (import lazily so app can start without optional deps)
    try:
        from ingest import build_vector_database
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Indexing failed: {e}")

    try:
        build_vector_database(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Indexing failed during processing: {e}")

    return {
        "message": "PDF uploaded and indexed successfully",
        "filename": file.filename
    }

# Main RAG Route
@app.post("/ask")
def ask_question(data: QuestionRequest):

    try:
        context, docs = retrieve_context(data.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrieval failed: {e}")

    answer = generate_answer(
        data.question,
        context
    )

    audit = verify_claims(
        answer,
        context
    )

    trust_score = calculate_trust_score(
        audit
    )

    return {
        "answer": answer,
        "audit": audit,
        "trust_score": trust_score
    }