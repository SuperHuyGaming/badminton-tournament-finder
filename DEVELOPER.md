# Developer Guide 🏸

Welcome to the **Badminton Tournament Finder** project! This guide will help you set up your local development environment, understand the architecture, and start contributing.

## 🏗️ System Architecture

The project uses a modern polyglot microservices architecture to handle heavy data scraping and real-time frontend updates efficiently.

*   **Frontend (`web/`)**: React + TypeScript + Vite. Uses Material-UI (MUI) for styling and Playwright for E2E testing.
*   **API Gateway (`services/api-gateway/`)**: Spring Cloud Gateway (Java 25). Handles routing, OAuth2 authentication, and Rate Limiting (via Redis).
*   **Core Service (`services/core-service/`)**: Spring Boot (Java 25) + MongoDB. Manages tournament data and dispatches real-time events via Kafka.
*   **Scraper Service (`services/scraper-service/`)**: FastAPI + Celery (Python 3.12). Scrapes Instagram, Google Forms, and Linktree. Uses GPT-4o Vision to extract data from flyers.

---

## 🛠️ Prerequisites

To run this project locally, you must install the following tools:

*   **Docker Desktop** (For running infrastructure easily)
*   **Node.js 20+** (For frontend development)
*   **Java 25** (For backend development, Temurin/Eclipse distribution recommended)
*   **Python 3.12+** (For AI/Scraper development)
*   **Git**

---

## 🚀 Running the Project Locally

The absolute easiest way to run the entire stack is using Docker Compose. This spins up the infrastructure (MongoDB, Redis, Kafka) alongside the microservices.

### Option 1: Full Docker Setup (Recommended)
1. Clone the repository: `git clone https://github.com/SuperHuyGaming/badminton-tournament-finder.git`
2. Navigate to the root folder: `cd badminton-tournament-finder`
3. Spin up the cluster: 
   ```bash
   docker-compose up --build -d
   ```
4. Access the web interface at **http://localhost:3000**
5. Check logs if needed: `docker-compose logs -f web`

### Option 2: Hybrid Setup (Running microservices natively)
If you are actively developing a specific service, you can run the databases via Docker, and the services via your local IDE/Terminal.

1. **Start Infrastructure only:**
   ```bash
   docker-compose up -d mongodb redis kafka
   ```
2. **Start Python Scraper (FastAPI):**
   ```bash
   cd services/scraper-service
   pip install -e ".[dev]"
   uvicorn src.api.main:app --reload
   ```
3. **Start Core Service (Spring Boot):**
   ```bash
   cd services/core-service
   mvn spring-boot:run
   ```
4. **Start API Gateway:**
   ```bash
   cd services/api-gateway
   mvn spring-boot:run
   ```
5. **Start Frontend (Vite):**
   ```bash
   cd web
   npm install
   npm run dev
   ```

---

## 🧪 Testing Guidelines

We enforce testing across all parts of the stack. **Before opening a Pull Request**, make sure you run the tests for the service you modified.

*   **Python (Scraper Service):**
    ```bash
    cd services/scraper-service
    python -m pytest tests/ -v
    ```
*   **Java (Core Service):**
    ```bash
    cd services/core-service
    mvn clean test
    ```
*   **React Frontend (Vitest Unit tests):**
    ```bash
    cd web
    npm run test
    ```
*   **End-to-End Tests (Playwright):**
    Make sure the frontend is running locally on port 3000 first, then run:
    ```bash
    cd tests/e2e
    npm install
    npx playwright test
    ```

---

## 🧹 Code Quality & Linting

Our CI pipeline enforces strict code formatting. Avoid failing builds by running formatters locally.

*   **Frontend:** `npm run lint`
*   **Python:** `python -m ruff format .` and `python -m ruff check .`

---

## 🌍 Environment Variables

A `.env.example` file is provided in the root. 
1. Copy it to create your own `.env`: `cp .env.example .env`
2. Update the `OPENAI_API_KEY` if you plan to test the flyer extraction locally. Otherwise, leave it as `YOUR_OPENAI_API_KEY_HERE` and the system will fallback to Mock Data (`USE_MOCK_DATA=true`).

Happy coding! 🎉
