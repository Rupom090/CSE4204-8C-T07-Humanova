# Database Architecture Document

## Humanova — AI Trust Governance & Verification Platform

### 1. Database Architecture Overview

#### Database Type

**Primary Database:** MySQL
**Supporting Infrastructure:** Redis (queues + cache), Vector storage layer (future expansion)

#### Database Philosophy

Humanova requires:

- enterprise-grade relational consistency
- multi-tenant isolation
- auditability
- explainable AI traceability
- scalable analytics

Therefore:
**normalized relational architecture with modular intelligence extensions.**

### 2. High-Level Database Topology

```
Core Identity Layer
        ↓
Organization Layer
        ↓
RBAC Layer
        ↓
AI Provider Layer
        ↓
Prompt & Generation Layer
        ↓
Verification Layer
        ↓
Scoring & Explainability Layer
        ↓
Community Intelligence Layer
        ↓
Analytics & Reporting Layer
        ↓
Audit & Compliance Layer
```

### 3. Core Entity Architecture

#### ENTITY GROUP 1 — Identity & Authentication

**TABLE: `users`**
Purpose: Stores all platform users.

| Field | Type |
| :--- | :--- |
| id | bigint |
| organization_id | bigint |
| role_id | bigint |
| name | varchar |
| username | varchar |
| email | varchar |
| password | varchar |
| avatar | varchar |
| email_verified_at | timestamp |
| oauth_provider | varchar |
| oauth_provider_id | varchar |
| status | enum |
| last_login_at | timestamp |
| created_at | timestamp |

**Relationships**

```
users
 ├── belongs_to organizations
 ├── belongs_to roles
 ├── has_many api_keys
 ├── has_many scans
 ├── has_many prompt_histories
 ├── has_many feedback_reports
 └── has_many audit_logs
```

**TABLE: `organizations`**
Purpose: Multi-tenant organization container.

| Field | Type |
| :--- | :--- |
| id | bigint |
| name | varchar |
| slug | varchar |
| logo | varchar |
| owner_user_id | bigint |
| subscription_plan | enum |
| status | enum |
| created_at | timestamp |

**TABLE: `organization_members`**
Purpose: Maps users to organizations.

| Field | Type |
| :--- | :--- |
| id | bigint |
| organization_id | bigint |
| user_id | bigint |
| role_id | bigint |
| invited_by | bigint |
| joined_at | timestamp |

**TABLE: `roles`**
Purpose: RBAC roles.
Default Roles: Guest, User, Researcher, Trusted Verifier, Moderator, Organization Admin, Super Admin

**TABLE: `permissions`**
Purpose: Granular permission definitions.

**TABLE: `role_permissions`**
Purpose: Role-to-permission mappings.

### 4. AI Provider Architecture

**TABLE: `ai_providers`**
Purpose: Stores supported AI providers.

| Field | Type |
| :--- | :--- |
| id | bigint |
| name | varchar |
| slug | varchar |
| provider_type | enum |
| status | enum |
| api_base_url | text |

**TABLE: `provider_models`**
Purpose: Stores provider model definitions.
Example Models: GPT-4o, Gemini 2.5, DeepSeek Chat

**TABLE: `user_api_keys`**
Purpose: Stores encrypted user API credentials.

| Field | Type |
| :--- | :--- |
| id | bigint |
| organization_id | bigint |
| user_id | bigint |
| provider_id | bigint |
| encrypted_key | text |
| masked_key | varchar |
| usage_limit | decimal |
| token_usage | bigint |
| last_used_at | timestamp |
| status | enum |

**Security Requirements Mandatory:**

- AES encryption
- no raw key exposure
- audit tracking

**TABLE: `provider_usage_logs`**
Purpose: Tracks AI provider usage.

| Field | Type |
| :--- | :--- |
| id | bigint |
| provider_id | bigint |
| user_id | bigint |
| organization_id | bigint |
| request_tokens | bigint |
| response_tokens | bigint |
| estimated_cost | decimal |
| latency_ms | integer |
| created_at | timestamp |

### 5. Prompt Intelligence Architecture

**TABLE: `prompts`**
Purpose: Stores original prompts.

| Field | Type |
| :--- | :--- |
| id | bigint |
| organization_id | bigint |
| user_id | bigint |
| original_prompt | longtext |
| optimization_mode | enum |
| token_estimate | integer |
| created_at | timestamp |

**TABLE: `enhanced_prompts`**
Purpose: Stores enhanced prompt versions.

| Field | Type |
| :--- | :--- |
| id | bigint |
| prompt_id | bigint |
| enhanced_prompt | longtext |
| enhancement_strategy | enum |
| token_reduction_percent | decimal |
| created_at | timestamp |

**TABLE: `prompt_versions`**
Purpose: Prompt version history tracking.

### 6. AI Generation Architecture

**TABLE: `ai_generations`**
Purpose: Stores generated AI responses.

| Field | Type |
| :--- | :--- |
| id | bigint |
| organization_id | bigint |
| user_id | bigint |
| provider_id | bigint |
| model_id | bigint |
| prompt_id | bigint |
| response_text | longtext |
| response_mode | enum |
| response_tokens | bigint |
| latency_ms | integer |
| status | enum |
| created_at | timestamp |

**TABLE: `generation_comparisons`**
Purpose: Stores multi-provider comparison scans.

### 7. Verification Engine Architecture

**TABLE: `scans`**
Purpose: Primary hallucination scan records.

| Field | Type |
| :--- | :--- |
| id | bigint |
| organization_id | bigint |
| user_id | bigint |
| generation_id | bigint |
| scan_type | enum |
| overall_confidence | decimal |
| hallucination_score | decimal |
| scan_status | enum |
| created_at | timestamp |

**TABLE: `extracted_claims`**
Purpose: Stores extracted factual claims.

| Field | Type |
| :--- | :--- |
| id | bigint |
| scan_id | bigint |
| claim_text | longtext |
| claim_type | enum |
| confidence | decimal |
| entity_count | integer |

**TABLE: `verification_results`**
Purpose: Stores claim verification outcomes.

| Field | Type |
| :--- | :--- |
| id | bigint |
| claim_id | bigint |
| verification_status | enum |
| evidence_score | decimal |
| contradiction_score | decimal |
| explanation | longtext |

**TABLE: `evidence_sources`**
Purpose: Stores evidence references.

| Field | Type |
| :--- | :--- |
| id | bigint |
| verification_result_id | bigint |
| source_type | enum |
| source_url | text |
| source_title | varchar |
| authority_score | decimal |
| retrieval_score | decimal |

**TABLE: `contradiction_results`**
Purpose: Stores contradiction analysis.

**TABLE: `uncertainty_analysis`**
Purpose: Stores uncertainty keyword detection.

| Field | Type |
| :--- | :--- |
| id | bigint |
| scan_id | bigint |
| keyword | varchar |
| severity | decimal |
| occurrence_count | integer |

### 8. Citation & Link Verification Architecture

**TABLE: `citation_checks`**
Purpose: Citation verification records.

| Field | Type |
| :--- | :--- |
| id | bigint |
| scan_id | bigint |
| citation_text | longtext |
| doi | varchar |
| validity_status | enum |
| metadata_score | decimal |

**TABLE: `link_checks`**
Purpose: Broken link validation results.

| Field | Type |
| :--- | :--- |
| id | bigint |
| scan_id | bigint |
| url | text |
| http_status | integer |
| ssl_valid | boolean |
| redirect_chain | json |
| response_time_ms | integer |
| trust_score | decimal |
| checked_at | timestamp |

#### SSRF Protection Tables

**TABLE: `blocked_domains`**
Purpose: Blacklist dangerous domains/IPs.

**TABLE: `blocked_ip_ranges`**
Purpose: Prevent internal scanning attacks.

### 9. Confidence Scoring Architecture

**TABLE: `confidence_scores`**
Purpose: Stores explainable scoring outputs.

| Field | Type |
| :--- | :--- |
| id | bigint |
| scan_id | bigint |
| semantic_similarity_score | decimal |
| source_authority_score | decimal |
| citation_validity_score | decimal |
| contradiction_penalty | decimal |
| uncertainty_penalty | decimal |
| community_weight | decimal |
| final_score | decimal |

**TABLE: `scoring_explanations`**
Purpose: Human-readable explainability layer.

### 10. Community Intelligence Architecture

**TABLE: `hallucination_reports`**
Purpose: Community-submitted reports.

| Field | Type |
| :--- | :--- |
| id | bigint |
| organization_id | bigint |
| user_id | bigint |
| scan_id | bigint |
| report_reason | enum |
| report_description | longtext |
| moderation_status | enum |
| created_at | timestamp |

**TABLE: `report_votes`**
Purpose: Voting on hallucination reports.

**TABLE: `report_evidence`**
Purpose: Uploaded evidence storage.

**TABLE: `verifier_reviews`**
Purpose: Trusted verifier decisions.

**TABLE: `reputation_scores`**
Purpose: Community trust scoring.

### 11. Analytics Architecture

**TABLE: `analytics_snapshots`**
Purpose: Precomputed analytics aggregation.
**Metrics Stored:** hallucination frequency, provider reliability, token usage, cost trends, moderation activity

**TABLE: `provider_rankings`**
Purpose: Tracks provider performance rankings.

**TABLE: `usage_statistics`**
Purpose: Tracks organization usage metrics.

### 12. PDF & Reporting Architecture

**TABLE: `pdf_exports`**
Purpose: Tracks PDF generation jobs.

| Field | Type |
| :--- | :--- |
| id | bigint |
| organization_id | bigint |
| user_id | bigint |
| export_type | enum |
| file_path | text |
| export_status | enum |
| generated_at | timestamp |

**TABLE: `report_templates`**
Purpose: Organization branding templates.

### 13. Audit & Compliance Architecture

**TABLE: `audit_logs`**
Purpose: Central immutable activity logging.
**Logged Events:** authentication, scans, exports, moderation, API usage, role changes

**TABLE: `security_events`**
Purpose: Security anomaly tracking.

**TABLE: `notification_logs`**
Purpose: Notification delivery tracking.

### 14. Queue & Async Architecture

**TABLE: `jobs`**
Laravel queue jobs.

**TABLE: `failed_jobs`**
Failed queue processing.

**TABLE: `scan_processing_queue`**
Custom scan orchestration tracking.

**TABLE: `provider_retry_queue`**
Provider retry scheduling.

### 15. File & Upload Architecture

**TABLE: `uploaded_files`**
Purpose: Stores uploaded documents.
**Supported Types:** PDF, DOCX, TXT, CSV, images

**TABLE: `extracted_documents`**
Purpose: Stores parsed OCR/text extraction.

### 16. Vector Search Expansion Strategy

**FUTURE VECTOR STORAGE**
Recommended future migration: pgvector, OpenSearch, ElasticSearch

**Future Semantic Tables**

| Table | Purpose |
| :--- | :--- |
| embeddings | semantic vectors |
| semantic_clusters | hallucination clustering |
| retrieval_cache | retrieval optimization |

### 17. Indexing Strategy

**Critical Indexes**

- Identity: `users.email`, `organizations.slug`
- AI Layer: `provider_models.provider_id`, `user_api_keys.provider_id`
- Verification: `scans.organization_id`, `scans.user_id`, `scans.created_at`
- Analytics: `analytics_snapshots.organization_id`
- Audit: `audit_logs.organization_id`, `audit_logs.created_at`

### 18. Partitioning Strategy

**Recommended Partitioning**
Large tables: `scans`, `audit_logs`, `provider_usage_logs`, `analytics_snapshots`
Partition by: `organization_id`, monthly timestamps

### 19. Soft Delete Strategy

**Soft Deletes Required**
Apply soft deletes to: `users`, `organizations`, `prompts`, `scans`, `reports`, `exports`

**Hard Delete Restrictions**
Never hard delete: `audit_logs`, `provider_usage`, `security_events`

### 20. Data Retention Policy

**Retention Rules**

| Data Type | Retention |
| :--- | :--- |
| audit logs | permanent |
| scans | configurable |
| API logs | 12–24 months |
| failed jobs | 90 days |
| notifications | 6 months |

### 21. Database Security Requirements

**Mandatory Security Controls**

- Encryption: API keys encrypted, sensitive exports encrypted, credential vault isolation
- Access Controls: tenant-aware query filtering, RBAC enforcement, audit-triggered actions
- Injection Prevention: prepared statements only, ORM enforcement, query sanitization

### 22. Scalability Readiness

**Designed Scalability Targets**

| Stage | Target |
| :--- | :--- |
| MVP | 1k users |
| Scale Phase | 10k+ users |
| Enterprise Expansion | multi-org scaling |

**Scalability Mechanisms:** Redis queues, horizontal workers, analytics preaggregation, provider batching, caching layers

### 23. Final Database Architecture Assessment

Humanova’s database architecture now supports:

| Capability | Supported |
| :--- | :--- |
| multi-tenancy | yes |
| enterprise RBAC | yes |
| AI provider orchestration | yes |
| explainable verification | yes |
| audit compliance | yes |
| community intelligence | yes |
| analytics scalability | yes |
| future vector search | yes |

The architecture is now prepared for:

- enterprise SaaS expansion
- AI governance workflows
- hallucination intelligence systems
- scalable verification infrastructure
