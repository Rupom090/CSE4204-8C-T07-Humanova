def analyze_similarity(claim: str, evidence: str) -> float:
    """
    Mock semantic similarity logic.
    In reality, this would use a SentenceTransformer model like all-MiniLM-L6-v2
    to calculate cosine similarity between the claim and evidence embeddings.
    """
    # Dummy logic for demonstration
    if not claim or not evidence:
        return 0.0
        
    if claim.lower() in evidence.lower():
        return 0.95
        
    return 0.65
