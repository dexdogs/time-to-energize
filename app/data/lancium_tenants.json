{
  "schema_version": "1.1",
  "generated": "2026-03-22",
  "last_reviewed": "2026-03-22",
  "review_notes": "v1.1 corrections: (1) Added tenant_role field to distinguish layers of same deal stack. (2) TNT-002 (Oracle) and TNT-003 (OpenAI) capacity_contracted_mw set to null - they are deal layers not independent capacity commitments; MW belongs to TNT-001 (Crusoe) only. (3) Oracle $30B figure removed - conflated OpenAI broader projections with site-specific commitment. (4) TNT-001 GPU count revised from 400000 to 200000 for current 2-building operational state. (5) Added TNT-011: Meta/NVIDIA probable at Abilene on remaining capacity post-expansion-cancellation. (6) TNT-007 (Meta at Childress) note updated given Meta now probable at Abilene first.",
  "description": "Lancium Clean Campus tenants dataset. tenant_status: active=operating, announced=publicly confirmed, probable=strong evidence unconfirmed, speculative=logical candidate no public evidence. tenant_role distinguishes layers within the same deal stack.",
  "tenants": [
    {
      "tenant_id": "TNT-001",
      "site_id": "LNC-002",
      "tenant_name": "Crusoe",
      "tenant_role": "builder_operator",
      "tenant_type": "builder",
      "tenant_status": "active",
      "capacity": {
        "contracted_mw": 1200,
        "live_mw": 400,
        "live_mw_note": "2 buildings live Sept 2025. 400MW = facility power; IT load ~200MW+ per Crusoe. Full 1.2GW at 8 buildings target mid-2026.",
        "live_mw_confidence": "confirmed"
      },
      "timeline": {
        "construction_start_date": "2024-06-01",
        "energization_date": "2025-09-30"
      },
      "contract_structure": "Crusoe leases ~90 acres from Lancium. Crusoe owns and operates data center buildings. Lancium owns land and electrical infrastructure.",
      "end_customer": "Oracle (direct); OpenAI (Oracle's customer)",
      "compute": {
        "gpu_type": "NVIDIA GB200 NVL72",
        "gpu_count_estimated": 200000,
        "gpu_count_confidence": "inferred",
        "gpu_count_note": "CORRECTION v1.1: Revised from 400000 to 200000 for current operational state (2 live buildings x ~100000 per building per early Crusoe specs). 400000 was full 8-building buildout upper bound. Crusoe stated 'hundreds of thousands of GPUs on single network fabric' for full campus."
      },
      "financials": {
        "jv_partners": ["Blue Owl Capital", "Primary Digital Infrastructure"],
        "investment_usd_b": 15.0,
        "investment_confidence": "confirmed",
        "investment_note": "$3.4B initial JV (Oct 2024) expanded to $11.6B (May 2025). Total Crusoe footprint including Wyoming ~$15B."
      },
      "ip_cross_license": true,
      "ip_note": "Lancium Smart Response cross-license signed Oct 2022. Predates Abilene construction by 20 months.",
      "data_confidence": "confirmed",
      "notes": "Crusoe is builder/operator - the only party holding the land lease from Lancium. MW figures in this record are the authoritative capacity numbers for Abilene. Oracle and OpenAI (TNT-002, TNT-003) are layers above Crusoe, not independent capacity holders. 29 GE Vernova LM2500XPRESS turbines for bridge power (source: gevernova.com case study). NOTE Mar 2026: Oracle/OpenAI expansion beyond 1.2GW cancelled; NVIDIA $150M deposit placed; Meta in lease talks for remaining capacity - see TNT-011."
    },
    {
      "tenant_id": "TNT-002",
      "site_id": "LNC-002",
      "tenant_name": "Oracle",
      "tenant_role": "cloud_platform",
      "tenant_type": "cloud_operator",
      "tenant_status": "active",
      "capacity": {
        "contracted_mw": null,
        "contracted_mw_note": "CORRECTION v1.1: Set to null. Oracle does not hold an independent 1200MW capacity contract with Lancium. Oracle leases from Crusoe and provides the OCI platform layer. Capacity MW belongs to TNT-001 (Crusoe) only. Previous value of 1200MW was triple-counting the same physical capacity.",
        "live_mw": 400,
        "live_mw_confidence": "confirmed"
      },
      "timeline": {
        "construction_start_date": "2025-06-01",
        "energization_date": "2025-09-30",
        "note": "Oracle began racking GB200 units June 2025."
      },
      "contract_structure": "Oracle leases compute capacity from Crusoe. Oracle provides OCI (Oracle Cloud Infrastructure) platform.",
      "end_customer": "OpenAI",
      "compute": {
        "gpu_type": "NVIDIA GB200 NVL72",
        "gpu_count_estimated": null,
        "gpu_count_confidence": "missing",
        "gpu_count_note": "Same physical GPUs as TNT-001. Not a separate count."
      },
      "financials": {
        "jv_partners": ["SoftBank", "OpenAI", "MGX"],
        "investment_usd_b": null,
        "investment_confidence": "missing",
        "investment_note": "CORRECTION v1.1: Previous $30B figure removed. That figure conflated OpenAI's broader compute spending projections with a specific Oracle site commitment. No verified single-site Oracle investment figure available for Abilene specifically. Oracle invested in Lancium $600M financing round (Oct 2025) - that is a Lancium investment, not an Abilene site figure."
      },
      "ip_cross_license": false,
      "data_confidence": "confirmed",
      "notes": "Oracle is Crusoe's direct customer per CEO statements. Oracle-OpenAI placed largest-ever onsite gas generation order (2.3GW) in Oct 2025 for further Texas expansion beyond Abilene. NOTE Mar 2026: Oracle/OpenAI expansion beyond 1.2GW at Abilene cancelled per DCD."
    },
    {
      "tenant_id": "TNT-003",
      "site_id": "LNC-002",
      "tenant_name": "OpenAI",
      "tenant_role": "compute_consumer",
      "tenant_type": "end_user",
      "tenant_status": "active",
      "capacity": {
        "contracted_mw": null,
        "contracted_mw_note": "CORRECTION v1.1: Set to null. OpenAI does not hold an independent 1200MW contract. OpenAI consumes compute via Oracle OCI under Stargate. Capacity MW belongs to TNT-001 (Crusoe) only.",
        "live_mw": 400,
        "live_mw_confidence": "confirmed"
      },
      "timeline": {
        "energization_date": "2025-09-30"
      },
      "contract_structure": "OpenAI consumes compute via Oracle OCI under Stargate program. Abilene is Stargate 1.",
      "end_customer": "OpenAI (self)",
      "compute": {
        "gpu_type": "NVIDIA GB200 NVL72",
        "gpu_count_estimated": null,
        "gpu_count_confidence": "missing",
        "gpu_count_note": "Same physical GPUs as TNT-001."
      },
      "financials": {
        "jv_partners": ["SoftBank", "Oracle", "MGX"],
        "investment_usd_b": 500.0,
        "investment_confidence": "confirmed",
        "investment_note": "$500B Stargate commitment is a 4-year multi-site program across multiple locations. Not a single-site Abilene figure. Abilene is Stargate 1 flagship site."
      },
      "ip_cross_license": false,
      "data_confidence": "confirmed",
      "notes": "OpenAI running training and inference at Abilene from Sept 2025. OpenAI also invested in Lancium $600M financing round (Oct 2025). NOTE Mar 2026: OpenAI expansion beyond 1.2GW at Abilene cancelled. OpenAI preference to deploy next-gen Vera Rubin chips at new locations."
    },
    {
      "tenant_id": "TNT-004",
      "site_id": "LNC-001",
      "tenant_name": "Bitcoin Miners (unnamed)",
      "tenant_role": "compute_consumer",
      "tenant_type": "end_user",
      "tenant_status": "active",
      "capacity": {
        "contracted_mw": 25,
        "live_mw": 25,
        "live_mw_confidence": "confirmed"
      },
      "timeline": {
        "construction_start_date": "2022-01-01",
        "energization_date": "2022-03-01"
      },
      "contract_structure": "Direct lease from Lancium. Lancium Smart Response enables CLR participation.",
      "end_customer": null,
      "compute": {
        "gpu_type": "ASIC Bitcoin miners",
        "gpu_count_estimated": null,
        "gpu_count_confidence": "missing"
      },
      "financials": {
        "jv_partners": [],
        "investment_usd_b": null,
        "investment_confidence": "missing"
      },
      "ip_cross_license": true,
      "data_confidence": "inferred",
      "notes": "Miner identity not publicly disclosed. Fort Stockton CLR proof-of-concept. Miners ramp load up/down on ERCOT grid signals. Also used for HPC workloads."
    },
    {
      "tenant_id": "TNT-005",
      "site_id": "LNC-003",
      "tenant_name": "Unknown Hyperscaler",
      "tenant_role": "tbd",
      "tenant_type": "cloud_operator",
      "tenant_status": "probable",
      "capacity": {
        "contracted_mw": 1000,
        "live_mw": 0
      },
      "timeline": {
        "construction_start_date": null,
        "energization_date": null,
        "forecast": {
          "tenant_announcement": "2026-Q4 to 2027-Q1",
          "construction_start": "2027-Q1",
          "energization": "2028-Q2 to 2028-Q3"
        }
      },
      "contract_structure": "To be determined. Expected to follow Abilene model.",
      "end_customer": null,
      "compute": {
        "gpu_type": "Unknown - likely next-gen NVIDIA (post-GB200)",
        "gpu_count_estimated": null
      },
      "financials": {
        "investment_usd_b": 4.0,
        "investment_confidence": "inferred",
        "investment_note": "Lancium stated $4B per site at Childress."
      },
      "ip_cross_license": false,
      "why_probable": "Childress follows exact Abilene playbook: county approval + tax abatements April 2025. Lancium min requirement now 1GW. Field = Oracle, Google, Meta, Microsoft, Amazon. No announcement as of March 2026. Note: Meta now probable at Abilene (TNT-011) which may delay or accelerate Childress depending on appetite for a second West Texas site.",
      "data_confidence": "inferred",
      "notes": "PROBABLE. Identity unknown. All timeline fields missing. Forecast based on Abilene lag pattern."
    },
    {
      "tenant_id": "TNT-006",
      "site_id": "LNC-003",
      "tenant_name": "Google",
      "tenant_role": "tbd",
      "tenant_type": "cloud_operator",
      "tenant_status": "speculative",
      "capacity": {
        "contracted_mw": null,
        "live_mw": 0
      },
      "timeline": null,
      "contract_structure": "Speculative. No announcement.",
      "end_customer": "Google Cloud",
      "compute": null,
      "financials": {
        "investment_usd_b": null,
        "investment_confidence": "missing"
      },
      "ip_cross_license": false,
      "why_probable": "Google in active discussions with Crusoe per SemiAnalysis. 15GW+ pipeline. West Texas ERCOT renewable mix aligns with Google grid-interactive strategy. No direct Lancium-Google tie confirmed.",
      "data_confidence": "inferred",
      "notes": "SPECULATIVE. Color: gray."
    },
    {
      "tenant_id": "TNT-007",
      "site_id": "LNC-003",
      "tenant_name": "Meta",
      "tenant_role": "tbd",
      "tenant_type": "cloud_operator",
      "tenant_status": "speculative",
      "capacity": {
        "contracted_mw": null,
        "live_mw": 0
      },
      "timeline": null,
      "contract_structure": "Speculative at Childress. See TNT-011 for Meta probable at Abilene.",
      "end_customer": "Meta AI",
      "compute": null,
      "financials": {
        "investment_usd_b": null,
        "investment_confidence": "missing"
      },
      "ip_cross_license": false,
      "why_probable": "SPECULATIVE at Childress specifically. Meta is now PROBABLE at Abilene (TNT-011) taking remaining capacity after Oracle/OpenAI expansion cancellation. If Meta takes Abilene remaining capacity, Childress appetite depends on whether Meta wants a second West Texas Lancium site. Meta signed 10GW+ clean energy in 2025; Louisiana Hyperion project uses same BTM gas turbine bridge model.",
      "data_confidence": "inferred",
      "notes": "SPECULATIVE at Childress. Color: gray. Higher-probability Meta story is TNT-011 at Abilene."
    },
    {
      "tenant_id": "TNT-008",
      "site_id": "LNC-003",
      "tenant_name": "Microsoft",
      "tenant_role": "tbd",
      "tenant_type": "cloud_operator",
      "tenant_status": "speculative",
      "capacity": {
        "contracted_mw": null,
        "live_mw": 0
      },
      "timeline": null,
      "contract_structure": "Speculative. No announcement.",
      "end_customer": "Azure / OpenAI",
      "compute": null,
      "financials": {
        "investment_usd_b": null,
        "investment_confidence": "missing"
      },
      "ip_cross_license": false,
      "why_probable": "Microsoft Texas presence and Stargate adjacency make them a Childress watch candidate. Lower probability given Microsoft-CoreWeave relationship. No announcement.",
      "data_confidence": "inferred",
      "notes": "SPECULATIVE. Color: gray."
    },
    {
      "tenant_id": "TNT-009",
      "site_id": "LNC-004",
      "tenant_name": "Unknown",
      "tenant_role": "tbd",
      "tenant_type": "cloud_operator",
      "tenant_status": "speculative",
      "capacity": {
        "contracted_mw": null,
        "live_mw": 0
      },
      "timeline": null,
      "contract_structure": "Unknown.",
      "end_customer": null,
      "compute": null,
      "financials": {
        "investment_usd_b": null,
        "investment_confidence": "missing"
      },
      "ip_cross_license": false,
      "why_probable": "Site existence inferred from Lancium 5-site 6.1GW investor materials.",
      "data_confidence": "missing",
      "notes": "SPECULATIVE. All data missing."
    },
    {
      "tenant_id": "TNT-010",
      "site_id": "LNC-005",
      "tenant_name": "Unknown",
      "tenant_role": "tbd",
      "tenant_type": "cloud_operator",
      "tenant_status": "speculative",
      "capacity": {
        "contracted_mw": null,
        "live_mw": 0
      },
      "timeline": null,
      "contract_structure": "Unknown.",
      "end_customer": null,
      "compute": null,
      "financials": {
        "investment_usd_b": null,
        "investment_confidence": "missing"
      },
      "ip_cross_license": false,
      "why_probable": "Site existence inferred from Lancium 5-site 6.1GW investor materials.",
      "data_confidence": "missing",
      "notes": "SPECULATIVE. All data missing."
    },
    {
      "tenant_id": "TNT-011",
      "site_id": "LNC-002",
      "tenant_name": "Meta / NVIDIA (via Crusoe)",
      "tenant_role": "prospective_tenant",
      "tenant_type": "cloud_operator",
      "tenant_status": "probable",
      "capacity": {
        "contracted_mw": null,
        "contracted_mw_note": "Unknown. Depends on how much of the 1.2GW Oracle/OpenAI are vacating vs. retaining for existing workloads.",
        "live_mw": 0
      },
      "timeline": {
        "construction_start_date": null,
        "energization_date": null,
        "note": "Timeline unknown. NVIDIA deposit placed March 2026. Lease negotiations ongoing."
      },
      "contract_structure": "NVIDIA acting as intermediary. NVIDIA placed $150M deposit with Crusoe to secure remaining Abilene capacity. NVIDIA in active talks with Meta to take the lease.",
      "end_customer": "Meta AI",
      "compute": {
        "gpu_type": null,
        "gpu_count_estimated": null,
        "gpu_count_note": "Unknown. Likely next-gen NVIDIA architecture (Vera Rubin or successor) given OpenAI's stated preference to deploy Vera Rubin at new sites."
      },
      "financials": {
        "jv_partners": [],
        "investment_usd_b": 0.15,
        "investment_confidence": "confirmed",
        "investment_note": "$150M = NVIDIA deposit only. Not full Meta investment commitment. Full commitment figure unknown and not yet negotiated."
      },
      "ip_cross_license": false,
      "why_probable": "NEW RECORD Mar 2026. Strongest near-term tenant signal in the entire dataset. NVIDIA paid $150M deposit to Crusoe to secure remaining Abilene capacity after Oracle/OpenAI expansion cancellation. NVIDIA in active talks with Meta for the lease. Source: DCD reporting March 2026. Higher probability than any Childress speculative entry because: (1) physical infrastructure already built, (2) ERCOT interconnect already approved, (3) $150M deposit already placed, (4) Meta already using BTM gas turbine bridge model at Louisiana Hyperion project.",
      "data_confidence": "inferred",
      "notes": "NEW RECORD added v1.1. This is a post-Oracle/OpenAI expansion cancellation development. The 1.2GW Abilene campus is not going dark - NVIDIA is actively working to fill remaining capacity with Meta. This changes the Abilene tenant picture materially from the original Crusoe→Oracle→OpenAI-only story. Source: Data Center Dynamics, March 2026."
    }
  ]
}
