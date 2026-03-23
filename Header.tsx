import sitesData from '../../data/lancium_sites.json'
import tenantsData from '../../data/lancium_tenants.json'
import type { LanciumSite, LanciumTenant } from './types'

// Flatten JSON structure to match flat interface
export function getSites(): LanciumSite[] {
  return sitesData.sites.map((s: any) => ({
    site_id: s.site_id,
    site_name: s.site_name,
    location_city: s.location?.city ?? null,
    location_county: s.location?.county ?? null,
    location_state: s.location?.state ?? null,
    lat: s.location?.lat ?? 0,
    lon: s.location?.lon ?? 0,
    acreage: s.acreage ?? null,
    planned_capacity_mw: s.capacity?.planned_mw ?? null,
    operational_capacity_mw: s.capacity?.operational_mw ?? null,
    ercot_interconnect_approved_mw: s.capacity?.ercot_interconnect_approved_mw ?? null,
    ercot_approval_status: s.capacity?.ercot_approval_status ?? 'unknown',
    site_status: s.site_status,
    county_approval_date: s.timeline?.county_approval_date ?? null,
    groundbreak_date: s.timeline?.groundbreak_date ?? null,
    first_tenant_arrival_date: s.timeline?.first_tenant_arrival_date ?? null,
    first_energization_date: s.timeline?.first_energization_date ?? null,
    time_to_energize_days: s.timeline?.time_to_energize_days ?? null,
    time_to_energize_confidence: s.timeline?.time_to_energize_confidence ?? 'missing',
    behind_meter_bess_mw: s.power_infrastructure?.behind_meter_bess_mw ?? null,
    behind_meter_solar_mw: s.power_infrastructure?.behind_meter_solar_mw ?? null,
    gas_turbine_bridge_mw: s.power_infrastructure?.gas_turbine_bridge_mw ?? null,
    primary_tsp: s.power_infrastructure?.primary_tsp ?? null,
    lancium_patent_clr: s.power_infrastructure?.lancium_patent_clr_active ?? false,
    blackstone_financed: s.financing?.blackstone_financed ?? false,
    financing_amount_usd_m: s.financing?.financing_amount_usd_m ?? null,
    carbon_intensity_gco2_per_kwh: s.environmental?.carbon_intensity_gco2_per_kwh ?? null,
    water_usage_pue: s.environmental?.water_usage_pue ?? null,
    data_confidence: s.data_confidence ?? 'missing',
    notes: s.notes ?? '',
  }))
}

export function getTenants(): LanciumTenant[] {
  return tenantsData.tenants.map((t: any) => ({
    tenant_id: t.tenant_id,
    site_id: t.site_id,
    tenant_name: t.tenant_name,
    tenant_type: t.tenant_type,
    tenant_status: t.tenant_status,
    capacity_contracted_mw: t.capacity?.contracted_mw ?? null,
    capacity_live_mw: t.capacity?.live_mw ?? null,
    construction_start_date: t.timeline?.construction_start_date ?? null,
    energization_date: t.timeline?.energization_date ?? null,
    contract_structure: t.contract_structure ?? null,
    end_customer: t.end_customer ?? null,
    gpu_type: t.compute?.gpu_type ?? null,
    gpu_count_estimated: t.compute?.gpu_count_estimated ?? null,
    jv_partners: Array.isArray(t.financials?.jv_partners)
      ? t.financials.jv_partners.join(', ')
      : null,
    investment_usd_b: t.financials?.investment_usd_b ?? null,
    why_probable: t.why_probable ?? null,
    ip_cross_license: t.ip_cross_license ?? false,
    data_confidence: t.data_confidence ?? 'missing',
    notes: t.notes ?? '',
  }))
}

export function getTenantsForSite(siteId: string): LanciumTenant[] {
  return getTenants().filter(t => t.site_id === siteId)
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function formatMW(mw: number | null): string {
  if (mw === null) return '—'
  if (mw >= 1000) return `${(mw / 1000).toFixed(1)} GW`
  return `${mw} MW`
}

export function formatNumber(n: number | null, suffix = ''): string {
  if (n === null) return '—'
  return `${n.toLocaleString()}${suffix}`
}
