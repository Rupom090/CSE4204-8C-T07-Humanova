from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from services.claim_extractor import extract_claims
from services.semantic_analyzer import analyze_similarity
from services.contradiction_detector import detect_contradiction

app = FastAPI(title="Humanova AI Verification Microservice")

class TextRequest(BaseModel):
    text: str

class ClaimEvidenceRequest(BaseModel):
    claim: str
    evidence: str

class RetrieveEvidenceRequest(BaseModel):
    claim: str

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Humanova AI Verification"}

@app.post("/extract-claims")
def extract(request: TextRequest):
    claims = extract_claims(request.text)
    return {"claims": claims}

@app.post("/analyze-similarity")
def analyze(request: ClaimEvidenceRequest):
    score = analyze_similarity(request.claim, request.evidence)
    return {"similarity_score": score}

@app.post("/detect-contradiction")
def detect(request: ClaimEvidenceRequest):
    result = detect_contradiction(request.claim, request.evidence)
    return result

@app.post("/retrieve-evidence")
def retrieve(request: RetrieveEvidenceRequest):
    # Mocking retrieval for now. In reality, this would hit Serper/Tavily/Google Custom Search
    return {
        "status": "verified",
        "evidence_score": 0.85,
        "contradiction_score": 0.10,
        "explanation": "Strong evidence found supporting this claim.",
        "sources": [
            {"type": "web", "url": "https://example.com/source1", "title": "Example Authoritative Source", "authority": 0.9, "retrieval_score": 0.85}
        ],
        "contradictions": []
    }
