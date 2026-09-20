# Security Policy

## Supported Versions

We release security patches for the following versions:

| Version | Supported          |
| :--- | :--- |
| 1.0.x | :white_check_mark: |
| < 1.0 | :x:                |

---

## Reporting a Vulnerability

The Badminton Tournament Finder team is committed to ensuring the security of our platform and protecting user data. If you discover a security vulnerability, please follow our coordinated disclosure process.

### Disclosure Process
1. **Do NOT open a public GitHub issue** for security vulnerabilities.
2. Email your findings directly to **security@badmintonfinder.org** or use GitHub's private vulnerability reporting feature on this repository.
3. Include detailed steps to reproduce the vulnerability, including:
   - Affected service (`services/core-service`, `services/scraper-service`, `services/api-gateway`, or `web`)
   - Proof of Concept (PoC) code or HTTP request trace
   - Potential impact of the issue
4. You will receive an initial response acknowledging receipt within **48 hours**.
5. We will coordinate a timeline for releasing a fix before any public announcement.

---

## Web Scraping Legal & Compliance Framework

The **Data Acquisition Layer** operates under strict compliance boundaries established by United States case law, specifically *Meta Platforms, Inc. v. Bright Data Ltd. (2024)*:

1. **Public Information Only**: Scrapers are strictly restricted to publicly accessible posts, captions, Linktree profiles, and Google Forms. The system never circumvents authentication barriers, paywalls, or password protections.
2. **No Fake Accounts**: Data extraction is performed without deceptive authenticated user sessions. Where session cookies are utilized for testing, they are isolated to strictly controlled burner accounts and never impersonate real users.
3. **Strict Rate Ceilings**:
   - Accounts are polled a maximum of **twice per day**.
   - Randomized request jitter of **3–10 seconds** is enforced.
   - Celery workers strictly enforce `10 requests/minute` via `task_annotations`.
   - Redis-backed distributed token buckets via Bucket4j guard against downstream overload.
4. **Mock Ingestion Mode**: All automated tests, local development stacks, and CI pipelines run against fixture data (`USE_MOCK_DATA=true`), preventing unnecessary external network traffic.

---

## Secrets Management & Hygiene

- Never commit `.env` files, API tokens (OpenAI, Apify, Bright Data, Mapbox), or proxy credentials to git.
- This repository employs pre-commit hooks (`trufflehog` and `gitguardian`) to detect accidental credential leaks before commit.
- Production deployments must inject secrets via environment variables or secret managers (e.g., HashiCorp Vault, AWS Secrets Manager, GitHub Encrypted Secrets).

