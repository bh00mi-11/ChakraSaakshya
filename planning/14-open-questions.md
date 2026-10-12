# 14 — Open Questions & Technical Uncertainties

> **Notice:** This document catalog-indexes technical decisions, external dependencies, and rule questions that cannot be definitively answered prior to hackathon kickoff. Separating confirmed requirements from unverified assumptions preserves engineering clarity.

---

## 1. Confirmed Event Parameters vs. Unverified Engineering Assumptions

| Dimension | Confirmed Official Parameter | Unverified Technical Assumption | Action Required at Kickoff |
| :--- | :--- | :--- | :--- |
| **Event Timeline** | 15 Oct 2026, 12:01 AM IST to 18 Oct 2026, 11:59 PM IST. | Build schedule assumes continuous 4-day team availability. | Reconfirm member availability blocks during kickoff standup. |
| **Track Scope** | Track 01: Agents That Act on Connected Data. | Assumes deterministic graph traversal qualifies as an "Agent" under evaluation criteria without mandatory external LLM. | Check Discord/FAQ if external LLM generation is explicitly required for Track 01 judging. |
| **Database** | FalkorDB is the mandatory/primary graph engine. | Assumes latest Docker image `falkordb/falkordb:latest` supports all required Cypher subqueries and multi-hop paths. | Run syntax validation tests on Docker container immediately at 12:05 AM IST, 15 Oct. |
| **Preparation Rules** | Planning, notes, diagrams, and schemas permitted; code forbidden. | Assumes detailed markdown specifications and pseudocode are 100% compliant with organizer guidelines. | Verify with community mentors if any planning document phrasing requires amendment. |

---

## 2. Technical Decisions Flagged for Kickoff Resolution

### Q1: FalkorDB openCypher Dialect Boundaries
- **Uncertainty:** Does the current release of FalkorDB support variable-length path pattern comprehensions (e.g., `[p = (h)-[:NEXT*]->(target) | length(p)]`) and dynamic `MERGE` on multiple labels?
- **Impact:** May require flattening deep Cypher traversals into Python-orchestrated 1-hop iterations if specific openCypher subquery syntax differs.
- **Resolution Plan:** Workstream 1 tests the exact planned query syntax against a live FalkorDB instance during the first 2 hours of kickoff.

### Q2: Integration of External LLM
- **Uncertainty:** Is an external LLM (e.g., Groq / Gemini / OpenAI) necessary, or does a 100% deterministic graph agent provide a more convincing, hallucination-free demo?
- **Trade-Off:**
  - *With LLM:* Provides fluid natural language prose summaries; risks network timeouts or API key issues during judging.
  - *Deterministic Only:* 100% reliable, explainable, and instantaneous; but judges might expect a conversational interface if "agent" is narrowly interpreted.
- **Resolution Plan:** Build deterministic engine first (Day 2). Add optional LLM summarization layer on Day 3 if time permits and team agrees.

### Q3: Batch Split and Merge Complexity in the MVP
- **Uncertainty:** Should the MVP attempt to model complex many-to-many batch merges (e.g., waste from 5 trucks mixed into a single compost windrow), or restrict the demo to 1-to-many splits (Scenario D)?
- **Recommendation:** Restrict Hackathon MVP to linear chains and 1-to-many splits. Many-to-many merges introduce heavy mass-balancing calculus that risks derailment.

### Q4: Cloud Deployment vs. Local Docker Demo
- **Uncertainty:** Will evaluators run the code locally or expect a public live demo link?
- **Recommendation:** Assume evaluators will judge via video demo and public GitHub repo. Prepare a rock-solid `docker compose up` that boots in under 60 seconds locally. Prepare a hosted Vercel frontend only if time permits on Day 4.

### Q5: Hash Representation for Supporting Evidence
- **Uncertainty:** How should weighbridge ticket images and scale logs be represented in the synthetic fixtures?
- **Resolution Plan:** Synthetic fixtures will generate mock SHA-256 hashes (`SHA256:7f9a...`) and link to bundled sample PDF/image mock assets. No external S3 storage bucket is required for the demo.
