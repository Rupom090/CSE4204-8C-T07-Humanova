# Humanova — Environment & Configuration Document

Version: 1.0  
Configuration Classification: Infrastructure & Runtime Management  
Scope: Environment Variables, Runtime Configuration & Deployment Isolation

---

# 1. Document Purpose

This document defines:

- environment architecture
- configuration management
- secret handling
- runtime isolation
- deployment configuration
- service configuration governance

The configuration system must support:

- scalability
- security
- deployment flexibility
- environment isolation

---

# 2. Configuration Philosophy

Humanova handles:

- AI provider secrets
- tenant operations
- queue infrastructure
- analytics pipelines
- enterprise governance

Therefore configuration must follow:

> secure, isolated, environment-driven infrastructure principles.

---

# Core Principles

| Principle | Description |
|---|---|
| environment isolation | separate runtime configs |
| secret protection | encrypted sensitive values |
| deployment flexibility | configurable infrastructure |
| immutable infrastructure | runtime consistency |
| least exposure | minimal secret visibility |

---

# 3. Environment Architecture Overview

## Environment Layers

```text
Application
    ↓
Environment Variables
    ↓
Service Configuration
    ↓
Infrastructure Runtime
```

---

# Environment Types

| Environment | Purpose |
|---|---|
| local | development |
| staging | QA/testing |
| production | live operations |

---

# 4. Environment Isolation Strategy

---

# Environment Rules

| Rule | Requirement |
|---|---|
| separate databases | mandatory |
| separate Redis instances | recommended |
| separate secrets | mandatory |
| separate API keys | mandatory |

---

# Cross-Environment Restrictions

Prohibited:

- shared production secrets
- shared databases
- shared queues

---

# Environment Workflow

```text
Local
   ↓
Staging
   ↓
Production
```

---

# 5. Core Environment Variables

---

# Application Variables

```env
APP_NAME=Humanova
APP_ENV=production
APP_DEBUG=false
APP_URL=https://humanova.ai
```

---

# Application Rules

| Variable | Purpose |
|---|---|
| APP_ENV | runtime mode |
| APP_DEBUG | debug visibility |
| APP_URL | application routing |

---

# Security Rules

Mandatory:

- APP_DEBUG=false in production
- secure APP_KEY generation

---

# 6. Database Configuration

---

# MySQL Variables

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=humanova
DB_USERNAME=humanova_user
DB_PASSWORD=secure_password
```

---

# Database Rules

Mandatory:

- strong passwords
- isolated production DB
- encrypted backups

---

# Database Isolation

| Environment | Isolation |
|---|---|
| local | local DB |
| staging | staging DB |
| production | production DB |

---

# 7. Redis Configuration

---

# Redis Variables

```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=secure_redis_password
```

---

# Redis Responsibilities

| Usage | Purpose |
|---|---|
| queues | async jobs |
| caching | performance |
| sessions | auth persistence |

---

# Redis Security Rules

Mandatory:

- password protection
- private network access
- no public exposure

---

# 8. Queue Configuration

---

# Queue Variables

```env
QUEUE_CONNECTION=redis
QUEUE_FAILED_DRIVER=database
```

---

# Queue Categories

| Queue | Purpose |
|---|---|
| scans | hallucination verification |
| exports | PDF generation |
| analytics | aggregation |

---

# Queue Worker Variables

```env
QUEUE_WORKER_TIMEOUT=120
QUEUE_RETRY_AFTER=90
```

---

# Queue Rules

Mandatory:

- retry limits
- timeout enforcement
- failed job persistence

---

# 9. AI Provider Configuration

---

# OpenAI Variables

```env
OPENAI_API_KEY=encrypted_key
OPENAI_MODEL=gpt-4
```

---

# Gemini Variables

```env
GEMINI_API_KEY=encrypted_key
```

---

# DeepSeek Variables

```env
DEEPSEEK_API_KEY=encrypted_key
```

---

# Provider Rules

Mandatory:

- encrypted storage
- masked logging
- no plaintext exposure

---

# Provider Configuration Structure

| Variable | Purpose |
|---|---|
| provider key | authentication |
| model config | routing |
| timeout config | resilience |

---

# 10. AI Service Configuration

---

# Python Service Variables

```env
AI_SERVICE_URL=http://ai-service:8000
AI_SERVICE_TIMEOUT=30
```

---

# AI Service Responsibilities

| Service | Purpose |
|---|---|
| embeddings | semantic vectors |
| NLI | contradiction analysis |
| scoring | confidence calculation |

---

# AI Service Rules

Mandatory:

- internal-only communication
- timeout protection
- request validation

---

# 11. Frontend Environment Configuration

---

# Frontend Variables

```env
VITE_API_URL=https://api.humanova.ai
VITE_APP_NAME=Humanova
```

---

# Frontend Rules

Mandatory:

- no secrets exposed
- public-safe variables only

---

# Forbidden Frontend Variables

Never expose:

- API provider keys
- DB credentials
- internal URLs

---

# 12. Authentication Configuration

---

# Sanctum Variables

```env
SANCTUM_STATEFUL_DOMAINS=humanova.ai
SESSION_DOMAIN=.humanova.ai
```

---

# Authentication Rules

Mandatory:

- secure cookies
- HTTPS-only sessions
- session expiration policies

---

# OAuth Variables

```env
GOOGLE_CLIENT_ID=client_id
GOOGLE_CLIENT_SECRET=secret
```

---

# OAuth Rules

Mandatory:

- encrypted storage
- restricted callback URLs

---

# 13. Mail Configuration

---

# Mail Variables

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=username
MAIL_PASSWORD=password
MAIL_ENCRYPTION=tls
```

---

# Mail Usage

| Usage | Purpose |
|---|---|
| auth verification | onboarding |
| notifications | alerts |
| exports | report delivery |

---

# Mail Security

Mandatory:

- TLS encryption
- credential isolation

---

# 14. File Storage Configuration

---

# Storage Variables

```env
FILESYSTEM_DISK=local
```

---

# Future S3 Variables

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=
```

---

# Storage Rules

Mandatory:

- protected file access
- signed URLs
- tenant isolation

---

# 15. PDF Export Configuration

---

# Export Variables

```env
PDF_EXPORT_TIMEOUT=120
PDF_MAX_FILE_SIZE=20MB
```

---

# Export Rules

Mandatory:

- async generation
- secure storage
- expiration policies

---

# 16. Analytics Configuration

---

# Analytics Variables

```env
ANALYTICS_CACHE_TTL=3600
ANALYTICS_REFRESH_INTERVAL=900
```

---

# Analytics Rules

Mandatory:

- cached aggregation
- isolated analytics storage

---

# 17. Security Configuration

---

# Security Variables

```env
FORCE_HTTPS=true
RATE_LIMIT_ENABLED=true
```

---

# Security Rules

Mandatory:

- HTTPS enforcement
- throttling enabled
- CSP enforcement

---

# SSRF Protection Variables

```env
BLOCK_PRIVATE_IPS=true
MAX_REDIRECTS=3
```

---

# Security Restrictions

Blocked:

- localhost requests
- metadata IPs
- internal networks

---

# 18. Logging Configuration

---

# Logging Variables

```env
LOG_CHANNEL=stack
LOG_LEVEL=warning
```

---

# Logging Rules

Mandatory:

- structured logs
- no sensitive data exposure
- audit persistence

---

# Sensitive Data Logging Rules

Never log:

- API keys
- passwords
- raw secrets

---

# 19. Monitoring Configuration

---

# Monitoring Variables

```env
SENTRY_DSN=
MONITORING_ENABLED=true
```

---

# Monitoring Scope

Track:

- queue failures
- provider failures
- API latency
- security events

---

# Alert Configuration

```env
ALERT_EMAIL=security@humanova.ai
```

---

# 20. Rate Limiting Configuration

---

# Rate Limit Variables

```env
API_RATE_LIMIT=60
AUTH_RATE_LIMIT=5
```

---

# Rate Limit Categories

| Endpoint | Limit |
|---|---|
| auth | strict |
| scans | moderate |
| exports | moderate |

---

# 21. Feature Flag Architecture

---

# Feature Variables

```env
ENABLE_COMMUNITY_REPORTS=true
ENABLE_PROVIDER_COMPARISON=true
```

---

# Feature Flag Goals

Support:

- phased rollout
- experimental features
- enterprise customizations

---

# Feature Categories

| Feature | Purpose |
|---|---|
| beta features | staged release |
| enterprise modules | premium features |

---

# 22. Deployment Configuration

---

# Production Variables

```env
APP_ENV=production
APP_DEBUG=false
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
```

---

# Staging Variables

```env
APP_ENV=staging
APP_DEBUG=true
```

---

# Deployment Rules

Mandatory:

- separate secrets
- environment validation
- deployment checks

---

# 23. Configuration Validation

---

# Validation Goals

Ensure:

- required variables exist
- invalid configs blocked
- secure defaults enforced

---

# Startup Validation Workflow

```text
Application Boot
      ↓
Config Validation
      ↓
Missing Variable Check
      ↓
Secure Runtime Start
```

---

# Critical Validation Rules

| Rule | Requirement |
|---|---|
| missing secrets | block startup |
| invalid DB config | block startup |
| debug in production | block deployment |

---

# 24. Secret Management Architecture

---

# Secret Categories

| Secret | Risk |
|---|---|
| provider keys | critical |
| DB passwords | critical |
| OAuth secrets | critical |

---

# Secret Management Rules

Mandatory:

- encrypted storage
- access restriction
- no Git exposure

---

# Future Expansion

Prepared for:

- Vault integration
- KMS integration
- enterprise secret rotation

---

# 25. Environment Governance

---

# Governance Rules

| Rule | Requirement |
|---|---|
| production changes logged | mandatory |
| secret updates audited | mandatory |
| env access restricted | mandatory |

---

# Audit Logging

Track:

- config changes
- deployment changes
- secret rotations

---

# 26. Disaster Recovery Configuration

---

# Recovery Variables

```env
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=30
```

---

# Recovery Rules

Mandatory:

- encrypted backups
- restore validation
- rollback readiness

---

# 27. Scalability Configuration

---

# Scalability Variables

```env
QUEUE_WORKER_COUNT=10
MAX_CONCURRENT_SCANS=100
```

---

# Future Scaling Support

Prepared for:

- Kubernetes
- autoscaling
- distributed workers

---

# 28. Compliance Configuration

---

# Compliance Variables

```env
AUDIT_LOG_RETENTION=3650
GDPR_MODE=true
```

---

# Compliance Rules

Mandatory:

- tenant isolation
- audit persistence
- export governance

---

# 29. Local Development Configuration

---

# Developer Variables

```env
APP_DEBUG=true
LOG_LEVEL=debug
```

---

# Local Environment Rules

Allowed:

- debug logging
- local databases

Prohibited:

- production secrets
- shared production access

---

# 30. Final Configuration Philosophy

Humanova’s environment and configuration architecture is designed to evolve into:

> a secure, scalable, enterprise-grade runtime configuration infrastructure capable of supporting AI orchestration, tenant governance, verification intelligence, deployment isolation, and operational resilience through strict environment-driven architecture principles.
