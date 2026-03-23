# ⚡ TIME-TO-ENERGIZE
### Lancium Clean Campus Intelligence Platform
**by [dexdogs](https://github.com/dexdogs)**

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

## App

Next.js + Mapbox GL JS + Tailwind. Dark industrial UI.

- Sites sized by planned MW
- ERCOT ring overlay = approved interconnect MW
- Click any site → side panel with full data, timeline, tenant stack
- Confidence badges on every field
- Stats bar: total GW, capital committed, time-to-energize, CLR patent

---

## Setup
```bash
cd app
cp .env.example .env.local
# Add your Mapbox token to .env.local
npm install
npm run dev
```

Get a free Mapbox token at [account.mapbox.com](https://account.mapbox.com/access-tokens/)

## Deploy
```bash
cd app
npx vercel --prod
# Set NEXT_PUBLIC_MAPBOX_TOKEN in Vercel dashboard > Settings > Environment Variables
```

---

## Repo Structure
```
time-to-energize/
├── .devcontainer/devcontainer.json
├── data/                        # Source of truth
│   ├── lancium_sites.csv
│   ├── lancium_sites.json
│   ├── lancium_tenants.csv
│   └── lancium_tenants.json
├── app/                         # Next.js app
│   ├── data/                    # Mirror of /data for imports
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── styles/
│   ├── .env.example
│   └── package.json
└── README.md
```

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
