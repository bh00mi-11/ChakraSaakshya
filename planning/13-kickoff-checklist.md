# 13 — Kickoff Checklist

> **Notice:** This checklist is to be executed by the team immediately at **12:01 AM IST on 15 October 2026** when the hackathon officially opens. Do not execute any implementation steps prior to this timestamp.

---

## 1. Compliance & Rules Verification (T-00:00 to T+00:30)
- [ ] **Check Hackathon Portal Announcements:** Re-read the latest official WeMakeDevs × FalkorDB rules on the event platform (Discord / Devfolio / WeMakeDevs portal) for any last-minute amendments or track clarifications.
- [ ] **Confirm Team Registration:** Ensure all 4 team members are confirmed on the official hackathon dashboard under team "ChakraSaakshya".
- [ ] **Confirm Track Selection:** Verify team registration is logged for **Track 01: Agents That Act on Connected Data**.
- [ ] **Agree on Workstream Owners:** Assign named members to the 4 planned workstreams ([`10-team-task-breakdown.md`](file:///c:/Users/manis/OneDrive/Desktop/vit/ChakraSaakshya/planning/10-team-task-breakdown.md)).

---

## 2. Environment & Tooling Setup (T+00:30 to T+02:00)
- [ ] **Verify Git Repository Cleanliness:**
  - Verify that only permitted planning markdown files exist in `planning/` and root `PREPARATION.md`.
  - Confirm origin remote URL is `https://github.com/bh00mi-11/ChakraSaakshya`.
- [ ] **Pull and Test FalkorDB Container:**
  - Pull latest official FalkorDB Docker image (`docker pull falkordb/falkordb:latest`).
  - Run test instance on local port `6379`.
- [ ] **Verify Python Client (`falkordb-py`):**
  - Install official driver: `pip install falkordb`.
  - Verify connectivity with a minimal test script executing `GRAPH.QUERY "test" "RETURN 1"`.
- [ ] **Initialize Clean Git Ignore:**
  - Create standard `.gitignore` covering `.env`, `node_modules/`, `__pycache__/`, `venv/`, and IDE files.
- [ ] **Establish Secret Hygiene:**
  - Confirm `.env.example` template pattern; **zero** API keys or credentials committed to Git.

---

## 3. First End-to-End Milestone (T+02:00 to T+06:00)
- [ ] **First Schema Query:** Execute parameterized Cypher query creating sample nodes:
  - `(:Collection)-[:CREATED_LOAD]->(:Load)-[:HAS_HANDOVER]->(:Handover)`.
- [ ] **Verify In-Memory Traversal:** Execute `-[:NEXT*]->` query in FalkorDB and verify result parsing in Python.
- [ ] **Scaffold FastAPI Shell:** Initialize minimal `main.py` with `/api/health` responding `200 OK`.
- [ ] **Maintain Local Fallback:** Verify that the system can run locally without external cloud dependencies.

---

## 4. Daily Standup Check-in Schedule
- **Standup 1:** 15 Oct, 10:00 AM IST (Ingestion & Schema review)
- **Standup 2:** 16 Oct, 10:00 AM IST (Rule Engine & API review)
- **Standup 3:** 17 Oct, 10:00 AM IST (UI integration & Visualizer review)
- **Standup 4:** 18 Oct, 10:00 AM IST (Demo dry-run & Final freeze)
