# ChakraSaakshya (चक्र साक्ष्य)
## Pre-Hackathon Planning Pack

> **Compliance Status: Pre-Event Preparation Only**  
> **Event:** WeMakeDevs × FalkorDB Hackathon — *Graph Hacks: Context for AI Agents*  
> **Timeline:** 15 October 2026, 12:01 AM IST – 18 October 2026, 11:59 PM IST  
> **Track:** Track 01 — Agents That Act on Connected Data  
> **Notice:** Under official hackathon competition rules, this repository currently contains **only written planning materials, architectural diagrams, schemas, and specifications**. No application source code, running services, executable seed scripts, or visual frontend implementations have been created or committed prior to the hackathon kickoff.

---

### Project Identity

- **Project Name:** ChakraSaakshya
- **Tagline:** Graph-powered waste-chain investigation agent
- **Repository:** [https://github.com/bh00mi-11/ChakraSaakshya](https://github.com/bh00mi-11/ChakraSaakshya)
- **Primary Graph Database:** FalkorDB

---

### Executive Overview

**ChakraSaakshya** (*Chakra* = Cycle / Circular Economy, *Saakshya* = Evidence / Custody Trail) is a graph-driven investigation agent designed for municipal compliance supervisors and material recovery facility (MRF) auditors. 

In municipal solid waste management, waste passes through multiple custody boundaries: from generator pick-up, through vehicle transit manifests and MRF gate weighments, to material recyclers. Discrepancies routinely arise: weights diminish unexpectedly, receipts go missing, or documentation is duplicated across conflicting trips. 

Traditional relational queries and siloed spreadsheets cannot trace multi-hop custody transfers, shared actors across unrelated manifests, or batch splitting lineages. ChakraSaakshya models the end-to-end custody trail in **FalkorDB**, enabling a deterministic investigation agent to:
1. Traverse multi-hop custody paths for any flagged load.
2. Pinpoint the first unexplained divergence (e.g., unaccounted mass loss, missing transfer receipts).
3. Identify shared contractors, vehicles, or facilities involved in concurrent discrepancies across the network.
4. Synthesize an evidence-backed case packet for human auditor review.

> **Important Investigative Principle:** An unexplained discrepancy is **not** definitive proof of theft, fraud, or criminal wrongdoing. Equipment calibration drifts, moisture evaporation, and unrecorded sorting residuals are common operational occurrences. ChakraSaakshya strictly flags anomalies, surfaces supporting records, and recommends human inspection; it **never** automates punitive or enforcement actions.

---

### Pre-Hackathon Planning Pack Index

The complete planning documentation is organized in the [`planning/`](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning) directory:

| Document | Title | Description |
| :--- | :--- | :--- |
| [01-project-brief.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/01-project-brief.md) | Project Brief | One-line pitch, 30s elevator pitch, problem statement, and scope boundaries. |
| [02-problem-and-user.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/02-problem-and-user.md) | Problem & User Context | Custody stages, target personas, and operational failure modes. |
| [03-graph-model.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/03-graph-model.md) | Conceptual Graph Schema | Node labels, properties, edge relationships, and traversal logic. |
| [04-investigation-rules.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/04-investigation-rules.md) | Investigation Rules | Logic, tolerances, and false-positive guards for 5 discrepancy classes. |
| [05-agent-workflow.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/05-agent-workflow.md) | Agent Workflow | Deterministic 6-step traversal sequence, guardrails, and sequence diagram. |
| [06-system-architecture.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/06-system-architecture.md) | System Architecture | Proposed FastAPI + Next.js + FalkorDB stack and component topology. |
| [07-api-contract-plan.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/07-api-contract-plan.md) | API Contract Plan | Proposed REST endpoint specs, payload schemas, and status codes. |
| [08-test-scenarios.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/08-test-scenarios.md) | Test Scenarios | 7 synthetic edge-case scenarios (A through G) with expected outputs. |
| [09-four-day-build-plan.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/09-four-day-build-plan.md) | Four-Day Build Plan | Daily milestones, risks, and contingencies for 15–18 October 2026 IST. |
| [10-team-task-breakdown.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/10-team-task-breakdown.md) | Team Task Breakdown | Four workstream splits and dependency handoffs for a 4-person team. |
| [11-technical-decisions.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/11-technical-decisions.md) | Technical Decisions | Trade-offs on graph DBs, deterministic engines vs. LLMs, and deployment. |
| [12-demo-and-submission-plan.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/12-demo-and-submission-plan.md) | Demo & Submission Plan | 2m30s video storyboard and hackathon submission requirements. |
| [13-kickoff-checklist.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/13-kickoff-checklist.md) | Kickoff Checklist | Step-by-step checklist to execute immediately at 12:01 AM IST, 15 Oct. |
| [14-open-questions.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/14-open-questions.md) | Open Questions | Technical uncertainties and rule verifications flagged for kickoff. |
| [15-project-foundation-spec.md](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/15-project-foundation-spec.md) | Reusable Foundation Spec | Repository layout plan, env/docker blueprints, UI tokens, and task dependency order. |

---

### Implementation Notice

All coding, service deployment, database containerization, and dataset generation will commence strictly upon official hackathon kickoff on **15 October 2026, 12:01 AM IST**.
