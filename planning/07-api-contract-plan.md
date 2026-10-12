# 07 — Proposed API Contract Plan

> **Notice:** This document specifies the proposed REST API contracts for the ChakraSaakshya FastAPI backend. These specifications are conceptual designs for development during the hackathon. All payload schemas and response shapes are proposed designs, not implemented or verified endpoints.

---

## 1. Overview of Endpoints

| Method | Endpoint | Purpose | Target Consumer |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and FalkorDB connectivity verification. | Deployment monitor / Frontend |
| `POST` | `/api/demo/reset` | Purge graph and seed synthetic demo scenario fixtures. | Demo runner / Automated tests |
| `GET` | `/api/loads` | List all tracked loads with status, zone, and flags. | Loads Dashboard |
| `GET` | `/api/loads/{id}/graph` | Retrieve full custody subgraph (nodes & edges) for rendering. | Interactive Graph View |
| `POST` | `/api/loads/{id}/investigate`| Run deterministic investigation agent on a specified load. | Investigation Trigger / Audit |
| `GET` | `/api/cases` | List all open and resolved investigation cases. | Compliance Review Queue |
| `POST` | `/api/cases/{id}/review` | Submit human compliance supervisor decision and review notes. | Case Review Screen |
| `GET` | `/api/metrics` | High-level compliance stats (total tonnage, discrepancy rate). | Executive KPI Summary |

---

## 2. Detailed Endpoint Specifications

### 2.1 `GET /api/health`
- **Purpose:** Verifies backend health and active connection to FalkorDB.
- **Inputs:** None.
- **Proposed Response Body (`200 OK`):**
```json
{
  "status": "healthy",
  "database": "falkordb",
  "connected": true,
  "node_count": 142,
  "edge_count": 188,
  "version": "1.0.0-draft"
}
```
- **Error Codes:** `503 Service Unavailable` if FalkorDB connection fails.

---

### 2.2 `POST /api/demo/reset`
- **Purpose:** Resets the FalkorDB graph and re-seeds synthetic scenario fixtures (Scenarios A through G).
- **Inputs:** Optional JSON query parameter `scenario_set` (default: `"full"`).
- **Proposed Response Body (`200 OK`):**
```json
{
  "status": "reset_successful",
  "scenario_set": "full",
  "seeded_nodes": 64,
  "seeded_edges": 82,
  "timestamp": "2026-10-15T09:00:00Z"
}
```
- **Security:** In production, restricted to administrator roles. In hackathon demo, accessible via UI for live demonstrations.

---

### 2.3 `GET /api/loads`
- **Purpose:** Returns paginated list of waste loads, filterable by status or discrepancy presence.
- **Query Parameters:**
  - `status` (string, optional: `ALL`, `IN_TRANSIT`, `DELIVERED`, `FLAGGED_DISCREPANCY`)
  - `category` (string, optional: `Dry_Recyclable`, `Plastic_HDPE`, etc.)
  - `limit` (integer, default: 50)
- **Proposed Response Body (`200 OK`):**
```json
{
  "loads": [
    {
      "id": "LOAD-2026-0017",
      "category": "Dry_Recyclable",
      "status": "FLAGGED_DISCREPANCY",
      "zone": "Commercial Zone 3",
      "pickup_kg": 1000.0,
      "latest_stage": "MRF_INBOUND",
      "has_discrepancy": true,
      "discrepancy_code": "WEIGHT_MISMATCH",
      "delta_kg": 250.0
    }
  ],
  "total": 1
}
```

---

### 2.4 `GET /api/loads/{id}/graph`
- **Purpose:** Returns the visual subgraph (nodes, edges, layout metadata) for rendering the custody chain in Cytoscape or Force-Graph.
- **Path Parameter:** `id` (string, e.g., `LOAD-2026-0017`).
- **Proposed Response Body (`200 OK`):**
```json
{
  "load_id": "LOAD-2026-0017",
  "nodes": [
    {"id": "LOAD-2026-0017", "label": "Load", "category": "Dry_Recyclable"},
    {"id": "HND-8831", "label": "Handover", "stage": "PICKUP", "timestamp": "2026-10-15T08:30:00Z", "claimed_kg": 1000.0},
    {"id": "HND-8832", "label": "Handover", "stage": "MRF_INBOUND", "timestamp": "2026-10-15T11:15:00Z", "claimed_kg": 750.0},
    {"id": "VEH-TRK-09", "label": "Vehicle", "code": "FLEET-NORD-44"},
    {"id": "ACT-CONTR-04", "label": "Actor", "role": "COLLECTION_CONTRACTOR", "name": "Alpha Logistics"}
  ],
  "edges": [
    {"id": "e1", "source": "LOAD-2026-0017", "target": "HND-8831", "type": "HAS_HANDOVER"},
    {"id": "e2", "source": "HND-8831", "target": "HND-8832", "type": "NEXT"},
    {"id": "e3", "source": "LOAD-2026-0017", "target": "VEH-TRK-09", "type": "CARRIED_BY"},
    {"id": "e4", "source": "HND-8831", "target": "ACT-CONTR-04", "type": "FROM"}
  ]
}
```
- **Error Codes:** `404 Not Found` if `load_id` does not exist in FalkorDB.

---

### 2.5 `POST /api/loads/{id}/investigate`
- **Purpose:** Triggers the deterministic investigation agent pipeline on the load.
- **Path Parameter:** `id` (string).
- **Proposed Response Body (`200 OK`):**
```json
{
  "investigation_id": "INV-RUN-701",
  "load_id": "LOAD-2026-0017",
  "timestamp": "2026-10-15T11:20:00Z",
  "verdict": "UNEXPLAINED_DISCREPANCY_DETECTED",
  "findings": [
    {
      "rule": "WEIGHT_MISMATCH",
      "severity": "CRITICAL",
      "delta_kg": 250.0,
      "variance_percent": 25.0,
      "first_detected_at_handover": "HND-8832",
      "upstream_kg": 1000.0,
      "downstream_kg": 750.0,
      "details": "Mass dropped from 1000kg at Pickup to 750kg at MRF Gate without registered process loss."
    }
  ],
  "cross_load_patterns": {
    "actor_id": "ACT-CONTR-04",
    "total_open_discrepancies": 3,
    "cumulative_deficit_kg": 620.0,
    "pattern_risk_flag": true
  },
  "recommended_actions": [
    "Verify weighbridge calibration log for MRF Central Scale on 2026-10-15.",
    "Inspect driver GPS route for Vehicle VEH-TRK-09 between 08:30 and 11:15.",
    "Conduct physical inspection of contractor Alpha Logistics prior to invoice sign-off."
  ],
  "case_id": "CASE-2026-104",
  "disclaimer": "An unexplained discrepancy is not proof of wrongdoing. Recommended for human review."
}
```
- **Error Codes:** `404 Not Found`, `422 Unprocessable Entity` (if load data corrupted).

---

### 2.6 `GET /api/cases`
- **Purpose:** Lists all compliance review cases, sorted by priority.
- **Query Parameters:** `status` (`ALL`, `OPEN`, `IN_REVIEW`, `CLOSED_RESOLVED`), `priority` (`P1`, `P2`, `P3`).
- **Proposed Response Body (`200 OK`):**
```json
{
  "cases": [
    {
      "id": "CASE-2026-104",
      "load_id": "LOAD-2026-0017",
      "status": "OPEN",
      "priority": "P1",
      "opened_at": "2026-10-15T11:20:00Z",
      "discrepancy_code": "WEIGHT_MISMATCH",
      "delta_kg": 250.0,
      "review_notes": null
    }
  ],
  "total": 1
}
```

---

### 2.7 `POST /api/cases/{id}/review`
- **Purpose:** Allows a human supervisor to record a formal review disposition and audit notes without mutating or erasing original custody records.
- **Path Parameter:** `id` (string, e.g., `CASE-2026-104`).
- **Request Body:**
```json
{
  "reviewer_actor_id": "ACT-SUPER-01",
  "decision": "JUSTIFIED_LOSS",
  "justification_code": "CALIBRATION_DRIFT",
  "notes": "MRF scale technician confirmed 240kg offset tare glitch between 10:00-12:00. Ticket adjusted.",
  "status": "CLOSED_RESOLVED"
}
```
- **Proposed Response Body (`200 OK`):**
```json
{
  "case_id": "CASE-2026-104",
  "status": "CLOSED_RESOLVED",
  "updated_at": "2026-10-15T14:10:00Z",
  "message": "Case disposition recorded successfully. Historical custody records preserved."
}
```

---

### 2.8 `GET /api/metrics`
- **Purpose:** Aggregate statistics for the municipal dashboard.
- **Proposed Response Body (`200 OK`):**
```json
{
  "total_loads_tracked": 142,
  "total_tonnage_kg": 184500.0,
  "total_discrepancies_flagged": 7,
  "open_cases_count": 3,
  "discrepancy_rate_percent": 4.93,
  "cumulative_unreconciled_kg": 1450.0
}
```
