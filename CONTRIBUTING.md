# Contributing to Badminton Tournament Finder

Thank you for your interest in contributing to **Badminton Tournament Finder**! We are building an open-source, production-grade microservices platform to help collegiate athletes discover tournaments and organize carpools in real-time.

Whether you're a **Fullstack Engineer**, **Backend Specialist**, **AI/ML Researcher**, **UX/UI Designer**, **QA Tester**, or **DevOps Engineer**, there is a place for you on this project.

---

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute by Role](#how-to-contribute-by-role)
- [Local Development Setup](#local-development-setup)
- [Branching and Commit Conventions](#branching-and-commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

---

## Code of Conduct
This project adheres to the [Contributor Covenant v2.1](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## How to Contribute by Role

### 🎨 UX / UI Designers & Frontend Engineers
- **Stack**: React 18, TypeScript, Vite, Material-UI (MUI v6), Leaflet.
- **Where to look**: `web/src/`
- **Ways to contribute**:
  - Enhance the MUI theme in `web/src/theme/theme.ts` (modern athletic palettes, responsive spacing).
  - Improve the Tournament Card, Carpool Coordinator, and interactive map components.
  - Refine optimistic UI updates and notification badges.

### ☕ Backend & Distributed Systems Engineers
- **Stack**: Java 25 LTS, Spring Boot 3.3, Spring Data MongoDB Reactive, Apache Kafka (KRaft), WebSocket STOMP.
- **Where to look**: `services/core-service/`
- **Ways to contribute**:
  - Maintain the **Transactional Outbox Pattern** and MongoDB Change Stream listener.
  - Optimize `2dsphere` geospatial queries (`$near`, `$geoWithin`).
  - Strengthen Resilience4j circuit breakers and Redis-backed Bucket4j rate limiting in `services/api-gateway/`.

### 🐍 AI / ML & Scraper Engineers
- **Stack**: Python 3.12, FastAPI, Celery, Redis, OpenAI GPT-4o Vision, Instructor, Pydantic v2, Instaloader, BeautifulSoup4.
- **Where to look**: `services/scraper-service/`
- **Ways to contribute**:
  - Refine GPT-4o Vision multimodal prompts for stylized tournament flyers.
  - Tune Instructor validation schemas and tenacity retry loops.
  - Expand scraper coverage to new collegiate clubs with proxy failovers.

### 🛡️ Security & Compliance Engineers
- **Stack**: Spring Security, Vault, OAuth2 / JWT, TLS fingerprinting, proxy pool managers.
- **Where to look**: `services/api-gateway/`, `services/scraper-service/src/scrapers/`
- **Ways to contribute**:
  - Audit scraping behaviors to ensure strict adherence to *Meta v. Bright Data (2024)*.
  - Implement security headers, rate-limiting rules, and secret hygiene.

### 🧪 QA & Software Testing Engineers
- **Stack**: Pytest, JUnit 5, Mockito, Testcontainers, Playwright, k6.
- **Where to look**: `services/*/tests/`, `web/tests/`
- **Ways to contribute**:
  - Add Testcontainers integration tests verifying MongoDB Change Streams and Kafka publishing.
  - Write Playwright E2E tests for tournament discovery and real-time WebSocket updates.
  - Run k6 load tests for concurrent WebSocket subscribers and gateway rate limits.

### ☁️ DevOps / SRE / Platform Engineers
- **Stack**: Docker, Docker Compose, GitHub Actions, Prometheus, Grafana.
- **Where to look**: `.github/workflows/`, `docker-compose.yml`, `Dockerfile`s
- **Ways to contribute**:
  - Optimize container builds (distroless / multi-stage caching).
  - Improve path-filtered CI workflows to keep build times under 5 minutes.
  - Add telemetry instrumentation with OpenTelemetry and Grafana dashboards.

---

## Local Development Setup

### 1. Prerequisites
- **Git**
- **Docker & Docker Compose** (v2.20+)
- **Node.js 20+**, **Java 25**, **Python 3.12**
- *(Recommended)* [Task](https://taskfile.dev): `task --version`

### 2. Quickstart with Taskfile
```bash
# 1. Clone repository
git clone https://github.com/your-org/badminton-tournament-finder.git
cd badminton-tournament-finder

# 2. Copy environment template
cp .env.example .env

# 3. Boot full stack (Kafka KRaft, Mongo, Redis, Scraper, Backend, Gateway, Web)
task dev:up

# 4. View logs
task dev:logs
```

### 3. Mock Ingestion Mode
To test without live Instagram credentials or OpenAI API keys, keep `USE_MOCK_DATA=true` in your `.env`. The scraper service will emit pre-recorded tournament fixtures.

---

## Branching and Commit Conventions

We follow the **Conventional Commits** specification:

```
<type>(<scope>): <short description>
```

- **Types**:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of code (white-space, formatting)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `test`: Adding missing tests or correcting existing tests
  - `chore`: Changes to build process, dependencies, or auxiliary tools
- **Scopes**: `web`, `scraper`, `core`, `gateway`, `contracts`, `ci`, `docs`

*Example:* `feat(web): add optimistic RSVP button state with MUI Snackbar`

---

## Pull Request Process

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/my-new-feature
   ```
2. **Make your changes** and ensure existing and new tests pass:
   ```bash
   task test
   task lint
   ```
3. **Commit** with conventional commit messages.
4. **Push** to your fork and submit a **Pull Request**.
5. Fill out the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) detailing your changes and testing proof.

---

## Coding Standards

- **Python**: Enforce formatting and linting via `ruff check .` and `ruff format .`. Static types checked via `mypy`.
- **Java**: Format code with Google Java Style / Spotless (`mvn spotless:check`).
- **React / TypeScript**: Lint with ESLint (`npm run lint`), format with Prettier, type check with `tsc --noEmit`.

