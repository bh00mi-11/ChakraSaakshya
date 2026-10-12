# 12 — Demo and Submission Plan

> **Notice:** This document plans the exact storyboard, timing, talking points, visual cues, and submission package requirements for ChakraSaakshya. It ensures that the team produces a compelling, compliant 2-minute 30-second presentation within the hackathon deadlines.

---

## 1. Demo Video Storyboard (Exact 2m 30s Breakdown)

| Time Range | Segment Title | Visual Display | Narration / Audio Script | Key Message / Track Alignment |
| :---: | :--- | :--- | :--- | :--- |
| **0:00 – 0:20**<br>(20s) | **The Municipal Blindspot** | Title slide + split screen showing paper pickup receipts vs. downstream MRF empty bays. | *"In municipal waste management, recording a pickup does not prove downstream recycling. Waste moves across contractors and transfer stations, and mass frequently vanishes in the documentation gaps."* | Establishes the real-world operational problem. |
| **0:20 – 0:40**<br>(20s) | **The Anomaly: Load L-017** | ChakraSaakshya Dashboard; filter to `LOAD-2026-0017`; highlight red discrepancy badge. | *"Meet Load L-017. 1,000 kg was collected in Commercial Sector 3, but the Material Recovery Facility only logged 750 kg. A 250 kg deficit with no explanation."* | Introduces concrete Scenario B data. |
| **0:40 – 1:10**<br>(30s) | **The Connected Custody Graph** | Switch to Interactive Graph View; zoom in on $H_1 \to H_2$ nodes and attached weighment tickets. | *"Rather than sifting through spreadsheets, ChakraSaakshya models the custody chain in FalkorDB. Here is the pickup handover, the transport truck, the weighbridge scale reading, and the MRF receiving gate."* | Demonstrates FalkorDB connected schema. |
| **1:10 – 1:40**<br>(30s) | **The Agent in Action** | Click 'Investigate'; show real-time tool logs traversing graph and expanding 2-hop neighborhood. | *"Our investigation agent traverses the custody graph. It isolates the exact handover where the weight dropped, verifies that no loss voucher exists, and then checks connected actors. It reveals contractor Alpha Logistics is linked to two other open deficits across town."* | **Highlights Track 01:** Agent acting on connected graph data. |
| **1:40 – 2:05**<br>(25s) | **The Evidence Dossier** | Display generated Case Report: delta calculation, ticket hashes, and recommended next steps. | *"The agent compiles an evidence dossier. Crucially, it doesn't accuse anyone of theft. It recommends three specific actions: verify the MRF scale calibration, inspect vehicle tare logs, and audit the contractor before releasing payment."* | Demonstrates ethics, explainability, and utility. |
| **2:05 – 2:30**<br>(25s) | **Human Review & Graph Necessity** | Supervisor inputs review disposition; show terminal cutting FalkorDB to prove graph dependency. | *"A human supervisor reviews the evidence and records the resolution, preserving history. And notice: if we disable FalkorDB, this multi-hop investigation is impossible. ChakraSaakshya: bringing graph-powered integrity to waste management."* | Shows negative proof & human-in-the-loop completion. |

---

## 2. Submission Package Checklist

Before the 18 October 2026, 11:59 PM IST deadline, the team must assemble and verify all required hackathon deliverables:

### 1. Public GitHub Repository
- [ ] Repository public and accessible: `https://github.com/bh00mi-11/ChakraSaakshya`
- [ ] No secrets, `.env` API keys, or private tokens committed.
- [ ] Commit history reflects genuine active development between 15 Oct and 18 Oct 2026.

### 2. Comprehensive Root `README.md`
- [ ] Clear project banner, tagline, and track declaration (Track 01: Agents That Act on Connected Data).
- [ ] Architecture diagram and FalkorDB graph schema diagram.
- [ ] Sample Cypher queries illustrating the core custody traversals.
- [ ] Step-by-step local reproduction instructions (`docker compose up`).
- [ ] Explanation of what makes the application strictly graph-dependent.

### 3. Demonstration Video
- [ ] Length: Strictly between 2:00 and 2:30 minutes.
- [ ] Hosted on public video platform (YouTube unlisted / Loom).
- [ ] Clear narration audio with 1080p screen recording.
- [ ] Storyboard milestones met (includes negative proof showing graph necessity).

### 4. Technical Artifacts
- [ ] Functional FalkorDB Docker container integration.
- [ ] Seed script (`/api/demo/reset`) loading all 7 test scenarios.
- [ ] Responsive frontend demonstrating all 4 core screens.

### 5. Mandatory Hackathon Disclosures
- [ ] Declared Track: Track 01.
- [ ] Primary Graph Database: FalkorDB.
- [ ] AI Assistance Disclosure: Statement documenting any LLMs or AI assistants used for code scaffolding or planning during the event.
