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
    { label: 'CAPITAL', value: `$${totalInvestment.toFixed(0)}B+`, color: '#A855F7' },
    { label: 'ACTIVE TENANTS', value: String(activeTenants), color: '#22C55E' },
    { label: 'TIME-TO-ENERGIZE', value: abilene?.time_to_energize_days ? `${abilene.time_to_energize_days}d` : '—', color: '#E8FF47', sub: 'ABILENE' },
    { label: 'CLR PATENTS', value: 'ERCOT', color: '#06B6D4', sub: 'APR 2025' },
    { label: 'SITES', value: String(sites.length), color: '#F59E0B' },
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 35,
      background: 'rgba(10,15,30,0.98)',
      borderTop: '1px solid #1E2D50',
    }}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      } as React.CSSProperties}>
        {stats.map((stat, i) => (
          <div key={stat.label} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '8px 14px',
            flexShrink: 0,
            minWidth: '80px',
            borderLeft: i > 0 ? '1px solid #1E2D50' : 'none',
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              lineHeight: 1,
              marginBottom: '3px',
              color: stat.color,
              textShadow: `0 0 10px ${stat.color}50`,
            }}>{stat.value}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '8px', color: '#6B7280', letterSpacing: '0.06em' }}>{stat.label}</div>
            {stat.sub && <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '8px', color: stat.color, opacity: 0.6, marginTop: '1px' }}>{stat.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
