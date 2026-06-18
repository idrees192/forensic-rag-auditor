from backend.rag_engine import retrieve_context
from backend.generator import generate_answer

question = input("Question: ")

context, docs = retrieve_context(question)

answer = generate_answer(
    question,
    context
)

print("\nANSWER:\n")
print(answer)
