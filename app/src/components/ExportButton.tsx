import React, { useState, useRef, useEffect } from 'react'

export default function ExportButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const downloadFile = (name: string, path: string) => {
    fetch(path).then(r => r.blob()).then(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setOpen(false)
    })
  }

  const files = [
    { label: 'lancium_sites.json', path: '/data/lancium_sites.json' },
    { label: 'lancium_tenants.json', path: '/data/lancium_tenants.json' },
    { label: 'lancium_sites.csv', path: '/data/lancium_sites.csv' },
    { label: 'lancium_tenants.csv', path: '/data/lancium_tenants.csv' },
  ]

  return (
    <div ref={ref} style={{ position: 'absolute', bottom: '90px', right: '16px', zIndex: 30 }}>
      {open && (
        <div style={{ marginBottom: '8px', background: 'rgba(10,15,30,0.97)', border: '1px solid #1E2D50', borderRadius: '4px', backdropFilter: 'blur(12px)', minWidth: '210px' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #1E2D50' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6B7280', letterSpacing: '0.1em' }}>EXPORT DATASET</span>
          </div>
          {files.map(f => (
            <button key={f.label} onClick={() => downloadFile(f.label, f.path)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', padding: '8px 12px', fontFamily: 'monospace', fontSize: '11px', color: '#D1D5DB', background: 'transparent', border: 'none', borderBottom: '1px solid #111C35', cursor: 'pointer' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#E8FF47'; (e.target as HTMLElement).style.background = '#0D1526' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#D1D5DB'; (e.target as HTMLElement).style.background = 'transparent' }}>
              <span style={{ color: f.label.endsWith('.json') ? '#06B6D4' : '#22C55E', minWidth: '34px' }}>
                {f.label.endsWith('.json') ? 'JSON' : 'CSV'}
              </span>
              {f.label}
            </button>
          ))}
          <div style={{ padding: '6px 12px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#374151' }}>v1.1 · 2026-03-22</span>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        style={{
          fontFamily: 'monospace', fontSize: '11px', padding: '6px 12px', borderRadius: '4px',
          border: `1px solid ${open ? '#E8FF47' : '#1E2D50'}`,
          background: open ? 'rgba(232,255,71,0.1)' : 'rgba(10,15,30,0.9)',
          color: open ? '#E8FF47' : '#6B7280',
          backdropFilter: 'blur(12px)', cursor: 'pointer',
        }}>
        ↓ EXPORT
      </button>
    </div>
  )
}
