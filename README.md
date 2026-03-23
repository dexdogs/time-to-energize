import React from 'react'

interface HeaderProps {
  selectedSiteId: string | null
}

export default function Header({ selectedSiteId }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
      style={{ background: 'linear-gradient(180deg, rgba(10,15,30,0.95) 0%, rgba(10,15,30,0) 100%)' }}>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Logo mark */}
          <div className="w-7 h-7 relative">
            <div className="absolute inset-0 border border-volt opacity-60" 
              style={{ transform: 'rotate(45deg)' }} />
            <div className="absolute inset-1 bg-volt opacity-20" 
              style={{ transform: 'rotate(45deg)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-volt rounded-full" 
                style={{ boxShadow: '0 0 6px #E8FF47' }} />
            </div>
          </div>
          <div>
            <div className="text-volt font-mono text-sm font-bold tracking-widest glow-volt">
              TIME-TO-ENERGIZE
            </div>
            <div className="text-gray-500 font-mono text-xs tracking-wider">
              LANCIUM CLEAN CAMPUS INTELLIGENCE // DEXDOGS
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Legend */}
        <div className="hidden md:flex items-center gap-4">
          {[
            { color: '#E8FF47', label: 'OPERATIONAL' },
            { color: '#3B82F6', label: 'IN DEV' },
            { color: '#06B6D4', label: 'PROBABLE' },
            { color: '#4B5563', label: 'SPECULATIVE' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" 
                style={{ background: color, boxShadow: color !== '#4B5563' ? `0 0 6px ${color}` : 'none' }} />
              <span className="text-gray-400 font-mono text-xs tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {/* Confidence legend */}
        <div className="hidden lg:flex items-center gap-3 border-l border-grid-border pl-4">
          {[
            { color: '#22C55E', label: 'CONFIRMED' },
            { color: '#F59E0B', label: 'INFERRED' },
            { color: '#6B7280', label: 'MISSING' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-sm" style={{ background: color }} />
              <span className="font-mono text-xs" style={{ color }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 border border-grid-border rounded px-3 py-1.5"
          style={{ background: 'rgba(232,255,71,0.05)' }}>
          <div className="w-1.5 h-1.5 bg-volt rounded-full pulse-active" />
          <span className="font-mono text-xs text-volt">ERCOT LIVE</span>
        </div>
      </div>
    </header>
  )
}
