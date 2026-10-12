# 11 — Technical Decisions & Trade-Offs

> **Notice:** This document details the technical rationale, architectural trade-offs, and alternative analyses underlying the ChakraSaakshya project design. No performance metrics or compatibility benchmarks are claimed without empirical validation.

---

## 1. Why FalkorDB as the Primary Graph Database?

### Rationale
1. **In-Memory Graph Traversal Speed:** FalkorDB uses sparse matrix linear algebra (GraphBLAS) principles implemented in C, providing low query latencies for deep multi-hop traversals like `-[:NEXT*]->`.
2. **Standard openCypher Dialect:** Familiar and expressive declarative graph query syntax, simplifying complex graph-walk logic compared to imperative graph APIs.
3. **Official Python Client (`falkordb-py`):** Direct support for Python 3, allowing seamless integration with our FastAPI backend.
4. **Lightweight Deployment Footprint:** Operates as a compact Docker container using the Redis protocol, drastically reducing startup friction compared to heavy JVM-based graph databases.

---

## 2. Why a Relational Database Alone Fails the Graph-Dependency Test

A foundational question for Track 01 ("Agents That Act on Connected Data"): *Could this problem be solved using PostgreSQL or MySQL?*

| Feature | Relational Database (SQL) | FalkorDB (Property Graph) |
| :--- | :--- | :--- |
| **Multi-Hop Custody Trail** | Requires complex recursive Common Table Expressions (`WITH RECURSIVE`). Fragile to schema changes; performance degrades rapidly as path length grows. | Native topological traversal: `(h:Handover)-[:NEXT*]->(target)` executed natively without joins. |
| **Cross-Load Neighborhood Discovery** | Requires 4-to-5 table joins across `loads`, `handovers`, `actors`, and `discrepancies`. Query plans become complex and slow under real-time load. | Intuitive 2-hop graph neighborhood expansion: `MATCH (a:Actor)<-[:FROM|TO]-(h)<-[:HAS_HANDOVER]-(l)-[:HAS_DISCREPANCY]->(d)`. |
| **Dynamic Batch Splits & Merges** | Rigid foreign key constraints struggle with dynamic 1-to-many and many-to-1 batch lineages. | Handover nodes naturally form a Directed Acyclic Graph (DAG) accommodating arbitrary splits and merges. |
| **Explaining the Evidence Path** | Relational queries output flat rows; reconstructing the narrative custody path requires client-side sorting and manual graph rebuilding. | Cypher returns connected paths directly (`path = (a)-[*]->(b)`), mapping 1-to-1 with physical custody evidence. |

**Conclusion:** Relational databases treat connections as secondary join artifacts; ChakraSaakshya treats the connections themselves as primary evidence. Removing the graph database dismantles the agent's core capability.

---

## 3. Deterministic Investigation Engine vs. Generative LLM

### The Decision: Determinism First, LLM Optional
- **Core Investigation:** Handled **100% deterministically** in Python using parameterized Cypher queries and mathematical tolerance checks.
- **Why?**
  - **Compliance Auditing Requires Zero Hallucination:** A municipal fine or contract audit cannot be based on a model's probabilistic hallucination. Every gram of deficit and every cited ticket must refer to an exact, verifiable graph node.
  - **Reproducibility:** Re-running an investigation on the same graph state must always yield identical findings and recommendations.
  - **Latency and Cost:** Local rule execution takes milliseconds and incurs zero API costs or token rate-limit risks.
- **Role of the LLM (Optional):**
  - If included, an LLM is strictly used as an executive briefing summarizer. It receives a verified JSON payload of confirmed findings and formats it into natural language. It is **never** permitted to generate freeform Cypher or decide guilt.

---

## 4. Local Containerization vs. Cloud Deployment

### Local Docker Compose as the Primary Target
- **Decision:** Target a 100% locally reproducible Docker Compose environment (`docker compose up`) for FalkorDB, the backend, and frontend.
- **Trade-Off Analysis:**
  - *Cloud Hosting (AWS/Fly.io):* Introduces risks of remote network timeouts, cloud database provisioning failures, credential leakage, and live-demo network drops.
  - *Local Containers:* Zero network dependency during live judging, immediate startup, and guarantees reproducibility on the evaluation judges' machines.
  - *Contingency:* If time permits on Day 4, a live deployment (e.g., Vercel + cloud FalkorDB) can be created as a stretch goal, but the local setup remains the primary tested artifact.

---

## 5. Scope Management: Core Essentials vs. Stretch Features

To guarantee successful delivery within 4 days, features are strictly classified:

### Essential Core Features (Must Ship)
- Ingest synthetic custody graph for Scenarios A through G into FalkorDB.
- Working deterministic rules: `WEIGHT_MISMATCH`, `MISSING_HANDOVER`, `PATTERN_RISK`.
- Parameterized Cypher query tool layer.
- Next.js dashboard with interactive graph canvas showing custody chain.
- Supervisor review workflow updating `:Case` status without mutating custody history.
- Complete documentation and 2m30s demo video.

### Stretch Features (Deferred if Behind Schedule)
- Live LLM executive briefing generation.
- Real-time GPS path mapping overlay.
- Batch merge reconciliation for complex multi-source composting.
- Automated PDF report export button.
- Cloud deployment on public hosting URL.
