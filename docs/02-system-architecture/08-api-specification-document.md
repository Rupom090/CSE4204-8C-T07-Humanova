# Humanova — API Specification Document

Version: 1.0  
API Style: RESTful API  
Authentication: Laravel Sanctum  
Architecture: Multi-Tenant Enterprise API

---

# 1. API Overview

Humanova exposes a modular REST API responsible for:

- authentication
- organization management
- AI generation
- hallucination verification
- analytics
- reporting
- moderation
- provider orchestration

The API follows:

- REST principles
- JSON responses
- tenant-aware access
- RBAC authorization
- async processing patterns

---

# 2. API Base Configuration

## Base URL

```text
https://api.humanova.ai/api/v1
```

---

# Content Type

```http
Content-Type: application/json
Accept: application/json
```

---

# Authentication Header

```http
Authorization: Bearer <token>
```

---

# 3. API Versioning Strategy

## Version Format

```text
/api/v1/
```

---

# Versioning Rules

| Rule | Description |
|---|---|
| breaking changes | new version |
| additive changes | same version |
| deprecated endpoints | warning headers |

---

# 4. Authentication APIs

---

# 4.1 Register User

## Endpoint

```http
POST /auth/register
```

---

## Request Payload

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "password_confirmation": "SecurePassword123"
}
```

---

## Response

```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "user_id": 1
  }
}
```

---

# Validation Rules

| Field | Rule |
|---|---|
| email | unique |
| password | min 8 |
| name | required |

---

# 4.2 Login

## Endpoint

```http
POST /auth/login
```

---

## Request

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

---

## Response

```json
{
  "success": true,
  "token": "jwt_or_sanctum_token",
  "user": {}
}
```

---

# 4.3 Logout

## Endpoint

```http
POST /auth/logout
```

---

# 4.4 OAuth Login

## Endpoint

```http
GET /auth/oauth/{provider}
```

---

# Supported Providers

- Google
- GitHub (future)

---

# 5. Organization APIs

---

# 5.1 Create Organization

## Endpoint

```http
POST /organizations
```

---

## Permissions

- authenticated user

---

## Request

```json
{
  "name": "Humanova Research Lab"
}
```

---

## Response

```json
{
  "success": true,
  "organization": {}
}
```

---

# 5.2 Invite Organization Member

## Endpoint

```http
POST /organizations/{id}/invite
```

---

## Permissions

- organization_admin

---

## Request

```json
{
  "email": "member@example.com",
  "role": "researcher"
}
```

---

# 5.3 List Organization Members

## Endpoint

```http
GET /organizations/{id}/members
```

---

# 6. RBAC APIs

---

# 6.1 Get Roles

## Endpoint

```http
GET /roles
```

---

# 6.2 Assign Role

## Endpoint

```http
POST /users/{id}/assign-role
```

---

## Request

```json
{
  "role_id": 3
}
```

---

# Permission Rules

| Role | Access |
|---|---|
| user | own resources |
| org_admin | organization scope |
| super_admin | global scope |

---

# 7. AI Provider APIs

---

# 7.1 List AI Providers

## Endpoint

```http
GET /providers
```

---

# Response

```json
{
  "providers": [
    {
      "id": 1,
      "name": "OpenAI"
    }
  ]
}
```

---

# 7.2 Add API Key

## Endpoint

```http
POST /provider-keys
```

---

## Request

```json
{
  "provider_id": 1,
  "api_key": "sk-xxxx"
}
```

---

# Security Rules

Mandatory:

- encrypted storage
- masked response
- never expose raw keys

---

# 7.3 Delete API Key

## Endpoint

```http
DELETE /provider-keys/{id}
```

---

# 8. Prompt Enhancement APIs

---

# 8.1 Enhance Prompt

## Endpoint

```http
POST /prompts/enhance
```

---

## Request

```json
{
  "prompt": "Write about AI.",
  "mode": "professional"
}
```

---

## Response

```json
{
  "success": true,
  "enhanced_prompt": "Act as a professional AI researcher..."
}
```

---

# Enhancement Modes

| Mode | Purpose |
|---|---|
| professional | expert prompting |
| concise | token optimization |
| structured | JSON formatting |
| research | academic prompts |

---

# 8.2 Save Prompt

## Endpoint

```http
POST /prompts
```

---

# 8.3 Prompt History

## Endpoint

```http
GET /prompts/history
```

---

# 9. AI Generation APIs

---

# 9.1 Generate AI Response

## Endpoint

```http
POST /generate
```

---

## Request

```json
{
  "provider_id": 1,
  "model_id": 3,
  "prompt": "Explain AI hallucination.",
  "response_mode": "concise"
}
```

---

## Response

```json
{
  "generation_id": 77,
  "response": "AI hallucination occurs..."
}
```

---

# Response Modes

| Mode | Description |
|---|---|
| concise | optimized short response |
| balanced | medium detail |
| detailed | expanded answer |

---

# 9.2 Multi-Provider Comparison

## Endpoint

```http
POST /generate/compare
```

---

## Request

```json
{
  "providers": [1,2,3],
  "prompt": "Explain RAG systems."
}
```

---

# 10. Hallucination Scan APIs

---

# 10.1 Create Scan

## Endpoint

```http
POST /scans
```

---

## Request

```json
{
  "generation_id": 77
}
```

---

## Async Response

```json
{
  "scan_id": 12,
  "status": "queued"
}
```

---

# 10.2 Get Scan Result

## Endpoint

```http
GET /scans/{id}
```

---

## Response

```json
{
  "scan_id": 12,
  "confidence_score": 82,
  "hallucination_score": 18,
  "status": "completed"
}
```

---

# 10.3 List Scans

## Endpoint

```http
GET /scans
```

---

# Query Parameters

| Parameter | Description |
|---|---|
| status | filter |
| provider | filter |
| date_from | filter |
| date_to | filter |

---

# 11. Verification APIs

---

# 11.1 Verify External Response

## Endpoint

```http
POST /verification/external
```

---

## Request

```json
{
  "text": "AI-generated response..."
}
```

---

# 11.2 Get Extracted Claims

## Endpoint

```http
GET /scans/{id}/claims
```

---

# 11.3 Get Evidence Sources

## Endpoint

```http
GET /scans/{id}/evidence
```

---

# 12. Citation Verification APIs

---

# 12.1 Verify Citations

## Endpoint

```http
POST /verification/citations
```

---

## Request

```json
{
  "text": "Citation text..."
}
```

---

# 12.2 Check Links

## Endpoint

```http
POST /verification/links
```

---

## Request

```json
{
  "urls": [
    "https://example.com"
  ]
}
```

---

# Response

```json
{
  "results": [
    {
      "url": "https://example.com",
      "status": 200
    }
  ]
}
```

---

# 13. Confidence Scoring APIs

---

# 13.1 Get Confidence Breakdown

## Endpoint

```http
GET /scans/{id}/confidence
```

---

## Response

```json
{
  "semantic_similarity": 0.88,
  "source_authority": 0.92,
  "contradiction_penalty": 0.14,
  "final_score": 82
}
```

---

# 14. Community Verification APIs

---

# 14.1 Report Hallucination

## Endpoint

```http
POST /reports
```

---

## Request

```json
{
  "scan_id": 22,
  "reason": "fake_citation",
  "description": "Citation does not exist."
}
```

---

# 14.2 Vote Report

## Endpoint

```http
POST /reports/{id}/vote
```

---

## Request

```json
{
  "vote": "up"
}
```

---

# 14.3 Submit Evidence

## Endpoint

```http
POST /reports/{id}/evidence
```

---

# File Types

Supported:

- PDF
- DOCX
- PNG
- JPG

---

# 15. Moderation APIs

---

# 15.1 Get Moderation Queue

## Endpoint

```http
GET /moderation/reports
```

---

# 15.2 Approve Report

## Endpoint

```http
POST /moderation/reports/{id}/approve
```

---

# 15.3 Reject Report

## Endpoint

```http
POST /moderation/reports/{id}/reject
```

---

# 16. Analytics APIs

---

# 16.1 Dashboard Analytics

## Endpoint

```http
GET /analytics/dashboard
```

---

# Response

```json
{
  "total_scans": 2300,
  "hallucination_rate": 17,
  "token_usage": 120000
}
```

---

# 16.2 Provider Analytics

## Endpoint

```http
GET /analytics/providers
```

---

# 16.3 Token Usage Analytics

## Endpoint

```http
GET /analytics/tokens
```

---

# 17. PDF Export APIs

---

# 17.1 Generate PDF

## Endpoint

```http
POST /exports/pdf
```

---

## Request

```json
{
  "scan_id": 77,
  "template": "default"
}
```

---

# Response

```json
{
  "export_id": 11,
  "status": "queued"
}
```

---

# 17.2 Download Export

## Endpoint

```http
GET /exports/{id}/download
```

---

# 18. Audit & Activity APIs

---

# 18.1 Audit Logs

## Endpoint

```http
GET /audit/logs
```

---

# Permissions

- organization_admin
- super_admin

---

# Query Parameters

| Parameter | Purpose |
|---|---|
| user_id | filter |
| event_type | filter |
| date_range | filter |

---

# 19. Notification APIs

---

# 19.1 Get Notifications

## Endpoint

```http
GET /notifications
```

---

# 19.2 Mark Notification Read

## Endpoint

```http
POST /notifications/{id}/read
```

---

# 20. File Upload APIs

---

# 20.1 Upload Document

## Endpoint

```http
POST /uploads
```

---

# Supported Files

- PDF
- DOCX
- TXT
- CSV
- PNG
- JPG

---

# File Validation Rules

| Rule | Validation |
|---|---|
| max size | configurable |
| mime validation | required |
| malware scan | future |

---

# 21. API Response Standards

---

# Success Response Format

```json
{
  "success": true,
  "message": "Operation successful.",
  "data": {}
}
```

---

# Error Response Format

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
```

---

# HTTP Status Standards

| Code | Meaning |
|---|---|
| 200 | success |
| 201 | created |
| 400 | bad request |
| 401 | unauthorized |
| 403 | forbidden |
| 404 | not found |
| 422 | validation error |
| 429 | rate limited |
| 500 | server error |

---

# 22. Rate Limiting Strategy

---

# Limits

| Endpoint | Limit |
|---|---|
| auth | 5/min |
| generate | 20/min |
| scans | 30/min |
| uploads | 10/min |

---

# 23. Security Specifications

---

# Mandatory Security Controls

- tenant-aware filtering
- RBAC middleware
- CSRF protection
- encrypted API keys
- SSRF prevention
- file validation

---

# 24. Async Processing Endpoints

---

# Queue-Based APIs

| Endpoint | Async |
|---|---|
| scans | yes |
| exports | yes |
| link checks | yes |
| analytics aggregation | yes |

---

# Status Lifecycle

```text
queued
processing
completed
failed
retrying
```

---

# 25. Future API Expansion

Prepared for:

- GraphQL
- public SDKs
- webhook integrations
- browser extension APIs
- enterprise governance APIs

---

# 26. Final API Architecture Summary

Humanova APIs are designed for:

- enterprise multi-tenancy
- scalable AI orchestration
- explainable verification
- async processing
- provider abstraction
- secure governance workflows
