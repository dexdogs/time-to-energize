import React from 'react'

interface HeaderProps {
  selectedSiteId: string | null
}

export default function Header({ selectedSiteId }: HeaderProps) {
  return (
    <header style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', height: '64px',
      background: 'linear-gradient(180deg, rgba(10,15,30,0.98) 0%, rgba(10,15,30,0.85) 100%)',
      borderBottom: '1px solid #1E2D50',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{ width: '28px', height: '28px', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, border: '1px solid #E8FF47', opacity: 0.6, transform: 'rotate(45deg)' }} />
          <div style={{ position: 'absolute', inset: '4px', background: '#E8FF47', opacity: 0.15, transform: 'rotate(45deg)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8FF47', boxShadow: '0 0 6px #E8FF47' }} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', color: '#E8FF47', textShadow: '0 0 20px rgba(232,255,71,0.5)', lineHeight: 1.2 }}>
            TIME-TO-ENERGIZE
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#4B5563', letterSpacing: '0.08em', lineHeight: 1.2 }}>
            LANCIUM INTELLIGENCE // DEXDOGS
          </div>
        </div>
      </div>

      {/* Legend - hidden on small mobile, shown sm+ */}
      <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {[
            { color: '#E8FF47', label: 'OPERATIONAL' },
            { color: '#3B82F6', label: 'IN DEV' },
            { color: '#06B6D4', label: 'PROBABLE' },
            { color: '#4B5563', label: 'SPECULATIVE' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, boxShadow: color !== '#4B5563' ? `0 0 6px ${color}` : 'none' }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#6B7280', letterSpacing: '0.06em' }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid #1E2D50' }}>
          {[['#22C55E','CONFIRMED'],['#F59E0B','INFERRED'],['#6B7280','MISSING']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '1px', background: color }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color, letterSpacing: '0.06em' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ERCOT live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', border: '1px solid #1E2D50', borderRadius: '4px', background: 'rgba(232,255,71,0.05)', flexShrink: 0 }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8FF47', animation: 'pulse-volt 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#E8FF47', letterSpacing: '0.08em' }}>ERCOT LIVE</span>
      </div>
    </header>
  )
}
