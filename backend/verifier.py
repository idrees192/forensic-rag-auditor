_classifier = None
_nltk_ready = False

def _load_classifier():
    global _classifier, _nltk_ready
    if _classifier is not None:
        return

    try:
        from transformers import pipeline
        import nltk
    except Exception as e:
        raise RuntimeError(f"Verifier dependencies are missing: {e}")

    # Download required NLTK resources if missing
    try:
        nltk.data.find("tokenizers/punkt")
    except LookupError:
        nltk.download("punkt")

    try:
        nltk.data.find("tokenizers/punkt_tab")
    except LookupError:
        nltk.download("punkt_tab")

    _nltk_ready = True

    # NLI Model
    _classifier = pipeline(
        "text-classification",
        model="roberta-large-mnli"
    )

# Friendly labels for UI
label_map = {
    "ENTAILMENT": "✅ VERIFIED",
    "NEUTRAL": "⚠ UNVERIFIED",
    "CONTRADICTION": "❌ HALLUCINATION"
}


def verify_claims(answer, context):
    """
    Verifies each sentence in the generated answer
    against the retrieved source context.
    """

    _load_classifier()

    import nltk

    sentences = nltk.sent_tokenize(answer)

    results = []

    for sentence in sentences:

        # Skip empty sentences
        if not sentence.strip():
            continue

        nli_input = f"{context[:700]} </s></s> {sentence[:150]}"

        prediction = _classifier(
            nli_input,
            truncation=True,
            max_length=512
        )

        if isinstance(prediction, list):
            prediction = prediction[0]

        results.append({
            "claim": sentence,
            "label": label_map.get(
                prediction["label"],
                prediction["label"]
            ),
            "raw_label": prediction["label"],
            "score": round(float(prediction["score"]), 4)
        })

    return results


def calculate_trust_score(results):

    if not results:
        return 0

    score = 0

    for r in results:

        if r["raw_label"] == "ENTAILMENT":
            score += 1

        elif r["raw_label"] == "NEUTRAL":
            score += 0.5

        elif r["raw_label"] == "CONTRADICTION":
            score += 0

    trust_score = (score / len(results)) * 100

    return round(trust_score, 2)