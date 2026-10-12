# 01 — Project Brief: ChakraSaakshya

## 1. Project Identification

- **Project Name:** ChakraSaakshya (चक्र साक्ष्य)
- **Tagline:** Graph-powered waste-chain investigation agent
- **Target Hackathon:** WeMakeDevs × FalkorDB — *Graph Hacks: Context for AI Agents* (15–18 Oct 2026)
- **Category / Track:** Track 01 — Agents That Act on Connected Data
- **Primary Data Store:** FalkorDB (In-memory graph database with Cypher query support)

---

## 2. One-Line Pitch

> *ChakraSaakshya transforms fragmented municipal waste transfer receipts into an auditable custody graph, enabling an autonomous investigation agent to trace multi-hop mass discrepancies, uncover cross-load actor patterns, and assemble evidence packets for compliance review.*

---

## 3. 30-Second Verbal Pitch

"Every day, thousands of metric tons of municipal solid waste and recyclable materials move between collection zones, transport contractors, and Material Recovery Facilities (MRFs). When 1,000 kg leaves a commercial sector but only 750 kg registers at the recovery gate, identifying where the mass disappeared—or whether it is a documentation gap, weighbridge fault, or diversion—requires stitching together multiple paper manifests, weighbridge tickets, and driver logs across different organizations. 

ChakraSaakshya leverages FalkorDB to model the full waste custody chain as a property graph. When a discrepancy is detected, our deterministic investigation agent traverses the custody graph, pinpoints the earliest point of divergence, checks if the same truck or contractor is linked to other missing loads across the city, and compiles an evidence-backed case file. Most importantly, it empowers human compliance officers to act on clear visual evidence rather than opaque suspicions."

---

## 4. Problem & Current Workflow

### The Status Quo in Municipal Solid Waste (MSW) Oversight
1. **Siloed Records:** Collection contractors keep vehicle trip sheets; transit weighbridges produce physical or local digital printouts; MRFs operate standalone inventory databases; end recyclers maintain purchase orders.
2. **Delayed Reconciliation:** Mass balances are typically audited weekly or monthly via spreadsheet dumps. By the time a cumulative 10-ton deficit is flagged, trucks have driven hundreds of subsequent routes and documentation is lost.
3. **Multi-Hop Blindspots:** If Load A is split into Batch B1 and Batch B2 at a transfer station, a missing handover on B2 is virtually invisible in a relational database without expensive, recursive join queries.
4. **Network Blindspots:** If a rogue or malfunctioning transport contractor is short-dropping 100 kg across 15 different collection zones, each individual drop appears within acceptable daily variance, but the connected network reveals a systemic deficit.

---

## 5. The Proposed Solution: Graph-Powered Investigation

ChakraSaakshya introduces a continuous graph-based custody auditing framework:
- **Connected Custody Ingestion:** Every collection, trip manifest, weighment, and recovery acknowledgement is ingested as connected nodes and edges in FalkorDB.
- **Automated Anomaly Detection:** Deterministic rules continuously monitor handover nodes for mass conservation violations, missing counter-receipts, and reused weighment hashes.
- **Graph Traversal Investigation:** When triggered, the investigation agent traverses up and downstream along `:NEXT` and `:CARRIED_BY` relationships, uncovering structural custody breaks and cross-load actor overlaps.
- **Evidence Dossier Generation:** The agent structures the graph walk into a human-readable case report detailing exact node IDs, delta quantities, traversed paths, and concrete inspection recommendations.

---

## 6. Why Graph-Based Investigation is Essential

| Investigation Requirement | Relational / Tabular Approach | Graph Approach (FalkorDB) |
| :--- | :--- | :--- |
| **Multi-Hop Custody Trail** | Complex, slow recursive SQL queries (`WITH RECURSIVE`) joining multiple staging tables. | Direct topological traversal (`MATCH (h:Handover)-[:NEXT*]->(target)`). |
| **Cross-Load Actor Correlation** | Expensive multi-table joins across hundreds of thousands of independent trips. | 2-hop graph neighborhood expansion around `:Actor` or `:Vehicle` nodes. |
| **Splits, Merges & Batch Lineage** | Inflexible schema; parent-child hierarchical trees break when batches merge. | Natural Directed Acyclic Graph (DAG) representation of split and merge handovers. |
| **Explainable Evidence Path** | Abstract query results that must be manually pieced together by auditors. | Traversable graph paths that map directly to physical visual diagrams for court/compliance evidence. |

---

## 7. Scope Boundaries & Investigative Ethics

### What ChakraSaakshya Does
- Identifies and highlights mathematical discrepancies in mass balance.
- Uncovers missing links in the chain of custody.
- Flags reused verification evidence (e.g., identical weighbridge ticket hashes).
- Surfaces shared entities (vehicles, drivers, contractors) across anomalous handovers.
- Provides compliance officers with a chronological, evidence-linked case report.

### What ChakraSaakshya Explicitly Does NOT Claim
- **Does NOT prove criminal fraud or theft:** Mass variances can stem from moisture loss, mechanical spillage, scale calibration drift, or manual clerical errors.
- **Does NOT impose automated fines or sanctions:** All findings are strictly classified as "Unexplained Discrepancies Requiring Inspection."
- **Does NOT make probabilistic guesses:** The core agent operates on deterministic graph traversals and mathematical thresholds, ensuring every claim is backed by explicit node and edge IDs.
