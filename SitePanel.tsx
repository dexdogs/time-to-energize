export type Confidence = 'confirmed' | 'inferred' | 'missing'
export type SiteStatus = 'operational' | 'in_development' | 'announced' | 'unknown'
export type TenantStatus = 'active' | 'announced' | 'probable' | 'speculative'
export type TenantType = 'builder' | 'cloud_operator' | 'end_user'
export type ERCOTApprovalStatus = 'approved' | 'pending' | 'unknown'

export interface LanciumSite {
  site_id: string
  site_name: string
  location_city: string
  location_county: string
  location_state: string
  lat: number
  lon: number
  acreage: number | null
  planned_capacity_mw: number | null
  operational_capacity_mw: number | null
  ercot_interconnect_approved_mw: number | null
  ercot_approval_status: ERCOTApprovalStatus
  site_status: SiteStatus
  county_approval_date: string | null
  groundbreak_date: string | null
  first_tenant_arrival_date: string | null
  first_energization_date: string | null
  time_to_energize_days: number | null
  time_to_energize_confidence: Confidence
  behind_meter_bess_mw: number | null
  behind_meter_solar_mw: number | null
  gas_turbine_bridge_mw: number | null
  primary_tsp: string | null
  lancium_patent_clr: boolean
  blackstone_financed: boolean
  financing_amount_usd_m: number | null
  carbon_intensity_gco2_per_kwh: number | null
  water_usage_pue: number | null
  data_confidence: Confidence
  notes: string
}

export interface LanciumTenant {
  tenant_id: string
  site_id: string
  tenant_name: string
  tenant_type: TenantType
  tenant_status: TenantStatus
  capacity_contracted_mw: number | null
  capacity_live_mw: number | null
  construction_start_date: string | null
  energization_date: string | null
  contract_structure: string | null
  end_customer: string | null
  gpu_type: string | null
  gpu_count_estimated: number | null
  jv_partners: string | null
  investment_usd_b: number | null
  why_probable: string | null
  ip_cross_license: boolean
  data_confidence: Confidence
  notes: string
}

export const STATUS_COLORS: Record<SiteStatus, string> = {
  operational: '#E8FF47',
  in_development: '#3B82F6',
  announced: '#A855F7',
  unknown: '#4B5563',
}

export const TENANT_STATUS_COLORS: Record<TenantStatus, string> = {
  active: '#22C55E',
  announced: '#A855F7',
  probable: '#06B6D4',
  speculative: '#4B5563',
}

export const CONFIDENCE_COLORS: Record<Confidence, string> = {
  confirmed: '#22C55E',
  inferred: '#F59E0B',
  missing: '#6B7280',
}
