# Humanova — System Architecture Diagram Document

Version: 1.0  
Project Type: Enterprise AI Trust Governance Platform  
Architecture Style: Hybrid Multi-Tenant AI Middleware Architecture

---

# 1. Architecture Overview

Humanova is designed as a modular, scalable, multi-tenant AI trust governance platform capable of:

- AI response generation
- hallucination detection
- citation verification
- explainable scoring
- provider orchestration
- enterprise analytics
- community-driven verification

The system follows:

- service-oriented modular architecture
- async queue-based processing
- AI microservice orchestration
- enterprise RBAC enforcement

---

# 2. High-Level System Architecture

```text
┌─────────────────────────────────────────────┐
│                React Frontend              │
│---------------------------------------------│
│ Dashboard UI                               │
│ AI Studio                                  │
│ Verification Interface                     │
│ Analytics                                  │
│ Reports                                    │
│ Community Moderation                       │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│           Laravel API Gateway              │
│---------------------------------------------│
│ Authentication                              │
│ RBAC                                        │
│ Organization Isolation                      │
│ API Routing                                 │
│ Request Validation                          │
│ Rate Limiting                               │
└─────────────────────────────────────────────┘
                     │
         ┌───────────┴────────────┐
         ▼                        ▼

┌───────────────────────┐   ┌───────────────────────┐
│   AI Orchestration    │   │ Verification Engine   │
│-----------------------│   │-----------------------│
│ Provider Selection    │   │ Claim Extraction      │
│ Token Tracking        │   │ Contradiction Check   │
│ Retry/Fallback        │   │ Citation Validation   │
│ Cost Optimization     │   │ Link Verification     │
└───────────────────────┘   └───────────────────────┘
         │                        │
         ▼                        ▼

┌───────────────────────┐   ┌───────────────────────┐
│ Python AI Services    │   │ Scoring Engine        │
│-----------------------│   │-----------------------│
│ NLP Models            │   │ Confidence Scoring    │
│ Embeddings            │   │ Explainability        │
│ Semantic Similarity   │   │ Risk Weighting        │
│ NLI Models            │   │ Evidence Aggregation  │
└───────────────────────┘   └───────────────────────┘
         │                        │
         └──────────┬─────────────┘
                    ▼

┌─────────────────────────────────────────────┐
│               Redis Queue Layer            │
│---------------------------------------------│
│ Scan Processing                             │
│ Link Validation                             │
│ PDF Exports                                 │
│ Analytics Jobs                              │
│ Retry Workers                               │
└─────────────────────────────────────────────┘
                    │
                    ▼

┌─────────────────────────────────────────────┐
│                 MySQL Database             │
│---------------------------------------------│
│ Users                                       │
│ Organizations                               │
│ AI Generations                              │
│ Verification Results                        │
│ Analytics                                   │
│ Reports                                     │
│ Audit Logs                                  │
└─────────────────────────────────────────────┘
```

---

# 3. Frontend Architecture

## Framework

- React 19
- TypeScript
- Vite

---

## Frontend Module Structure

```text
src/
├── app/
├── components/
├── modules/
├── pages/
├── services/
├── hooks/
├── stores/
├── layouts/
├── utils/
└── types/
```

---

# Core Frontend Modules

| Module | Purpose |
|---|---|
| Dashboard | analytics & overview |
| AI Studio | prompt generation |
| Verification | scan results |
| Reports | PDF exports |
| Community | moderation system |
| Settings | org/user management |

---

# Frontend State Architecture

## Client State

- Zustand

## Server State

- TanStack Query

---

# Frontend Security

Mandatory:

- protected routes
- token expiration handling
- RBAC-aware rendering
- organization isolation

---

# 4. Backend Architecture

## Framework

Laravel 12

---

# Backend Layer Structure

```text
app/
├── Actions/
├── DTOs/
├── Events/
├── Jobs/
├── Listeners/
├── Modules/
├── Policies/
├── Repositories/
├── Services/
└── Traits/
```

---

# Backend Responsibilities

| Layer | Responsibility |
|---|---|
| Controllers | request handling |
| Services | business logic |
| Repositories | data abstraction |
| Jobs | async processing |
| Policies | RBAC enforcement |
| Events | orchestration triggers |

---

# API Architecture Pattern

```text
Client Request
      ↓
Middleware
      ↓
Controller
      ↓
Service Layer
      ↓
Repository Layer
      ↓
Database
```

---

# Middleware Stack

| Middleware | Purpose |
|---|---|
| auth | authentication |
| throttle | rate limiting |
| tenant | org isolation |
| permissions | RBAC |
| csrf | security |

---

# 5. Multi-Tenant Architecture

## Tenant Isolation Model

```text
Platform
   ↓
Organization
   ↓
Workspace
   ↓
Users
```

---

# Tenant Isolation Rules

Every request must validate:

- organization ownership
- permission access
- workspace scope

---

# Isolation Strategy

| Layer | Isolation |
|---|---|
| database queries | org_id filtering |
| file exports | tenant scoped |
| analytics | tenant segmented |
| API keys | tenant isolated |

---

# 6. AI Provider Orchestration Architecture

## Supported Providers

- OpenAI
- Gemini
- DeepSeek

---

# Provider Abstraction Layer

```text
Provider Adapter Interface
│
├── OpenAI Adapter
├── Gemini Adapter
└── DeepSeek Adapter
```

---

# Responsibilities

| Function | Description |
|---|---|
| normalization | standard response format |
| token counting | unified tracking |
| retries | provider fallback |
| cost tracking | pricing analytics |

---

# Provider Selection Logic

Selection factors:

- user preference
- organization policy
- provider health
- token pricing
- latency

---

# 7. AI Verification Engine Architecture

## Verification Workflow

```text
AI Response
      ↓
Claim Extraction
      ↓
Entity Detection
      ↓
Evidence Retrieval
      ↓
Semantic Similarity
      ↓
Contradiction Analysis
      ↓
Confidence Scoring
      ↓
Explainability Layer
```

---

# AI Verification Components

| Component | Purpose |
|---|---|
| Claim Extractor | identify factual claims |
| Entity Detector | identify entities |
| Retrieval Engine | fetch evidence |
| Similarity Engine | semantic comparison |
| Contradiction Engine | conflict detection |
| Scoring Engine | confidence calculation |

---

# 8. Python AI Microservice Architecture

## Framework

FastAPI

---

# AI Service Structure

```text
ai_service/
├── embeddings/
├── models/
├── pipelines/
├── providers/
├── retrieval/
├── scoring/
├── utils/
└── verification/
```

---

# AI Service Responsibilities

| Service | Function |
|---|---|
| embeddings | semantic vectors |
| NLI engine | contradiction detection |
| retrieval engine | evidence retrieval |
| scoring engine | trust scoring |
| NLP parser | claim extraction |

---

# Communication Architecture

## Laravel ↔ Python

Communication via:

- REST APIs
- async requests
- queued jobs

---

# 9. Queue & Async Processing Architecture

## Queue Infrastructure

Redis + Laravel Horizon

---

# Queue Categories

| Queue | Purpose |
|---|---|
| scans | hallucination scans |
| verification | evidence retrieval |
| links | URL checks |
| exports | PDF generation |
| analytics | aggregation |

---

# Queue Workflow

```text
Request
   ↓
Job Dispatch
   ↓
Queue
   ↓
Worker Processing
   ↓
Status Update
```

---

# Retry Policy

| Type | Retries |
|---|---|
| AI provider timeout | 3 |
| link verification | 2 |
| PDF generation | 2 |

---

# 10. Database Architecture

## Primary Database

MySQL 8

---

# Core Database Domains

| Domain | Purpose |
|---|---|
| identity | users/orgs |
| AI generation | prompts/responses |
| verification | scans/evidence |
| analytics | metrics |
| audit | logs |

---

# Database Optimization

Mandatory:

- indexed scans
- tenant filtering
- partitioning strategy
- analytics preaggregation

---

# 11. Security Architecture

## Core Security Layers

```text
User
  ↓
Authentication
  ↓
RBAC Validation
  ↓
Tenant Isolation
  ↓
API Validation
  ↓
Business Logic
```

---

# API Key Security

Mandatory:

- AES-256 encryption
- masked display
- secure decryption only when required

---

# SSRF Protection

Blocked:

- localhost
- internal IP ranges
- metadata IPs
- unsafe protocols

---

# Rate Limiting

Redis-backed throttling:

- auth endpoints
- AI generation
- scan requests

---

# 12. Analytics Architecture

## Analytics Pipeline

```text
Events
   ↓
Aggregation Jobs
   ↓
Analytics Snapshots
   ↓
Dashboard Rendering
```

---

# Analytics Categories

| Category | Purpose |
|---|---|
| hallucination trends | trust metrics |
| provider rankings | provider reliability |
| token usage | cost analytics |
| moderation | community insights |

---

# 13. PDF Export Architecture

## PDF Workflow

```text
Scan Result
    ↓
Template Renderer
    ↓
Chart Injection
    ↓
PDF Queue Job
    ↓
Storage
    ↓
Download Link
```

---

# PDF Infrastructure

## Engine

- DomPDF

---

# Export Storage

Stored:

- organization-scoped
- access-controlled
- audit logged

---

# 14. Community Verification Architecture

## Moderation Workflow

```text
Report Submission
      ↓
Moderator Review
      ↓
Trusted Verification
      ↓
Approval/Rejection
      ↓
Knowledge Base Update
```

---

# Reputation Architecture

Factors:

- approved reports
- verifier accuracy
- moderation activity

---

# 15. DevOps Architecture

## Container Topology

```text
frontend
backend
python-ai-service
mysql
redis
nginx
```

---

# Deployment Environments

| Environment | Purpose |
|---|---|
| local | development |
| staging | QA |
| production | live system |

---

# CI/CD Pipeline

```text
Git Push
   ↓
Linting
   ↓
Testing
   ↓
Docker Build
   ↓
Deployment
```

---

# 16. Observability Architecture

## Logging

| Layer | Logging |
|---|---|
| frontend | error tracking |
| backend | structured logs |
| AI services | inference logs |
| queues | job logs |

---

# Monitoring

## Current

- Laravel logs
- Sentry

## Future

- Prometheus
- Grafana

---

# 17. Scalability Strategy

## Horizontal Scaling Targets

Prepared for:

- 10k+ users
- queue expansion
- AI worker scaling
- analytics scaling

---

# Scaling Layers

| Layer | Scaling Method |
|---|---|
| frontend | CDN |
| backend | horizontal instances |
| queues | worker scaling |
| AI services | dedicated workers |

---

# 18. Failure Recovery Architecture

## Graceful Degradation Rules

| Failure | Handling |
|---|---|
| provider failure | fallback provider |
| queue overload | delayed processing |
| AI timeout | retry |
| export failure | regenerate |

---

# Disaster Recovery

Mandatory:

- DB backups
- queue recovery
- export regeneration
- log persistence

---

# 19. Future Expansion Readiness

Prepared for:

- browser extensions
- public APIs
- SDKs
- AI governance APIs
- vector search
- semantic clustering
- enterprise compliance

---

# 20. Final Architecture Vision

Humanova is architected as:

> a scalable AI trust governance infrastructure platform combining AI orchestration, explainable verification, hallucination intelligence, enterprise analytics, and collaborative moderation into a unified modular ecosystem.
