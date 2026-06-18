import os
from dotenv import load_dotenv

_model = None

def _load_model():
    global _model

    if _model is not None:
        return

    try:
        import google.generativeai as genai
    except Exception as e:
        raise RuntimeError(
            f"Generator dependencies are missing: {e}"
        )

    load_dotenv()

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY not found in .env file"
        )

    genai.configure(
        api_key=api_key
    )

    _model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )


def generate_answer(question, context):

    _load_model()

    prompt = f"""
You are a helpful assistant.

Answer ONLY using the provided context.

If the answer is not present in the context,
reply exactly with:

I cannot find that information in the document.

Context:
{context}

Question:
{question}
"""

    response = _model.generate_content(prompt)

    return response.text