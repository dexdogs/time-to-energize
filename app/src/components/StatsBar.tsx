import React from 'react'
import type { LanciumSite, LanciumTenant } from '@/lib/types'

interface StatsBarProps {
  sites: LanciumSite[]
  tenants: LanciumTenant[]
}

export default function StatsBar({ sites, tenants }: StatsBarProps) {
  const totalPlanned = sites.reduce((s, x) => s + (x.planned_capacity_mw || 0), 0)
  const totalOperational = sites.reduce((s, x) => s + (x.operational_capacity_mw || 0), 0)
  const totalERCOT = sites.reduce((s, x) => s + (x.ercot_interconnect_approved_mw || 0), 0)
  const totalInvestment = tenants.reduce((s, t) => s + (t.investment_usd_b || 0), 0)
  const activeTenants = tenants.filter(t => t.tenant_status === 'active').length
  const abilene = sites.find(s => s.site_id === 'LNC-002')

  const stats = [
    { label: 'TOTAL PLANNED', value: `${(totalPlanned / 1000).toFixed(1)} GW`, color: '#E8FF47' },
    { label: 'LIVE TODAY', value: `${totalOperational} MW`, color: '#22C55E' },
    { label: 'ERCOT APPROVED', value: `${(totalERCOT / 1000).toFixed(1)} GW`, color: '#3B82F6' },
    { label: 'CAPITAL COMMITTED', value: `$${totalInvestment.toFixed(0)}B+`, color: '#A855F7' },
    { label: 'ACTIVE TENANTS', value: String(activeTenants), color: '#22C55E' },
    { label: 'TIME-TO-ENERGIZE', value: abilene?.time_to_energize_days ? `${abilene.time_to_energize_days}d` : '—', color: '#E8FF47', sub: 'LNC-002 ABILENE' },
    { label: 'CLR PATENTS', value: 'LICENSED TO ERCOT', color: '#06B6D4', sub: 'APR 2025' },
    { label: 'SITES TRACKED', value: String(sites.length), color: '#F59E0B' },
  ]

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20"
      style={{ 
        background: 'linear-gradient(0deg, rgba(10,15,30,0.98) 0%, rgba(10,15,30,0) 100%)',
        paddingTop: '40px'
      }}>
      <div className="flex items-stretch border-t border-grid-border overflow-x-auto">
        {stats.map((stat, i) => (
          <div key={stat.label}
            className={`flex flex-col justify-center px-5 py-3 shrink-0 ${i > 0 ? 'border-l border-grid-border' : ''}`}
            style={{ minWidth: '120px' }}>
            <div className="font-mono text-lg font-bold leading-none mb-1"
              style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}50` }}>
              {stat.value}
            </div>
            <div className="font-mono text-xs text-gray-500 leading-tight">{stat.label}</div>
            {stat.sub && (
              <div className="font-mono text-xs mt-0.5" style={{ color: stat.color, opacity: 0.6, fontSize: '9px' }}>
                {stat.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
