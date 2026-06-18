from backend.rag_engine import retrieve_context

question = input("Ask a question: ")

context = retrieve_context(question)

print("\nRetrieved Context:\n")
print("=" * 50)
print(context)