import React from 'react'
import type { LanciumSite, LanciumTenant, Confidence } from '@/lib/types'
import { TENANT_STATUS_COLORS, STATUS_COLORS } from '@/lib/types'
import { formatDate, formatMW, formatNumber } from '@/lib/data'

interface SitePanelProps {
  site: LanciumSite
  tenants: LanciumTenant[]
  onClose: () => void
}

function ConfidenceBadge({ level }: { level: Confidence }) {
  const colors: Record<string, string> = { confirmed: '#22C55E', inferred: '#F59E0B', missing: '#6B7280' }
  const bg: Record<string, string> = { confirmed: 'rgba(34,197,94,0.15)', inferred: 'rgba(245,158,11,0.15)', missing: 'rgba(107,114,128,0.15)' }
  return (
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', padding: '2px 6px', borderRadius: '3px', color: colors[level], background: bg[level], border: `1px solid ${colors[level]}40`, whiteSpace: 'nowrap' as const }}>
      {level.toUpperCase()}
    </span>
  )
}

function DataRow({ label, value, confidence, unit = '' }: { label: string; value: string | number | null; confidence?: Confidence; unit?: string }) {
  const display = value === null || value === undefined ? '—' : `${value}${unit}`
  const isMissing = value === null || value === undefined
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1E2D50', gap: '8px' }}>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#6B7280', flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: isMissing ? '#374151' : '#E2E8F0', textAlign: 'right' }}>{display}</span>
        {confidence && <ConfidenceBadge level={confidence} />}
      </div>
    </div>
  )
}

function TimelineBar({ site }: { site: LanciumSite }) {
  const milestones = [
    { label: 'COUNTY', date: site.county_approval_date },
    { label: 'GROUNDBREAK', date: site.groundbreak_date },
    { label: 'TENANT', date: site.first_tenant_arrival_date },
    { label: 'LIVE', date: site.first_energization_date },
  ]
  const completed = milestones.filter(m => m.date).length
  const pct = (completed / milestones.length) * 100
  return (
    <div style={{ marginTop: '16px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', letterSpacing: '0.08em' }}>TIMELINE</span>
        {site.time_to_energize_days && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 700, color: '#E8FF47' }}>{site.time_to_energize_days}d</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280' }}>GROUNDBREAK→LIVE</span>
            <ConfidenceBadge level={site.time_to_energize_confidence} />
          </div>
        )}
      </div>
      <div style={{ position: 'relative', height: '4px', background: '#1E2D50', borderRadius: '2px', marginBottom: '12px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #E8FF47, #9AFF47)', borderRadius: '2px', transition: 'width 0.8s ease' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
        {milestones.map((m) => (
          <div key={m.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.date ? '#E8FF47' : '#1E2D50', boxShadow: m.date ? '0 0 6px #E8FF47' : 'none' }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '9px', color: m.date ? '#E8FF47' : '#4B5563', textAlign: 'center', letterSpacing: '0.05em' }}>{m.label}</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '9px', color: '#4B5563', textAlign: 'center' }}>{formatDate(m.date)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TenantCard({ tenant }: { tenant: LanciumTenant }) {
  const statusColor = TENANT_STATUS_COLORS[tenant.tenant_status]
  const isSpeculative = tenant.tenant_status === 'speculative'
  return (
    <div style={{ borderRadius: '4px', border: `1px solid ${isSpeculative ? '#1E2D50' : `${statusColor}40`}`, padding: '10px', marginBottom: '8px', background: isSpeculative ? 'rgba(30,45,80,0.2)' : `${statusColor}08`, opacity: isSpeculative ? 0.65 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 600, color: isSpeculative ? '#6B7280' : '#E2E8F0' }}>{tenant.tenant_name}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tenant.tenant_type.replace('_', ' ')}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', padding: '2px 8px', borderRadius: '999px', background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}>{tenant.tenant_status.toUpperCase()}</span>
          <ConfidenceBadge level={tenant.data_confidence} />
        </div>
      </div>
      {tenant.capacity_live_mw !== null && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#6B7280' }}>LIVE: <span style={{ color: '#E8FF47' }}>{formatMW(tenant.capacity_live_mw)}</span></span>
          {tenant.capacity_contracted_mw && <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#6B7280' }}>CONTRACT: <span style={{ color: '#60A5FA' }}>{formatMW(tenant.capacity_contracted_mw)}</span></span>}
        </div>
      )}
      {tenant.end_customer && <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>END USER: <span style={{ color: '#C084FC' }}>{tenant.end_customer}</span></div>}
      {tenant.gpu_type && <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>GPU: <span style={{ color: '#D1D5DB' }}>{tenant.gpu_type}</span>{tenant.gpu_count_estimated && <span style={{ color: '#6B7280' }}> ({formatNumber(tenant.gpu_count_estimated)} est.)</span>}</div>}
      {tenant.investment_usd_b && <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>INVEST: <span style={{ color: '#4ADE80' }}>${tenant.investment_usd_b}B</span></div>}
      {tenant.ip_cross_license && <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#E8FF47', marginTop: '4px' }}>⚡ SMART RESPONSE LICENSED</div>}
      {tenant.why_probable && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #1E2D50' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', marginBottom: '4px', letterSpacing: '0.08em' }}>WHY PROBABLE</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#9CA3AF', lineHeight: 1.5 }}>{tenant.why_probable.slice(0, 200)}{tenant.why_probable.length > 200 ? '…' : ''}</div>
        </div>
      )}
    </div>
  )
}

export default function SitePanel({ site, tenants, onClose }: SitePanelProps) {
  const statusColor = STATUS_COLORS[site.site_status]
  const HEADER_HEIGHT = 80

  return (
    <>
      {/* Desktop: right panel below header, max 420px wide */}
      <div className="hidden sm:flex" style={{
        position: 'absolute',
        top: HEADER_HEIGHT,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '420px',
        zIndex: 25,
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(13,21,38,0.98) 0%, rgba(10,15,30,0.98) 100%)',
        borderLeft: `1px solid ${statusColor}30`,
        backdropFilter: 'blur(20px)',
        animation: 'slideIn 0.3s ease forwards',
      }}>
        <PanelContent site={site} tenants={tenants} onClose={onClose} statusColor={statusColor} />
      </div>

      {/* Mobile: bottom drawer, 55% height, map always visible above */}
      <div className="flex sm:hidden" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '55vh',
        zIndex: 25,
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(13,21,38,0.99) 0%, rgba(10,15,30,1) 100%)',
        borderTop: `2px solid ${statusColor}60`,
        backdropFilter: 'blur(20px)',
        animation: 'slideUp 0.3s ease forwards',
      }}>
        <PanelContent site={site} tenants={tenants} onClose={onClose} statusColor={statusColor} />
      </div>
    </>
  )
}

function PanelContent({ site, tenants, onClose, statusColor }: { site: LanciumSite; tenants: LanciumTenant[]; onClose: () => void; statusColor: string }) {
  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #1E2D50', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: statusColor, letterSpacing: '0.1em' }}>{site.site_status.replace('_', ' ').toUpperCase()}</span>
            <ConfidenceBadge level={site.data_confidence} />
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 700, color: '#fff' }}>{site.site_name}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{site.location_city}, {site.location_county} County, TX</div>
        </div>
        <button onClick={onClose} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#6B7280', background: 'transparent', border: '1px solid #1E2D50', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer' }}>[×]</button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {/* ERCOT block */}
        <div style={{ marginBottom: '16px', borderRadius: '4px', border: '1px solid rgba(232,255,71,0.3)', padding: '12px', background: 'rgba(232,255,71,0.04)' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#E8FF47', letterSpacing: '0.1em', marginBottom: '8px' }}>⚡ ERCOT QUEUE — LANCIUM'S PRODUCT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: '#E8FF47', textShadow: '0 0 20px rgba(232,255,71,0.5)', lineHeight: 1 }}>{formatMW(site.ercot_interconnect_approved_mw)}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280' }}>APPROVED INTERCONNECT</div>
            </div>
            <div style={{ borderLeft: '1px solid #1E2D50', paddingLeft: '16px' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 600, color: site.ercot_approval_status === 'approved' ? '#22C55E' : site.ercot_approval_status === 'pending' ? '#F59E0B' : '#6B7280' }}>{site.ercot_approval_status.toUpperCase()}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280' }}>ERCOT STATUS</div>
            </div>
            {site.lancium_patent_clr && (
              <div style={{ borderLeft: '1px solid #1E2D50', paddingLeft: '16px' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 600, color: '#E8FF47' }}>CLR</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280' }}>SMART RESPONSE</div>
              </div>
            )}
          </div>
        </div>

        <TimelineBar site={site} />

        <div style={{ marginTop: '16px' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', letterSpacing: '0.08em', marginBottom: '4px' }}>CAPACITY</div>
          <DataRow label="PLANNED" value={formatMW(site.planned_capacity_mw)} confidence={site.data_confidence} />
          <DataRow label="OPERATIONAL" value={formatMW(site.operational_capacity_mw)} confidence={site.data_confidence} />
          <DataRow label="ERCOT APPROVED" value={formatMW(site.ercot_interconnect_approved_mw)} confidence="confirmed" />
          <DataRow label="ACREAGE" value={site.acreage} unit=" acres" />
        </div>

        <div style={{ marginTop: '14px' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', letterSpacing: '0.08em', marginBottom: '4px' }}>POWER</div>
          <DataRow label="GAS BRIDGE" value={formatMW(site.gas_turbine_bridge_mw)} confidence={site.gas_turbine_bridge_mw ? 'confirmed' : 'missing'} />
          <DataRow label="BESS BTM" value={site.behind_meter_bess_mw !== null ? `${site.behind_meter_bess_mw} MWh` : null} />
          <DataRow label="SOLAR BTM" value={formatMW(site.behind_meter_solar_mw)} />
          <DataRow label="PRIMARY TSP" value={site.primary_tsp} />
        </div>

        <div style={{ marginTop: '14px' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', letterSpacing: '0.08em', marginBottom: '4px' }}>ENVIRONMENTAL</div>
          <DataRow label="CARBON" value={site.carbon_intensity_gco2_per_kwh} unit=" gCO₂/kWh" confidence={site.carbon_intensity_gco2_per_kwh ? 'inferred' : 'missing'} />
          <DataRow label="PUE" value={site.water_usage_pue} confidence={site.water_usage_pue ? 'inferred' : 'missing'} />
        </div>

        {site.financing_amount_usd_m && (
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', letterSpacing: '0.08em', marginBottom: '4px' }}>FINANCING</div>
            <DataRow label="AMOUNT" value={`$${site.financing_amount_usd_m}M`} confidence="confirmed" />
            <DataRow label="BLACKSTONE" value={site.blackstone_financed ? 'YES' : 'NO'} />
          </div>
        )}

        <div style={{ marginTop: '16px' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', letterSpacing: '0.08em', marginBottom: '8px' }}>TENANT STACK ({tenants.length})</div>
          {tenants.length === 0
            ? <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#374151', border: '1px solid #1E2D50', borderRadius: '4px', padding: '10px' }}>NO TENANTS ANNOUNCED</div>
            : tenants.map(t => <TenantCard key={t.tenant_id} tenant={t} />)
          }
        </div>

        {site.notes && (
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #1E2D50' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', letterSpacing: '0.08em', marginBottom: '6px' }}>INTELLIGENCE NOTES</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#9CA3AF', lineHeight: 1.6 }}>{site.notes}</div>
          </div>
        )}
      </div>
    </>
  )
}
