# Forensic RAG Auditor

A Retrieval-Augmented Generation (RAG) system that audits generated answers for hallucinations using Natural Language Inference (NLI).

## Features

- PDF Upload
- FAISS Vector Database
- Semantic Search
- Gemini Answer Generation
- Hallucination Detection
- Trust Score Calculation
- React Frontend
- FastAPI Backend

## Tech Stack

### Backend
- FastAPI
- LangChain
- FAISS
- HuggingFace Embeddings
- Gemini API
- Transformers (RoBERTa MNLI)

### Frontend
- React
- Vite
- Axios
- React Circular Progressbar

## Run Backend

```bash
pip install -r requirements.txt
uvicorn main:app --reload
