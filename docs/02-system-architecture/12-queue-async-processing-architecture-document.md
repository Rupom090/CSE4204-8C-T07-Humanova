# Humanova — Queue & Async Processing Architecture Document

Version: 1.0  
Architecture Type: Distributed Async Processing Infrastructure  
Queue Engine: Redis + Laravel Horizon

---

# 1. Queue Architecture Philosophy

Humanova performs:

- AI generation
- hallucination verification
- citation validation
- link scanning
- PDF generation
- analytics aggregation

These operations are:

- compute-intensive
- network-dependent
- latency-sensitive

Therefore Humanova requires:

> distributed asynchronous processing architecture.

---

# Core Queue Principles

| Principle | Purpose |
|---|---|
| non-blocking operations | responsive UI |
| workload isolation | stability |
| retry safety | reliability |
| prioritization | performance |
| horizontal scalability | future growth |
| observability | diagnostics |

---

# 2. Queue System Overview

## Queue Stack

| Component | Technology |
|---|---|
| queue backend | Redis |
| queue orchestration | Laravel Horizon |
| workers | Laravel Queue Workers |
| AI processing | Python microservices |
| monitoring | Horizon + Logs |

---

# High-Level Queue Architecture

```text
Frontend Request
      ↓
Laravel API
      ↓
Job Dispatch
      ↓
Redis Queue
      ↓
Worker Processing
      ↓
Result Storage
      ↓
Frontend Polling/WebSocket Future
```

---

# 3. Async Processing Strategy

---

# Synchronous vs Async Rules

## Synchronous Operations

| Operation | Reason |
|---|---|
| login | fast |
| role validation | lightweight |
| dashboard fetch | cached |

---

## Async Operations

| Operation | Reason |
|---|---|
| hallucination scans | compute-heavy |
| PDF exports | rendering-heavy |
| citation verification | network-heavy |
| link validation | external requests |
| analytics aggregation | batch processing |

---

# Async Design Goal

Prevent:

- request blocking
- frontend freezing
- timeout failures

---

# 4. Queue Categories

---

# Queue Classification

Humanova separates queues by:

- workload type
- priority
- compute intensity

---

# Primary Queues

| Queue | Purpose |
|---|---|
| generation | AI response generation |
| scans | hallucination verification |
| verification | evidence retrieval |
| links | broken link validation |
| exports | PDF generation |
| analytics | metrics aggregation |
| notifications | emails/in-app alerts |
| moderation | report processing |

---

# Queue Isolation Philosophy

Heavy jobs must NOT block:

- authentication
- dashboard loading
- lightweight APIs

---

# 5. Queue Priority Architecture

---

# Priority Levels

| Priority | Queue Types |
|---|---|
| critical | scans |
| high | generation |
| medium | exports |
| low | analytics |

---

# Priority Execution Rules

```text
critical
   ↓
high
   ↓
medium
   ↓
low
```

---

# Queue Starvation Prevention

Mandatory:

- weighted balancing
- reserved worker pools
- queue concurrency controls

---

# 6. Job Lifecycle Architecture

---

# Generic Job Lifecycle

```text
Queued
   ↓
Reserved
   ↓
Processing
   ↓
Completed
```

---

# Failure States

```text
Failed
Retrying
Cancelled
Timed Out
```

---

# Status Definitions

| Status | Meaning |
|---|---|
| queued | waiting |
| processing | active |
| completed | success |
| failed | unrecoverable |
| retrying | retry scheduled |

---

# 7. AI Generation Queue Architecture

---

# Purpose

Handles:

- provider requests
- prompt optimization
- response generation

---

# Workflow

```text
Prompt Request
      ↓
Queue Dispatch
      ↓
Provider Selection
      ↓
Generation Execution
      ↓
Response Normalization
      ↓
Persistence
```

---

# AI Queue Challenges

| Challenge | Handling |
|---|---|
| provider timeout | retries |
| quota exceeded | fallback provider |
| malformed response | validation |

---

# Retry Policy

| Condition | Retries |
|---|---|
| timeout | 3 |
| provider unavailable | 3 |
| rate limit | exponential retry |

---

# 8. Hallucination Scan Queue Architecture

---

# Purpose

Processes:

- claim extraction
- evidence retrieval
- contradiction analysis
- confidence scoring

---

# Scan Workflow

```text
Scan Request
      ↓
Claim Extraction Job
      ↓
Evidence Retrieval Job
      ↓
Contradiction Job
      ↓
Scoring Job
      ↓
Explainability Job
```

---

# Parallel Processing Strategy

Independent claims processed:

- concurrently
- batched where possible

---

# Performance Goal

Average scan completion:

```text
<10 seconds
```

---

# 9. Verification Queue Architecture

---

# Verification Responsibilities

| Task | Description |
|---|---|
| semantic retrieval | evidence fetch |
| citation validation | DOI checks |
| authority scoring | trust ranking |

---

# Queue Decomposition

Large verification jobs split into:

- claim-level subtasks
- retrieval subtasks
- scoring subtasks

---

# Queue Optimization

Mandatory:

- batching
- parallel execution
- timeout controls

---

# 10. Broken Link Verification Queue

---

# Purpose

Validates:

- URLs
- SSL
- redirects
- DNS

---

# Link Validation Workflow

```text
URL Extraction
      ↓
Security Validation
      ↓
DNS Resolution
      ↓
HTTP Verification
      ↓
Metadata Validation
```

---

# Queue Safety Rules

Mandatory:

- SSRF filtering
- redirect limits
- timeout limits

---

# Request Timeout

Maximum:

```text
5 seconds
```

---

# Batch Processing

URLs processed:

- in parallel batches
- with concurrency caps

---

# 11. PDF Export Queue Architecture

---

# Purpose

Generate:

- scan reports
- analytics summaries
- moderation exports

---

# Export Workflow

```text
Export Request
      ↓
Template Rendering
      ↓
Chart Injection
      ↓
PDF Generation
      ↓
Storage
      ↓
Notification
```

---

# Queue Requirements

Mandatory:

- memory limits
- timeout protection
- export retries

---

# Export Retry Rules

| Failure | Retries |
|---|---|
| rendering failure | 2 |
| storage failure | 2 |

---

# 12. Analytics Aggregation Queue

---

# Purpose

Precompute:

- hallucination metrics
- provider rankings
- token analytics

---

# Aggregation Workflow

```text
Events
   ↓
Aggregation Jobs
   ↓
Analytics Snapshots
   ↓
Dashboard Cache
```

---

# Scheduling Strategy

| Type | Frequency |
|---|---|
| provider analytics | hourly |
| dashboard summaries | every 15 min |
| global trends | daily |

---

# 13. Notification Queue Architecture

---

# Notification Types

| Type | Channel |
|---|---|
| scan completion | email/in-app |
| export ready | email |
| moderation updates | in-app |
| quota alerts | email |

---

# Notification Workflow

```text
Event Trigger
      ↓
Notification Queue
      ↓
Delivery Service
      ↓
Status Logging
```

---

# Retry Rules

| Failure | Retries |
|---|---|
| SMTP timeout | 3 |
| provider failure | 2 |

---

# 14. Moderation Queue Architecture

---

# Purpose

Processes:

- hallucination reports
- evidence review
- moderation actions

---

# Workflow

```text
Report Submission
      ↓
Moderation Queue
      ↓
Verifier Assignment
      ↓
Approval/Rejection
```

---

# Queue Rules

Mandatory:

- abuse prevention
- spam throttling
- reputation-aware prioritization

---

# 15. Worker Architecture

---

# Worker Types

| Worker | Purpose |
|---|---|
| AI workers | generation |
| verification workers | scans |
| export workers | PDFs |
| analytics workers | aggregation |

---

# Dedicated Worker Pools

Workers isolated by:

- queue category
- compute intensity
- memory usage

---

# Worker Scaling Strategy

Future-ready for:

- autoscaling
- distributed clusters
- Kubernetes orchestration

---

# 16. Worker Resource Management

---

# Resource Controls

| Resource | Limit |
|---|---|
| memory | queue-specific |
| timeout | queue-specific |
| concurrency | configurable |

---

# Heavy Job Controls

Mandatory:

- job chunking
- memory cleanup
- timeout enforcement

---

# 17. Retry & Failure Architecture

---

# Retry Philosophy

Retries should:

- recover transient failures
- avoid infinite loops

---

# Retry Strategies

| Strategy | Usage |
|---|---|
| immediate retry | transient errors |
| exponential backoff | provider failures |
| dead-letter fallback | unrecoverable jobs |

---

# Exponential Backoff Example

```text
1 min
2 min
5 min
10 min
```

---

# 18. Dead Letter Queue Architecture

---

# Purpose

Store:

- permanently failed jobs
- diagnostics
- recovery candidates

---

# Dead Letter Workflow

```text
Failure Threshold
      ↓
Move to Failed Jobs
      ↓
Admin Review
      ↓
Replay or Archive
```

---

# Failed Job Retention

| Queue | Retention |
|---|---|
| scans | 30 days |
| exports | 14 days |
| analytics | 7 days |

---

# 19. Queue Monitoring Architecture

---

# Monitoring Goals

Detect:

- stuck jobs
- worker crashes
- queue overload
- timeout spikes

---

# Monitoring Tools

| Tool | Purpose |
|---|---|
| Laravel Horizon | queue visibility |
| Sentry | exception tracking |
| logs | diagnostics |

---

# Metrics Tracked

| Metric | Purpose |
|---|---|
| queue latency | performance |
| failure rate | reliability |
| retry count | instability |
| processing time | optimization |

---

# 20. Queue Security Architecture

---

# Queue Threats

| Threat | Risk |
|---|---|
| poisoned jobs | critical |
| replay attacks | medium |
| oversized payloads | high |

---

# Queue Protections

Mandatory:

- payload validation
- retry limits
- memory restrictions
- signed jobs future-ready

---

# Sensitive Data Rules

Sensitive data:

- never logged raw
- encrypted if stored
- masked in diagnostics

---

# 21. Database Queue Tables

---

# Required Tables

| Table | Purpose |
|---|---|
| jobs | active jobs |
| failed_jobs | failed jobs |
| scan_processing_queue | scan tracking |
| provider_retry_queue | retry scheduling |

---

# Queue Persistence Rules

Mandatory:

- transactional dispatch
- failure persistence
- retry tracking

---

# 22. Async API Design Rules

---

# Async Response Example

```json
{
  "job_id": "job_123",
  "status": "queued"
}
```

---

# Polling Endpoint Example

```http
GET /jobs/{id}/status
```

---

# Future Real-Time Support

Prepared for:

- WebSockets
- server-sent events
- real-time progress bars

---

# 23. Scalability Strategy

---

# Scalability Targets

Prepared for:

- 10k+ users
- large scan workloads
- enterprise analytics
- AI-heavy traffic

---

# Scaling Methods

| Layer | Strategy |
|---|---|
| workers | horizontal scaling |
| queues | queue partitioning |
| AI services | independent scaling |

---

# Future Queue Expansion

Prepared for:

- distributed Redis clusters
- Kafka integration
- event-driven architecture

---

# 24. Disaster Recovery Strategy

---

# Queue Recovery Goals

Recover:

- failed scans
- interrupted exports
- analytics rebuilds

---

# Recovery Mechanisms

Mandatory:

- failed job replay
- retry persistence
- queue restoration

---

# Backup Rules

| Component | Backup |
|---|---|
| queue metadata | yes |
| failed jobs | yes |
| analytics snapshots | yes |

---

# 25. Future Async Evolution

Prepared for:

- AI agent orchestration
- distributed event systems
- real-time verification pipelines
- streaming analytics

---

# 26. Final Queue Architecture Vision

Humanova’s async infrastructure is designed to evolve into:

> a scalable distributed AI workload orchestration system capable of handling high-volume hallucination verification, provider orchestration, analytics processing, and enterprise trust intelligence through resilient asynchronous processing architecture.
