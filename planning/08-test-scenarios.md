# 08 — Synthetic Test Scenarios

> **Notice:** This document defines the fictional scenario specifications and expected agent outputs for validating ChakraSaakshya during the hackathon. These are test specifications only; no importable dataset files, seed scripts, or executable unit tests are created prior to kickoff.

---

## 1. Scenario Master Matrix

| ID | Scenario Title | Fictional Setup | Expected Rule / Status | Evidence Agent Must Return | What Agent Must NOT Conclude | Event Testing Focus |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | **Ordinary Load (Nominal Variance)** | Pickup recorded at 1,000 kg. MRF gate scale records 994 kg (6 kg / 0.6% variance). | `STATUS_NORMAL` (No Discrepancy) | Graph path $H_1 \to H_2$, delta 6.0 kg, evaluation showing $\Delta < \max(15\text{kg}, 1\%)$. | Must NOT flag as an anomaly, theft, or diversion. | Verify relative tolerance math and threshold boundary logic. |
| **B** | **Unexplained Weight Gap** | Commercial pickup at 1,000 kg. MRF gate scale records 750 kg (250 kg / 25% drop). No loss docs. | `WEIGHT_MISMATCH` (Severity: `CRITICAL`) | Specific Handover IDs $H_1, H_2$, delta 250.0 kg, lack of attached loss voucher. | Must NOT declare criminal theft or blame driver personally. | Verify delta calculation, severity ranking, and path localization. |
| **C** | **Missing Inbound Receipt** | Pickup and transfer station weighments exist ($H_1, H_2$); truck departs for MRF East, but no gate handover exists after 8 hours. | `MISSING_HANDOVER` (Severity: `HIGH`) | Last confirmed node $H_2$, missing terminal handover, elapsed time metric (8h > 6h limit). | Must NOT declare load destroyed or stolen; must cite missing record. | Test handling of incomplete paths and broken chain-of-custody. |
| **D** | **Legitimate Split Batch** | Bulk Load of 1,000 kg splits at transfer hub into Batch B1 (600 kg) and Batch B2 (390 kg) with documented 10 kg sorting residue voucher. | `STATUS_NORMAL` (Split Reconciled) | 1-to-many branch graph; sum of child branches + loss voucher $(600 + 390 + 10 = 1000\text{kg})$. | Must NOT trigger false `WEIGHT_MISMATCH` on individual child branches. | Test DAG branch aggregation and process loss voucher reconciliation. |
| **E** | **Duplicate Proof (Reused Ticket)** | Two different loads ($L_1$ and $L_2$) handled 5 hours apart attach identical weighbridge ticket PDF hash `SHA256:7f9a...`. | `DUPLICATE_EVIDENCE` (Severity: `HIGH`) | Disjoint Handover nodes $H_{1,2}$ and $H_{2,2}$ both connected to identical `Evidence` node via `:SUPPORTED_BY`. | Must NOT assume malicious fraud; may be clerical re-upload. | Test multi-parent evidence node queries across disjoint loads. |
| **F** | **Repeated Actor Correlation** | Contractor `ACT-CONTR-04` has 3 separate loads with unresolved weight gaps over 4 days, totaling 620 kg deficit. | `PATTERN_RISK` (Severity: `CRITICAL`) | 2-hop neighborhood showing contractor connected to $L_{17}, L_{22}, L_{31}$ each having open `WEIGHT_MISMATCH`. | Must NOT blacklist contractor automatically; must recommend formal audit. | Test multi-load entity aggregation and rolling threshold calculation. |
| **G** | **Post-Review Case Update** | Supervisor reviews Case #104 (Load B), enters explanation ("scale zero calibration drift confirmed"), closes case. | `CLOSED_RESOLVED` (Historical nodes immutable) | Original measurement ($750\text{ kg}$) preserved; `Case` node updated with review disposition & note. | Must NOT delete original `Handover` or `Measurement` graph nodes. | Verify data immutability and append-only audit trail integrity. |

---

## 2. Detailed Scenario Profiles

### Scenario B Profile (Primary Demo Scenario: Load `L-017`)
- **Load ID:** `LOAD-2026-0017`
- **Category:** `Dry_Recyclable`
- **Handover 1 (`HND-8831`):** Stage `PICKUP`, Actor `ACT-CONTR-04` (Alpha Logistics), Time `08:30`, Net Weight `1000.0 kg`, Evidence `TICKET-8831.pdf`.
- **Handover 2 (`HND-8832`):** Stage `MRF_INBOUND`, Facility `FAC-MRF-02`, Time `11:15`, Net Weight `750.0 kg`, Evidence `TICKET-8832.pdf`.
- **Agent Path Traversal:**
  $$HND\text{-}8831 \xrightarrow{NEXT} HND\text{-}8832$$
- **Variance:** $1000.0 - 750.0 = 250.0\text{ kg}$ ($25.0\%$ deficit).
- **Rule F Triggered Alongside:** Agent detects that `ACT-CONTR-04` is also linked to `LOAD-2026-0005` (180 kg deficit) and `LOAD-2026-0011` (190 kg deficit), escalating the case to `P1` priority.

### Scenario D Profile (Branching & Split Lineage)
- **Parent Load:** `LOAD-SPLIT-01` ($1000.0\text{ kg}$)
- **Split Event:** Intermediate Transfer Station `FAC-TS-01`
- **Child Branch 1:** `LOAD-PART-A` ($600.0\text{ kg}$) $\to$ Plastic Sorting Line
- **Child Branch 2:** `LOAD-PART-B` ($390.0\text{ kg}$) $\to$ Cardboard Baling Line
- **Adjustment Node:** `EVI-LOSS-09` ($10.0\text{ kg}$) $\to$ Documented sorting moisture & inert sweepings.
- **Verification Formula:**
  $$|W_{parent} - (W_{child1} + W_{child2} + W_{loss})| = |1000 - (600 + 390 + 10)| = 0.0\text{ kg} \le \text{tolerance}$$
- **Result:** Balanced; no discrepancy created.

### Scenario G Profile (Compliance Resolution & Immutability)
- **Input:** Supervisor reviews `CASE-2026-104`.
- **Review Form Action:** Selects `"JUSTIFIED_LOSS"`, reason `"CALIBRATION_DRIFT"`, notes `"Scale technician confirmed tare tare sensor offset"`.
- **Graph State Mutation:**
  - `(c:Case {id: 'CASE-2026-104'})` receives property `status: 'CLOSED_RESOLVED'`.
  - Node properties `reviewer_notes` and `resolved_at` appended.
  - Nodes `HND-8831`, `HND-8832`, `MEA-9102` remain **completely untouched**, preserving evidentiary integrity for external municipal oversight.
