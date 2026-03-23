import React, { useState, useRef, useEffect } from 'react'

function useClickOutside(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, cb])
}

export default function ButtonBar() {
  const [mode, setMode] = useState<null | 'info' | 'feedback' | 'export'>(null)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setMode(null))

  const btn = (id: 'info' | 'feedback' | 'export', label: string) => ({
    style: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.05em',
      padding: '6px 10px',
      border: `1px solid ${mode === id ? '#E8FF47' : '#1E2D50'}`,
      background: mode === id ? 'rgba(232,255,71,0.12)' : 'rgba(10,15,30,0.92)',
      color: mode === id ? '#E8FF47' : '#6B7280',
      cursor: 'pointer',
      backdropFilter: 'blur(12px)',
      transition: 'all 0.15s ease',
      whiteSpace: 'nowrap' as const,
    },
    onClick: () => setMode(mode === id ? null : id),
  })

  const downloadFile = (name: string, path: string) => {
    fetch(path).then(r => r.blob()).then(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = name; a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    })
    setMode(null)
  }

  const popupStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '38px',
    background: 'rgba(10,15,30,0.97)',
    border: '1px solid #1E2D50',
    borderRadius: '4px',
    backdropFilter: 'blur(12px)',
    zIndex: 40,
    minWidth: '240px',
    maxWidth: '90vw',
  }

  return (
    <div ref={ref} style={{
      position: 'fixed',
      bottom: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 30,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0',
    }}>
      {/* Popups */}
      {mode === 'info' && (
        <div style={{ ...popupStyle, left: 0 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1E2D50' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#E8FF47', letterSpacing: '0.1em' }}>ABOUT THIS MAP</span>
          </div>
          <div style={{ padding: '12px 14px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: '#9CA3AF', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '10px' }}>Tracks the <span style={{ color: '#fff' }}>Lancium Clean Campus model</span> — pre-permitted, pre-interconnected land and power platform across West Texas.</p>
            <p style={{ marginBottom: '10px' }}><span style={{ color: '#E8FF47' }}>ERCOT queue position</span> is Lancium's product. Time from groundbreak to first live MW is the moat.</p>
            <div style={{ borderTop: '1px solid #1E2D50', paddingTop: '10px', marginBottom: '10px' }}>
              {[['#22C55E','CONFIRMED','Primary source verified'],['#F59E0B','INFERRED','Derived from patterns'],['#6B7280','MISSING','No public data']].map(([c,l,n]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: c, flexShrink: 0 }} />
                  <span style={{ color: c, fontSize: '11px' }}>{l}</span>
                  <span style={{ color: '#4B5563', fontSize: '11px' }}>— {n}</span>
                </div>
              ))}
            </div>
            <p style={{ color: '#4B5563', fontSize: '11px' }}>Dataset v1.1 · 2026-03-22 · Built by dexdogs</p>
          </div>
        </div>
      )}

      {mode === 'feedback' && (
        <div style={{ ...popupStyle, left: 0 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1E2D50' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#E8FF47', letterSpacing: '0.1em' }}>FEEDBACK</span>
          </div>
          <div style={{ padding: '12px 14px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: '#9CA3AF', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '12px' }}>Found a data error? Have a source we missed?</p>
            {[
              ['⊕', 'Open a GitHub Issue', 'https://github.com/dexdogs/time-to-energize/issues/new'],
              ['⌥', 'View Source on GitHub', 'https://github.com/dexdogs/time-to-energize'],
            ].map(([icon, label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: '1px solid #1E2D50', borderRadius: '3px', color: '#D1D5DB', textDecoration: 'none', marginBottom: '6px', fontSize: '12px' }}>
                <span>{icon}</span><span>{label}</span>
              </a>
            ))}
            <p style={{ color: '#4B5563', fontSize: '11px', marginTop: '8px' }}>All data sourced from public filings and press releases.</p>
          </div>
        </div>
      )}

      {mode === 'export' && (
        <div style={{ ...popupStyle, right: 0, left: 'auto' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1E2D50' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#E8FF47', letterSpacing: '0.1em' }}>EXPORT DATASET</span>
          </div>
          {[
            ['lancium_sites.json', '/data/lancium_sites.json', '#06B6D4', 'JSON'],
            ['lancium_tenants.json', '/data/lancium_tenants.json', '#06B6D4', 'JSON'],
            ['lancium_sites.csv', '/data/lancium_sites.csv', '#22C55E', 'CSV'],
            ['lancium_tenants.csv', '/data/lancium_tenants.csv', '#22C55E', 'CSV'],
          ].map(([name, path, color, type]) => (
            <button key={name} onClick={() => downloadFile(name, path)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px 14px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: '#D1D5DB', background: 'transparent', border: 'none', borderBottom: '1px solid #111C35', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ color, minWidth: '32px', fontSize: '11px' }}>{type}</span>
              {name}
            </button>
          ))}
          <div style={{ padding: '6px 14px' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#374151' }}>v1.1 · 2026-03-22</span>
          </div>
        </div>
      )}

      {/* Button row - always together */}
      <div style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid #1E2D50' }}>
        <button {...btn('info', 'ⓘ INFO')}>ⓘ INFO</button>
        <button {...btn('feedback', '⌁ FEEDBACK')} style={{ ...btn('feedback', '').style, borderLeft: '1px solid #1E2D50', borderRight: '1px solid #1E2D50' }}>⌁ FEEDBACK</button>
        <button {...btn('export', '↓ EXPORT')}>↓ EXPORT</button>
      </div>
    </div>
  )
}
