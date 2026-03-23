import React from 'react'
import type { LanciumSite, LanciumTenant, Confidence } from '@/lib/types'
import { CONFIDENCE_COLORS, TENANT_STATUS_COLORS, STATUS_COLORS } from '@/lib/types'
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
    <span className="font-sans text-xs px-1.5 py-0.5 rounded" style={{ color: colors[level], background: bg[level], border: `1px solid ${colors[level]}40` }}>
      {level.toUpperCase()}
    </span>
  )
}

function DataRow({ label, value, confidence, unit = '' }: { label: string; value: string | number | null; confidence?: Confidence; unit?: string }) {
  const display = value === null || value === undefined ? '—' : `${value}${unit}`
  const isMissing = value === null || value === undefined
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-800 gap-4">
      <span className="font-sans text-xs text-gray-500 shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-sans text-xs text-right ${isMissing ? 'text-gray-600' : 'text-gray-200'}`}>{display}</span>
        {confidence && <ConfidenceBadge level={confidence} />}
      </div>
    </div>
  )
}

function TimelineBar({ site }: { site: LanciumSite }) {
  const milestones = [
    { label: 'COUNTY APPROVAL', date: site.county_approval_date },
    { label: 'GROUNDBREAK', date: site.groundbreak_date },
    { label: 'TENANT ARRIVES', date: site.first_tenant_arrival_date },
    { label: 'ENERGIZATION', date: site.first_energization_date },
  ]
  const completed = milestones.filter(m => m.date).length
  const pct = (completed / milestones.length) * 100
  return (
    <div className="mt-4 mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-xs text-gray-500 tracking-wider">DEVELOPMENT TIMELINE</span>
        {site.time_to_energize_days && (
          <div className="flex items-center gap-1">
            <span className="font-sans text-xs font-bold" style={{ color: '#E8FF47' }}>{site.time_to_energize_days}d</span>
            <span className="font-sans text-xs text-gray-500">GROUNDBREAK→LIVE</span>
            <ConfidenceBadge level={site.time_to_energize_confidence} />
          </div>
        )}
      </div>
      <div className="relative h-1 bg-gray-800 rounded mb-4">
        <div className="absolute top-0 left-0 h-full rounded transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #E8FF47, #9AFF47)' }} />
      </div>
      <div className="grid grid-cols-4 gap-1">
        {milestones.map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: m.date ? '#E8FF47' : '#1E2D50', boxShadow: m.date ? '0 0 6px #E8FF47' : 'none' }} />
            <span className="font-sans text-center leading-tight" style={{ color: m.date ? '#E8FF47' : '#4B5563', fontSize: '9px' }}>{m.label}</span>
            <span className="font-sans text-center leading-tight text-gray-500" style={{ fontSize: '9px' }}>{formatDate(m.date)}</span>
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
    <div className="rounded border p-3 mb-2" style={{ borderColor: isSpeculative ? '#1E2D50' : `${statusColor}40`, background: isSpeculative ? 'rgba(30,45,80,0.2)' : `${statusColor}08`, opacity: isSpeculative ? 0.6 : 1 }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-sans text-sm font-bold" style={{ color: isSpeculative ? '#6B7280' : '#E2E8F0' }}>{tenant.tenant_name}</div>
          <div className="font-sans text-xs text-gray-500 uppercase tracking-wider">{tenant.tenant_type.replace('_', ' ')}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}>{tenant.tenant_status.toUpperCase()}</span>
          <ConfidenceBadge level={tenant.data_confidence} />
        </div>
      </div>
      {tenant.capacity_live_mw !== null && (
        <div className="flex items-center gap-3 mb-2">
          <div className="text-xs font-sans text-gray-500">LIVE: <span style={{ color: '#E8FF47' }}>{formatMW(tenant.capacity_live_mw)}</span></div>
          {tenant.capacity_contracted_mw && <div className="text-xs font-sans text-gray-500">CONTRACT: <span className="text-blue-400">{formatMW(tenant.capacity_contracted_mw)}</span></div>}
        </div>
      )}
      {tenant.end_customer && <div className="text-xs font-sans text-gray-400 mb-1">END USER: <span className="text-purple-400">{tenant.end_customer}</span></div>}
      {tenant.gpu_type && <div className="text-xs font-sans text-gray-500 mb-1">GPU: <span className="text-gray-300">{tenant.gpu_type}</span>{tenant.gpu_count_estimated && <span className="text-gray-500 ml-1">({formatNumber(tenant.gpu_count_estimated)} est.)</span>}</div>}
      {tenant.investment_usd_b && <div className="text-xs font-sans text-gray-500 mb-1">INVEST: <span className="text-green-400">${tenant.investment_usd_b}B</span></div>}
      {tenant.ip_cross_license && <div className="text-xs font-sans mt-1" style={{ color: '#E8FF47' }}>⚡ LANCIUM SMART RESPONSE LICENSED</div>}
      {tenant.why_probable && (
        <div className="mt-2 pt-2 border-t border-gray-800">
          <div className="font-sans text-xs text-gray-500 mb-1">WHY PROBABLE</div>
          <div className="font-sans text-xs text-gray-400 leading-relaxed">{tenant.why_probable.slice(0, 200)}{tenant.why_probable.length > 200 ? '…' : ''}</div>
        </div>
      )}
    </div>
  )
}

export default function SitePanel({ site, tenants, onClose }: SitePanelProps) {
  const statusColor = STATUS_COLORS[site.site_status]
  return (
    <div className="absolute top-0 right-0 h-full w-full z-30 flex flex-col" style2="max-width: min(420px, 100vw)" style={{ background: 'linear-gradient(135deg, rgba(13,21,38,0.98) 0%, rgba(10,15,30,0.98) 100%)', borderLeft: `1px solid ${statusColor}30`, backdropFilter: 'blur(20px)', animation: 'slideIn 0.3s ease forwards', maxWidth: 'min(420px, 100vw)', width: '100%' }}>
      <div className="flex items-start justify-between p-5 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
            <span className="font-sans text-xs tracking-widest" style={{ color: statusColor }}>{site.site_status.replace('_', ' ').toUpperCase()}</span>
            <ConfidenceBadge level={site.data_confidence} />
          </div>
          <h2 className="font-sans text-base font-bold text-white">{site.site_name}</h2>
          <div className="font-sans text-xs text-gray-500 mt-0.5">{site.location_city}, {site.location_county} County, TX</div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-yellow-300 transition-colors font-sans text-xs border border-gray-700 rounded px-2 py-1">[ESC]</button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-5 rounded border p-3" style={{ borderColor: 'rgba(232,255,71,0.3)', background: 'rgba(232,255,71,0.04)' }}>
          <div className="font-sans text-xs tracking-wider mb-2" style={{ color: '#E8FF47' }}>⚡ ERCOT QUEUE POSITION — LANCIUM'S PRODUCT</div>
          <div className="flex items-center gap-3">
            <div>
              <div className="font-sans text-2xl font-bold" style={{ color: '#E8FF47', textShadow: '0 0 20px rgba(232,255,71,0.5)' }}>{formatMW(site.ercot_interconnect_approved_mw)}</div>
              <div className="font-sans text-xs text-gray-500">APPROVED INTERCONNECT</div>
            </div>
            <div className="border-l border-gray-700 pl-3">
              <div className="font-sans text-sm font-bold" style={{ color: site.ercot_approval_status === 'approved' ? '#22C55E' : site.ercot_approval_status === 'pending' ? '#F59E0B' : '#6B7280' }}>{site.ercot_approval_status.toUpperCase()}</div>
              <div className="font-sans text-xs text-gray-500">ERCOT STATUS</div>
            </div>
            {site.lancium_patent_clr && <div className="border-l border-gray-700 pl-3"><div className="font-sans text-sm font-bold" style={{ color: '#E8FF47' }}>CLR</div><div className="font-sans text-xs text-gray-500">SMART RESPONSE</div></div>}
          </div>
        </div>
        <TimelineBar site={site} />
        <div className="mt-5 mb-3">
          <div className="font-sans text-xs text-gray-500 tracking-wider mb-2">CAPACITY</div>
          <DataRow label="PLANNED" value={formatMW(site.planned_capacity_mw)} confidence={site.data_confidence} />
          <DataRow label="OPERATIONAL" value={formatMW(site.operational_capacity_mw)} confidence={site.data_confidence} />
          <DataRow label="ERCOT APPROVED" value={formatMW(site.ercot_interconnect_approved_mw)} confidence="confirmed" />
          <DataRow label="ACREAGE" value={site.acreage} unit=" acres" />
        </div>
        <div className="mt-4 mb-3">
          <div className="font-sans text-xs text-gray-500 tracking-wider mb-2">POWER INFRASTRUCTURE</div>
          <DataRow label="GAS BRIDGE" value={formatMW(site.gas_turbine_bridge_mw)} confidence={site.gas_turbine_bridge_mw ? 'confirmed' : 'missing'} />
          <DataRow label="BESS BTM" value={site.behind_meter_bess_mw !== null ? `${site.behind_meter_bess_mw} MWh` : null} />
          <DataRow label="SOLAR BTM" value={formatMW(site.behind_meter_solar_mw)} />
          <DataRow label="PRIMARY TSP" value={site.primary_tsp} />
        </div>
        <div className="mt-4 mb-3">
          <div className="font-sans text-xs text-gray-500 tracking-wider mb-2">ENVIRONMENTAL</div>
          <DataRow label="CARBON INTENSITY" value={site.carbon_intensity_gco2_per_kwh} unit=" gCO₂/kWh" confidence={site.carbon_intensity_gco2_per_kwh ? 'inferred' : 'missing'} />
          <DataRow label="WATER PUE" value={site.water_usage_pue} confidence={site.water_usage_pue ? 'inferred' : 'missing'} />
        </div>
        {site.financing_amount_usd_m && (
          <div className="mt-4 mb-3">
            <div className="font-sans text-xs text-gray-500 tracking-wider mb-2">FINANCING</div>
            <DataRow label="AMOUNT" value={`$${site.financing_amount_usd_m}M`} confidence="confirmed" />
            <DataRow label="BLACKSTONE" value={site.blackstone_financed ? 'YES' : 'NO'} />
          </div>
        )}
        <div className="mt-5">
          <div className="font-sans text-xs text-gray-500 tracking-wider mb-3">TENANT STACK ({tenants.length})</div>
          {tenants.length === 0
            ? <div className="font-sans text-xs text-gray-600 border border-gray-800 rounded p-3">NO TENANTS ANNOUNCED</div>
            : tenants.map(t => <TenantCard key={t.tenant_id} tenant={t} />)
          }
        </div>
        {site.notes && (
          <div className="mt-5 pt-4 border-t border-gray-800">
            <div className="font-sans text-xs text-gray-500 tracking-wider mb-2">INTELLIGENCE NOTES</div>
            <div className="font-sans text-xs text-gray-400 leading-relaxed">{site.notes}</div>
          </div>
        )}
      </div>
    </div>
  )
}
