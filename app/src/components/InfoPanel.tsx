import React, { useState } from 'react'

export default function InfoPanel() {
  const [mode, setMode] = useState<null | 'info' | 'feedback'>(null)

  const btnStyle = (active: boolean) => ({
    background: active ? 'rgba(232,255,71,0.1)' : 'rgba(10,15,30,0.9)',
    borderColor: active ? '#E8FF47' : '#1E2D50',
    color: active ? '#E8FF47' : '#6B7280',
    backdropFilter: 'blur(12px)',
  })

  return (
    <div className="absolute bottom-24 left-4 z-30 flex flex-col gap-2 items-start">
      {/* Info modal */}
      {mode === 'info' && (
        <div className="mb-1 rounded border border-gray-700 p-4"
          style={{ background: 'rgba(10,15,30,0.97)', backdropFilter: 'blur(12px)', maxWidth: '320px' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-xs tracking-widest" style={{ color: '#E8FF47' }}>ABOUT THIS MAP</span>
            <button onClick={() => setMode(null)} className="font-sans text-xs text-gray-500 hover:text-white">[×]</button>
          </div>
          <div className="font-sans text-xs text-gray-400 leading-relaxed space-y-2">
            <p>Tracks the <span className="text-white">Lancium Clean Campus model</span> — pre-permitted, pre-interconnected land and power platform across West Texas.</p>
            <p><span style={{ color: '#E8FF47' }}>ERCOT queue position</span> is Lancium's product. The time between groundbreak and first live MW is the moat.</p>
            <div className="pt-2 border-t border-gray-800">
              {[
                { color: '#22C55E', label: 'CONFIRMED', note: 'Primary source verified' },
                { color: '#F59E0B', label: 'INFERRED', note: 'Derived from patterns' },
                { color: '#6B7280', label: 'MISSING', note: 'No public data found' },
              ].map(({ color, label, note }) => (
                <div key={label} className="flex items-center gap-2 py-1">
                  <div className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ background: color }} />
                  <span style={{ color }} className="font-sans text-xs">{label}</span>
                  <span className="text-gray-600 text-xs font-sans">— {note}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-800 text-gray-600">
              <p>Dataset v1.1 · Updated 2026-03-22</p>
              <p>Built by <span className="text-gray-400">dexdogs</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback modal */}
      {mode === 'feedback' && (
        <div className="mb-1 rounded border border-gray-700 p-4"
          style={{ background: 'rgba(10,15,30,0.97)', backdropFilter: 'blur(12px)', maxWidth: '320px' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-xs tracking-widest" style={{ color: '#E8FF47' }}>FEEDBACK</span>
            <button onClick={() => setMode(null)} className="font-sans text-xs text-gray-500 hover:text-white">[×]</button>
          </div>
          <div className="font-sans text-xs text-gray-400 leading-relaxed space-y-3">
            <p>Found a data error? Have a source we missed? Want to contribute?</p>
            <div className="space-y-2">
              <a href="https://github.com/dexdogs/time-to-energize/issues/new"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded border border-gray-700 hover:border-yellow-300 hover:text-yellow-300 transition-colors text-gray-300">
                <span>⊕</span>
                <span>Open a GitHub Issue</span>
              </a>
              <a href="https://github.com/dexdogs/time-to-energize"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded border border-gray-700 hover:border-yellow-300 hover:text-yellow-300 transition-colors text-gray-300">
                <span>⌥</span>
                <span>View Source on GitHub</span>
              </a>
            </div>
            <p className="text-gray-600 pt-1">All data is sourced from public filings, press releases, and industry reporting. See README for full source list.</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setMode(mode === 'info' ? null : 'info')}
          className="font-sans text-xs px-3 py-2 rounded border transition-all"
          style={btnStyle(mode === 'info')}>
          ⓘ INFO
        </button>
        <button onClick={() => setMode(mode === 'feedback' ? null : 'feedback')}
          className="font-sans text-xs px-3 py-2 rounded border transition-all"
          style={btnStyle(mode === 'feedback')}>
          ⌁ FEEDBACK
        </button>
      </div>
    </div>
  )
}
