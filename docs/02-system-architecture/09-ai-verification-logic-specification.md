# Humanova — AI Verification Logic Specification

Version: 1.0  
Classification: Core Intelligence Architecture  
Priority Level: Critical

---

# 1. Document Purpose

This document defines:

- hallucination detection logic
- evidence verification methodology
- confidence scoring formulas
- contradiction analysis
- explainability architecture
- semantic verification workflows

This document represents:
> the core intellectual verification architecture of Humanova.

---

# 2. Verification Philosophy

Humanova does NOT attempt to determine:
> absolute truth.

Instead, Humanova estimates:

- evidence-supported reliability
- contradiction probability
- citation legitimacy
- semantic consistency
- confidence explainability

---

# Verification Principles

| Principle | Description |
|---|---|
| evidence-first | claims require evidence |
| explainability | scoring must be transparent |
| probabilistic reasoning | no binary truth claims |
| weighted analysis | multiple signals combined |
| contextual verification | meaning-aware analysis |

---

# 3. Hallucination Definition Model

Humanova classifies hallucinations as:

> AI-generated content that lacks verifiable evidence, contradicts reliable evidence, fabricates entities/sources, or presents misleading certainty.

---

# 4. Hallucination Classification System

---

# Primary Classification Types

| Type | Description |
|---|---|
| unsupported_claim | no evidence found |
| fabricated_entity | fake person/org/product |
| fake_citation | nonexistent source |
| broken_reference | dead/invalid URL |
| contradiction | evidence conflicts |
| fabricated_statistic | unverifiable numbers |
| outdated_information | obsolete claims |
| uncertainty_overconfidence | weak evidence presented confidently |

---

# Severity Levels

| Severity | Meaning |
|---|---|
| low | uncertain |
| medium | partially unsupported |
| high | likely hallucinated |
| critical | fabricated/fake |

---

# 5. Verification Pipeline Architecture

## Full Verification Workflow

```text
AI Response
     ↓
Text Normalization
     ↓
Claim Extraction
     ↓
Entity Recognition
     ↓
Claim Classification
     ↓
Evidence Retrieval
     ↓
Semantic Similarity Analysis
     ↓
Contradiction Detection
     ↓
Citation Verification
     ↓
Confidence Scoring
     ↓
Explainability Generation
```

---

# 6. Text Normalization Layer

## Responsibilities

Normalize:

- whitespace
- malformed URLs
- punctuation
- duplicated content
- formatting inconsistencies

---

# Preprocessing Rules

| Rule | Purpose |
|---|---|
| lowercase normalization | consistency |
| unicode normalization | compatibility |
| token cleanup | NLP optimization |

---

# 7. Claim Extraction Logic

## Objective

Extract:

- factual statements
- statistics
- references
- dates
- named entities

---

# Extraction Categories

| Category | Example |
|---|---|
| factual claim | “OpenAI was founded in 2015” |
| statistic | “AI usage increased 300%” |
| citation | DOI references |
| URL | external links |
| entity | people/orgs |

---

# Extraction Workflow

```text
Input Text
     ↓
Sentence Segmentation
     ↓
NER Analysis
     ↓
Fact Candidate Detection
     ↓
Claim Structuring
```

---

# Extraction Confidence

Each extracted claim receives:

```text
claim_confidence ∈ [0–1]
```

Based on:

- linguistic certainty
- entity confidence
- parser confidence

---

# 8. Entity Recognition Logic

## NLP Models

Recommended:

- spaCy
- transformer-based NER

---

# Supported Entity Types

| Type | Examples |
|---|---|
| PERSON | Elon Musk |
| ORG | OpenAI |
| DATE | 2025 |
| PRODUCT | GPT-4 |
| DOI | research references |

---

# Entity Validation

Entities checked against:

- trusted datasets
- web retrieval
- citation metadata
- semantic databases

---

# 9. Evidence Retrieval Architecture

## Retrieval Strategy

Humanova uses:
> hybrid retrieval architecture.

Combines:

- semantic retrieval
- keyword retrieval
- trusted-source retrieval

---

# Retrieval Sources

| Source | Priority |
|---|---|
| research papers | critical |
| government databases | high |
| Wikipedia | medium |
| verified news | medium |
| trusted websites | medium |

---

# Retrieval Workflow

```text
Claim
   ↓
Query Expansion
   ↓
Source Retrieval
   ↓
Evidence Ranking
   ↓
Evidence Selection
```

---

# Retrieval Scoring

Evidence scored by:

```text
retrieval_score ∈ [0–1]
```

Factors:

- semantic match
- authority
- recency
- source reliability

---

# 10. Semantic Similarity Logic

## Objective

Measure:
> semantic alignment between AI claim and retrieved evidence.

---

# Similarity Models

Recommended:

- sentence-transformers
- MiniLM
- mpnet-base

---

# Similarity Formula

```text
semantic_similarity =
cosine_similarity(claim_embedding, evidence_embedding)
```

---

# Similarity Thresholds

| Score | Meaning |
|---|---|
| 0.90–1.00 | strong alignment |
| 0.75–0.89 | moderate alignment |
| 0.50–0.74 | weak alignment |
| below 0.50 | unreliable |

---

# 11. Contradiction Detection Logic

## Objective

Identify:

- conflicting evidence
- factual disagreement
- logical inconsistencies

---

# Methodology

Uses:

- Natural Language Inference (NLI)

---

# NLI Outputs

| Output | Meaning |
|---|---|
| entailment | supports claim |
| contradiction | conflicts claim |
| neutral | insufficient evidence |

---

# Contradiction Formula

```text
contradiction_penalty =
contradiction_probability × severity_weight
```

---

# Severity Weights

| Severity | Weight |
|---|---|
| low | 0.1 |
| medium | 0.3 |
| high | 0.6 |
| critical | 1.0 |

---

# 12. Citation Verification Logic

## Verification Checks

| Check | Description |
|---|---|
| DOI existence | metadata validation |
| URL validity | HTTP check |
| SSL validity | security validation |
| metadata consistency | title/author/year |

---

# Citation Scoring

```text
citation_validity_score =
(metadata_score + url_score + source_authority) / 3
```

---

# Citation Failure Rules

| Failure | Classification |
|---|---|
| dead URL | broken_reference |
| nonexistent DOI | fake_citation |
| metadata mismatch | suspicious_citation |

---

# 13. Broken Link Verification Logic

## Workflow

```text
URL
  ↓
DNS Resolution
  ↓
SSRF Validation
  ↓
HTTP Request
  ↓
Redirect Analysis
  ↓
Trust Evaluation
```

---

# URL Scoring

| Condition | Score Impact |
|---|---|
| HTTP 200 | positive |
| SSL valid | positive |
| excessive redirects | negative |
| timeout | negative |
| blocked domain | critical negative |

---

# SSRF Protection Rules

Blocked:

- localhost
- internal networks
- metadata IPs
- private IP ranges

---

# 14. Uncertainty Detection Logic

## Objective

Detect:

- speculative phrasing
- weak confidence language
- ambiguous certainty

---

# Uncertainty Keywords

Examples:

- may
- might
- possibly
- likely
- approximately
- uncertain

---

# Important Principle

Uncertainty alone:
> does NOT equal hallucination.

It contributes only as:

```text
uncertainty_penalty
```

---

# Penalty Formula

```text
uncertainty_penalty =
keyword_frequency × contextual_weight
```

---

# 15. Confidence Scoring Architecture

## Core Philosophy

Humanova uses:
> explainable multi-factor weighted scoring.

---

# Final Confidence Formula

```text
final_confidence_score =
(
semantic_similarity_weight +
source_authority_weight +
citation_validity_weight +
community_validation_weight
)
-
(
contradiction_penalty +
uncertainty_penalty +
fabrication_penalty
)
```

---

# Weight Distribution

| Factor | Weight |
|---|---|
| semantic similarity | 30% |
| source authority | 20% |
| citation validity | 15% |
| community validation | 10% |
| contradiction penalty | -15% |
| uncertainty penalty | -5% |
| fabrication penalty | -25% |

---

# Confidence Categories

| Score | Meaning |
|---|---|
| 90–100 | highly verified |
| 70–89 | reliable |
| 50–69 | partially reliable |
| 30–49 | suspicious |
| below 30 | likely hallucinated |

---

# 16. Explainability Engine

## Objective

Every score must explain:

- why score exists
- supporting evidence
- detected risks
- contradiction reasoning

---

# Explainability Output

```json
{
  "confidence": 82,
  "reasons": [
    "Strong semantic similarity detected.",
    "One citation could not be verified."
  ]
}
```

---

# Explainability Components

| Component | Purpose |
|---|---|
| evidence explanation | trust transparency |
| contradiction explanation | risk clarity |
| scoring breakdown | mathematical visibility |

---

# 17. Community Verification Weighting

## Community Signals

| Signal | Impact |
|---|---|
| trusted verifier approval | positive |
| report confirmations | positive |
| repeated fake reports | negative |

---

# Reputation Weight Formula

```text
community_weight =
(verifier_reputation × approval_confidence)
```

---

# 18. AI Provider Reliability Scoring

## Objective

Track:

- hallucination frequency
- citation accuracy
- contradiction rate
- user trust

---

# Provider Reliability Formula

```text
provider_reliability =
(
verified_outputs /
total_outputs
)
× trust_modifier
```

---

# 19. Adaptive Learning Architecture

## Future Expansion

Humanova may later support:

- adaptive scoring
- semantic clustering
- hallucination knowledge graphs
- provider behavior learning

---

# Future Intelligence Pipeline

```text
Reports
   ↓
Semantic Clustering
   ↓
Pattern Detection
   ↓
Provider Intelligence
   ↓
Adaptive Scoring
```

---

# 20. False Positive Mitigation

## Critical Principle

Humanova must avoid:
> aggressive hallucination labeling.

---

# Mitigation Strategies

| Strategy | Purpose |
|---|---|
| weighted scoring | balanced analysis |
| explainability | transparency |
| evidence diversity | reduce bias |
| confidence ranges | uncertainty handling |

---

# 21. Failure Handling Logic

## Failure Types

| Failure | Handling |
|---|---|
| retrieval unavailable | unverifiable |
| provider timeout | retry |
| low evidence confidence | lower score |
| conflicting evidence | warning state |

---

# Degradation Rules

If evidence retrieval fails:

- do NOT claim hallucination
- classify as:

```text
insufficient evidence
```

---

# 22. Analytics Logic

## Stored Metrics

| Metric | Purpose |
|---|---|
| hallucination rate | provider analysis |
| contradiction frequency | trust trends |
| citation validity | source reliability |
| uncertainty ratio | response quality |

---

# 23. Benchmarking Strategy

## Evaluation Datasets

Recommended:

- TruthfulQA
- FEVER
- HotpotQA
- custom hallucination datasets

---

# Evaluation Metrics

| Metric | Purpose |
|---|---|
| precision | false positive reduction |
| recall | hallucination capture |
| F1 score | balanced evaluation |

---

# 24. Security & Abuse Prevention

## Abuse Risks

| Risk | Protection |
|---|---|
| manipulated evidence | source ranking |
| malicious URLs | SSRF protection |
| fake citations | DOI validation |
| spam reports | moderation |

---

# 25. Final Verification Philosophy

Humanova does NOT attempt:

- universal truth detection
- ideological judgment
- absolute certainty

Humanova instead provides:
> explainable probabilistic trust intelligence.

---

# 26. Final Intelligence Vision

Humanova’s verification system is designed to evolve into:

> a scalable explainable AI trust intelligence engine capable of analyzing, verifying, ranking, and governing AI-generated information across enterprise and research ecosystems.
