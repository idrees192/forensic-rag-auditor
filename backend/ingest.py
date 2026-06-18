from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os

def build_vector_database(pdf_path):

    if not os.path.exists(pdf_path):
        print(f"PDF not found: {pdf_path}")
        return

    print("Loading PDF...")

    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    print(f"Pages loaded: {len(documents)}")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_documents(documents)

    print(f"Chunks created: {len(chunks)}")

    print("Loading embedding model...")

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    print("Creating FAISS index...")

    db = FAISS.from_documents(
        chunks,
        embeddings
    )

    db.save_local("faiss_index")

    print("FAISS index saved successfully!")

if __name__ == "__main__":
    build_vector_database("sample.pdf")