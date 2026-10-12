# ChakraSaakshya (चक्र साक्ष्य)
> **Track 01:** Agents That Act on Connected Data  
> **Event:** WeMakeDevs × FalkorDB Hackathon — *Graph Hacks: Context for AI Agents* (15–18 October 2026 IST)

This repository contains the **reusable application foundation** for ChakraSaakshya. Under official hackathon competition rules, core investigation agents, FalkorDB custody schemas, Cypher traversal queries, and project-specific audit screens are **strictly reserved for implementation during the hackathon period**.

---

## 1. Quick Start (Windows & Cross-Platform)

### Prerequisites
- **Python 3.12+** (Verified on Python 3.13)
- **Node.js 18+** (Verified on Node.js v24.11 / npm 11.6)

---

### Backend Setup (FastAPI)

1. Open PowerShell and navigate to the `backend` directory:
   ```powershell
   cd backend
   ```

2. (Optional but recommended) Create and activate a Python virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install required dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Run the automated generic health test:
   ```powershell
   pytest tests
   ```

5. Launch the backend API server:
   ```powershell
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   - API health check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
   - Interactive OpenAPI documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Frontend Setup (Next.js)

1. Open a second PowerShell terminal and navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```

3. Verify TypeScript build and ESLint checks:
   ```powershell
   npm run lint
   npm run build
   ```

4. Launch the local Next.js development server:
   ```powershell
   npm run dev
   ```
   - Frontend application shell: [http://localhost:3000](http://localhost:3000)

The root page will automatically connect to `http://127.0.0.1:8000/api/health` and display real-time service connectivity.

---

## 2. Reusable Foundation Architecture

```
ChakraSaakshya/
├── PREPARATION.md         # Pre-hackathon compliance declaration & planning index
├── README.md              # Setup and foundation documentation (this file)
├── .gitignore             # Standard git exclusions (venv, node_modules, .env)
├── .env.example           # Environment template with placeholders only
│
├── backend/               # Generic Python / FastAPI foundation
│   ├── requirements.txt   # FastAPI, Uvicorn, Pydantic v2, HTTPX, Pytest
│   ├── app/
│   │   ├── main.py        # Application factory, CORS, /api/health
│   │   ├── config.py      # Pydantic BaseSettings environment loader
│   │   ├── schemas.py     # Generic health schema
│   │   └── errors.py      # Standardized JSON error response handlers
│   └── tests/
│       └── test_health.py # Pytest verification for health endpoint
│
├── frontend/              # Generic Next.js 16+ / React / Tailwind foundation
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx # Root HTML layout & fonts
│   │   │   └── page.tsx   # Reusable shell communicating with /api/health
│   │   ├── components/
│   │   │   ├── layout.tsx # Header and Footer navigation components
│   │   │   └── ui.tsx     # Reusable Button and StatusBadge components
│   │   └── lib/
│   │       └── api.ts     # Type-safe API client with ApiError handling
│   ├── package.json
│   └── tsconfig.json
│
└── planning/              # Complete 15-document pre-event planning pack
    ├── 01-project-brief.md
    ├── 02-problem-and-user.md
    ├── 03-graph-model.md
    ├── 04-investigation-rules.md
    ├── 05-agent-workflow.md
    ├── 06-system-architecture.md
    ├── 07-api-contract-plan.md
    ├── 08-test-scenarios.md
    ├── 09-four-day-build-plan.md
    ├── 10-team-task-breakdown.md
    ├── 11-technical-decisions.md
    ├── 12-demo-and-submission-plan.md
    ├── 13-kickoff-checklist.md
    ├── 14-open-questions.md
    └── 15-project-foundation-spec.md
```

---

## 3. Hackathon Compliance Statement

Under the rules for **WeMakeDevs × FalkorDB Graph Hacks (Track 01)**:
- All core application logic, FalkorDB property graph schemas, Cypher traversal queries, anomaly detection algorithms, investigation agent workflows, and project-specific review screens will be built from scratch **after the event officially opens on 15 October 2026, 12:01 AM IST**.
- This repository currently contains only pre-event planning documentation and a generic, reusable framework foundation.
