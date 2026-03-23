# ⚡ TIME-TO-ENERGIZE
### Lancium Clean Campus Intelligence Platform
**by [dexdogs.earth]**(https://dexdogs.earth/))**

> Track every Lancium Clean Campus site across West Texas — ERCOT queue positions, tenant pipelines, time-to-energize metrics, and the speculative hyperscaler landscape.

---

## What This Is

A research dataset + interactive Mapbox visualization tracking the **Lancium Clean Campus model** — the pre-permitted, pre-interconnected land and power platform that enabled Stargate 1 (Oracle/OpenAI/Crusoe) to go from groundbreak to live GPUs in 12 months instead of 5 years.

**Key insight:** Lancium's ERCOT queue position is their product. The time between Lancium groundbreak and first tenant energization — **Time-To-Energize** — is the moat.

---

## Sites Tracked

| ID | Site | Status | MW Planned | ERCOT MW | Time-To-Energize |
|---|---|---|---|---|---|
| LNC-001 | Fort Stockton | ✅ Operational | 325 MW | 325 MW approved | — |
| LNC-002 | Abilene (Stargate 1) | ✅ Operational | 1,200 MW | 1,200 MW approved | **1,061 days** |
| LNC-003 | Childress | 🔵 In Development | 2,000 MW | 1,000 MW pending | Forecast: mid-2028 |
| LNC-004 | Undisclosed Site A | ⚫ Unknown | — | — | Missing |
| LNC-005 | Undisclosed Site B | ⚫ Unknown | — | — | Missing |

---

## Dataset

Two canonical tables in `/data/`:

- `lancium_sites.csv` / `lancium_sites.json` — all sites, capacity, ERCOT queue, timeline, environmental
- `lancium_tenants.csv` / `lancium_tenants.json` — all tenants: active, probable, speculative

Confidence levels on every field: `confirmed` / `inferred` / `missing`

Dataset version: **v1.1** (updated March 2026)
- Abilene expansion cancellation noted
- NVIDIA $150M deposit / Meta lease talks added (TNT-011)
- BESS unit corrected MW→MWh
- Acreage updated 800→1000 acres

---

## Sources

- Lancium press releases and newsroom
- ERCOT Large Load Integration documentation
- ERCOT–Lancium Patent License Agreement (April 2025)
- GE Vernova LM2500XPRESS Crusoe case study
- DCD — Oracle/OpenAI expansion cancellation (March 2026)
- DCD — NVIDIA $150M deposit / Meta lease talks (March 2026)
- Childress County tax abatement approval (April 2025)
- SemiAnalysis Datacenter Industry Model

---

*Built by dexdogs — carbon market and industrial emissions data infrastructure.*
