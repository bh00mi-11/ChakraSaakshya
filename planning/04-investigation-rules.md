# 04 — Investigation Rules

> **Notice:** This document defines the mathematical and logical rule specifications for detecting custody anomalies in ChakraSaakshya. These rules are presented in clear engineering prose and pseudocode specifications. This is a design specification, not an executable rules engine.

---

## 1. Measurement Fundamentals & Tolerances

To avoid spurious false alarms caused by natural physical variations in waste handling, the investigation engine relies on strict standardized definitions:

### Mass Definitions
- **Gross Weight ($W_{gross}$):** Total weight recorded when the loaded vehicle or container is on the weighbridge scale.
- **Tare Weight ($W_{tare}$):** Weight of the empty vehicle or container after unloading.
- **Net Payload ($W_{net}$):** The true mass of waste transferred:
  $$W_{net} = W_{gross} - W_{tare}$$
- **Claimed Mass ($W_{claimed}$):** The mass declared on the manifest prior to weighing.

### Configurable Tolerances
- **Relative Tolerance ($\epsilon_{rel}$):** Default set to **1.0%** ($\pm 0.01$) to account for weighbridge calibration tolerance and slight moisture evaporation during transit.
- **Absolute Threshold ($\epsilon_{abs}$):** Default set to **15.0 kg** for minor spillage or scale sensitivity floors.
- **Acceptable Difference Rule:** A weight variance between Stage $i$ and Stage $j$ is considered within tolerance if:
  $$|W_{net, i} - W_{net, j}| \le \max(\epsilon_{abs}, \epsilon_{rel} \times W_{net, i})$$

### Documented Losses & Batch Lineage
- **Documented Process Loss ($L_{proc}$):** During sorting at an MRF, moisture loss, sorting reject inert residuals, or wash water drainage may be formally registered via an adjustment receipt. A mass decrease is legitimate *only* if backed by an explicit adjustment record.
- **Splits & Merges:** When Load $A$ ($W_A$) splits into Load $B$ ($W_B$) and Load $C$ ($W_C$), mass conservation requires:
  $$|W_A - (W_B + W_C + L_{proc})| \le \text{tolerance}$$

---

## 2. Five Core Rule Classes

### Rule 1: `MISSING_HANDOVER` (Custody Gap)
- **Input Evidence:** Ordered sequence of `Handover` nodes for a given `Load` along `:NEXT` edges; expected terminal facility type from transit manifest.
- **Detection Logic:** A load is marked in transit, but elapsed time between departure and expected arrival exceeds maximum expected transit duration (e.g., > 6 hours), or downstream facility has received subsequent loads from the same vehicle while the subject load has no registered `MRF_INBOUND` handover.
- **Safeguards:** Vehicle breakdown logs or scheduled multi-stop manifests must suppress false flags.
- **Expected Result:** Generates `Discrepancy` with code `MISSING_HANDOVER`, severity `HIGH`, delta representing 100% of the in-transit claimed mass.
- **Potential False Positive:** Vehicle arrived at gate during power failure; paper manifest collected but digital entry delayed.

#### Plain-English Pseudocode
```text
FUNCTION check_missing_handover(load_node):
    handovers = GET_ORDERED_HANDOVERS(load_node)
    last_handover = LAST_ELEMENT(handovers)
    
    IF last_handover.stage == "PICKUP" OR last_handover.stage == "TRANSFER_SCALE":
        elapsed_hours = (CURRENT_TIME - last_handover.timestamp) in hours
        IF elapsed_hours > MAX_TRANSIT_HOURS (e.g. 6.0):
            CREATE_DISCREPANCY(
                code="MISSING_HANDOVER",
                delta_kg=last_handover.claimed_kg,
                severity="HIGH",
                status="OPEN"
            )
```

---

### Rule 2: `WEIGHT_MISMATCH` (Mass Conservation Violation)
- **Input Evidence:** Consecutive pairs of `Handover` nodes $(H_1, H_2)$ along `:NEXT`, each associated with a `Measurement` node $(M_1, M_2)$.
- **Detection Logic:** Compute $\Delta_{kg} = M_1.net\_kg - M_2.net\_kg$. If $\Delta_{kg} > \max(\epsilon_{abs}, \epsilon_{rel} \times M_1.net\_kg)$ and no linked documentation for $L_{proc}$ exists, trigger an anomaly.
- **Safeguards:** Check for reverse gross/tare errors (where $W_{tare} > W_{gross}$).
- **Expected Result:** Generates `Discrepancy` with code `WEIGHT_MISMATCH`, severity proportional to deficit (e.g., $>5\%$ is `HIGH`, $>20\%$ is `CRITICAL`).
- **Potential False Positive:** Open-top container caught in heavy rainfall (causing weight *gain*) or extreme high-temperature sludge drying.

#### Plain-English Pseudocode
```text
FUNCTION check_weight_mismatch(handover_a, handover_b):
    m_a = GET_MEASUREMENT(handover_a)
    m_b = GET_MEASUREMENT(handover_b)
    
    delta = m_a.net_kg - m_b.net_kg
    allowed_tolerance = MAX(15.0, 0.01 * m_a.net_kg)
    
    IF delta > allowed_tolerance:
        severity = "MEDIUM"
        IF (delta / m_a.net_kg) > 0.10:
            severity = "HIGH"
        IF (delta / m_a.net_kg) > 0.25:
            severity = "CRITICAL"
            
        CREATE_DISCREPANCY(
            code="WEIGHT_MISMATCH",
            delta_kg=delta,
            severity=severity,
            status="OPEN"
        )
```

---

### Rule 3: `DUPLICATE_EVIDENCE` (Evidence Collusion / Recycling)
- **Input Evidence:** `Evidence` nodes connected via `:SUPPORTED_BY` to distinct `Handover` nodes across the graph.
- **Detection Logic:** Query for any two distinct `Handover` nodes $H_1 \ne H_2$ that share an `Evidence` node with identical cryptographic hash `hash` or identical receipt document URI, where the handover timestamps differ by more than allowed re-entry window or belong to different physical loads.
- **Safeguards:** Exclude master service agreements or umbrella vendor licenses which legitimately attach to multiple loads. Rule applies exclusively to `kind IN ['WEIGHBRIDGE_TICKET', 'PHOTOMANIFEST']`.
- **Expected Result:** Generates `Discrepancy` with code `DUPLICATE_EVIDENCE`, severity `HIGH`.
- **Potential False Positive:** Administrative re-scan of an amended ticket intended to correct an earlier typographic entry on the same batch.

#### Plain-English Pseudocode
```text
FUNCTION check_duplicate_evidence(evidence_node):
    linked_handovers = GET_CONNECTED_HANDOVERS(evidence_node)
    
    IF evidence_node.kind == "WEIGHBRIDGE_TICKET" AND COUNT(linked_handovers) > 1:
        FOR EACH (h1, h2) IN PAIRS(linked_handovers):
            IF h1.source_load_id != h2.source_load_id:
                CREATE_DISCREPANCY(
                    code="DUPLICATE_EVIDENCE",
                    delta_kg=0.0,
                    severity="HIGH",
                    status="OPEN"
                )
```

---

### Rule 4: `CATEGORY_CONTRADICTION` (Classification Divergence)
- **Input Evidence:** Declared category on `Load` vs. category registered at intermediate transfer station vs. category logged at MRF reception.
- **Detection Logic:** Compare string/taxonomy tokens between upstream handover manifest category and downstream gate classification. If upstream declared "Sorted Recyclables" but downstream logged "Mixed Wet Residue", trigger flag.
- **Safeguards:** Permitted taxonomy mappings (e.g., "PET Bottle Bales" is a valid child sub-category of "Dry Plastic").
- **Expected Result:** Generates `Discrepancy` with code `CATEGORY_CONTRADICTION`, severity `MEDIUM`.
- **Potential False Positive:** High contamination in source bin resulted in facility rejecting batch down to inert grade upon physical visual inspection.

#### Plain-English Pseudocode
```text
FUNCTION check_category_contradiction(load_node, handover_node):
    expected_cat = load_node.category
    observed_cat = handover_node.manifest_category
    
    IF NOT IS_COMPATIBLE_SUBCLASS(expected_cat, observed_cat):
        CREATE_DISCREPANCY(
            code="CATEGORY_CONTRADICTION",
            delta_kg=0.0,
            severity="MEDIUM",
            status="OPEN"
        )
```

---

### Rule 5: `PATTERN_RISK` (Cross-Load Entity Correlation)
- **Input Evidence:** Subgraph neighborhood (2-hop) connecting `:Actor` (contractor/driver) or `:Vehicle` to all loads handled within a rolling window (e.g., past 7 days).
- **Detection Logic:** Calculate the ratio and count of unresolved `Discrepancy` nodes connected to loads associated with this specific Actor/Vehicle. If an entity is involved in $\ge 3$ distinct unresolved discrepancies totaling $> 500 \text{ kg}$ deficit, flag entity-level correlation.
- **Safeguards:** Normalize for total trip volume (a fleet doing 500 trips has higher raw variance count than one doing 5 trips).
- **Expected Result:** Generates `Discrepancy` with code `PATTERN_RISK`, severity `CRITICAL`.
- **Potential False Positive:** A specific vehicle has a faulty tare scale sensor causing systematic 20 kg misreadings on every trip, rather than operational diversion.

#### Plain-English Pseudocode
```text
FUNCTION check_pattern_risk(actor_node, time_window_days=7):
    recent_loads = GET_LOADS_HANDLED_BY(actor_node, time_window_days)
    discrepancies = GET_DISCREPANCIES_FOR_LOADS(recent_loads)
    
    unresolved_count = COUNT_WHERE(discrepancies, status="OPEN")
    cumulative_loss = SUM(discrepancies.delta_kg)
    
    IF unresolved_count >= 3 AND cumulative_loss > 500.0:
        CREATE_DISCREPANCY(
            code="PATTERN_RISK",
            delta_kg=cumulative_loss,
            severity="CRITICAL",
            status="OPEN"
        )
```

---

## 3. Human Review as the Mandatory Resolution Path

Under all circumstances:
1. Every generated `Discrepancy` is linked to a `Case` node.
2. The system **never** applies penalties, fines, or contractual blacklisting automatically.
3. A compliance officer must inspect the generated case dossier, interview the involved parties, review operational logs (e.g., scale maintenance sheets, weather records), and submit an explicit human review verdict (`JUSTIFIED_LOSS` or `ESCALATED_AUDIT`).
