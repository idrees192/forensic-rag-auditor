import os

def retrieve_context(question):
    """
    Retrieve context from the latest FAISS index.
    Always reloads from disk to pick up newly uploaded documents.
    """
    try:
        from langchain_community.vectorstores import FAISS
        from langchain_huggingface import HuggingFaceEmbeddings
    except Exception as e:
        raise RuntimeError(f"Retrieval dependencies are missing: {e}")

    # Check if FAISS index exists
    if not os.path.exists("faiss_index"):
        raise RuntimeError("No documents have been uploaded yet. Please upload a PDF first.")

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    # Always reload FAISS from disk to get latest index after new uploads
    db = FAISS.load_local(
        "faiss_index",
        embeddings,
        allow_dangerous_deserialization=True
    )

    retriever = db.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}
    )

    docs = retriever.invoke(question)

    context = "\n\n".join([doc.page_content for doc in docs])

    return context, docs