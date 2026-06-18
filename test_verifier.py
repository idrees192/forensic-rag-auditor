from backend.verifier import verify_claims, calculate_trust_score

context = """
PCA is a dimensionality reduction technique.
"""

answer = """
PCA is a dimensionality reduction technique.
PCA was invented in 2024.
"""

results = verify_claims(answer, context)

print("\nAUDIT REPORT\n")

for r in results:
    print(f"Claim: {r['claim']}")
    print(f"Status: {r['label']}")
    print(f"Confidence: {r['score']}")
    print("-" * 50)

trust_score = calculate_trust_score(results)

print(f"\nTRUST SCORE: {trust_score}%")