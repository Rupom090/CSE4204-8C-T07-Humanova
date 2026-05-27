def extract_claims(text: str) -> list:
    """
    Mock claim extraction logic.
    In a real implementation, this would use a model like spaCy or a fine-tuned transformer 
    to extract factual claims, entities, and citations.
    """
    if not text:
        return []

    # Mocking basic extraction based on sentences
    sentences = text.split('.')
    claims = []
    
    for i, sentence in enumerate(sentences):
        s = sentence.strip()
        if len(s) > 10:
            claims.append({
                "text": s,
                "type": "factual",
                "confidence": 0.85,
                "entities": [],
                "start": text.find(s),
                "end": text.find(s) + len(s)
            })

    return claims
