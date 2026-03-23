import React, { useRef, useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import mapboxgl from 'mapbox-gl'
import { getSites, getTenants, getTenantsForSite } from '@/lib/data'
import { STATUS_COLORS, TENANT_STATUS_COLORS } from '@/lib/types'
import type { LanciumSite, LanciumTenant } from '@/lib/types'
import Header from '@/components/Header'
import ExportButton from '@/components/ExportButton'
import InfoPanel from '@/components/InfoPanel'
import SitePanel from '@/components/SitePanel'
import StatsBar from '@/components/StatsBar'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
mapboxgl.accessToken = MAPBOX_TOKEN

const SITES = getSites()
const TENANTS = getTenants()

function buildGeoJSON(sites: LanciumSite[], selectedId: string | null) {
  return {
    type: 'FeatureCollection' as const,
    features: sites.map(site => {
      const tenants = getTenantsForSite(site.site_id)
      const topTenant = tenants.find(t => t.tenant_status === 'active') ||
                        tenants.find(t => t.tenant_status === 'probable') ||
                        tenants[0]
      return {
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [site.lon, site.lat] },
        properties: {
          site_id: site.site_id,
          site_name: site.site_name,
          site_status: site.site_status,
          status_color: STATUS_COLORS[site.site_status],
          operational_mw: site.operational_capacity_mw || 0,
          planned_mw: site.planned_capacity_mw || 0,
          ercot_mw: site.ercot_interconnect_approved_mw || 0,
          time_to_energize: site.time_to_energize_days,
          top_tenant: topTenant?.tenant_name || 'TBD',
          top_tenant_status: topTenant?.tenant_status || 'unknown',
          is_selected: site.site_id === selectedId,
          tenant_count: tenants.length,
        }
      }
    })
  }
}

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedSite, setSelectedSite] = useState<LanciumSite | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const handleSiteClick = useCallback((siteId: string) => {
    const site = SITES.find(s => s.site_id === siteId)
    if (site) setSelectedSite(site)
  }, [])

  const handleClose = useCallback(() => setSelectedSite(null), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose])

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-100.5, 32.5],
      zoom: 6,
      pitch: 30,
      bearing: -5,
      antialias: true,
    })

    map.current.on('load', () => {
      const m = map.current!

      m.setFog({
        color: 'rgb(10, 15, 30)',
        'high-color': 'rgb(10, 15, 30)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(5, 8, 20)',
        'star-intensity': 0.6,
      })

      m.addSource('lancium-sites', {
        type: 'geojson',
        data: buildGeoJSON(SITES, null),
      })

      m.addLayer({
        id: 'site-glow',
        type: 'circle',
        source: 'lancium-sites',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 20, 10, 40],
          'circle-color': ['get', 'status_color'],
          'circle-opacity': 0.08,
          'circle-blur': 1,
        }
      })

      m.addLayer({
        id: 'site-circles',
        type: 'circle',
        source: 'lancium-sites',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, ['interpolate', ['linear'], ['get', 'planned_mw'], 0, 4, 1200, 12],
            10, ['interpolate', ['linear'], ['get', 'planned_mw'], 0, 8, 1200, 24],
          ],
          'circle-color': ['get', 'status_color'],
          'circle-opacity': ['case', ['==', ['get', 'site_status'], 'unknown'], 0.3, ['==', ['get', 'site_status'], 'in_development'], 0.7, 1.0],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.3,
        }
      })

      m.addLayer({
        id: 'ercot-ring',
        type: 'circle',
        source: 'lancium-sites',
        filter: ['>', ['get', 'ercot_mw'], 0],
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, ['interpolate', ['linear'], ['get', 'ercot_mw'], 0, 6, 1200, 18],
            10, ['interpolate', ['linear'], ['get', 'ercot_mw'], 0, 14, 1200, 36],
          ],
          'circle-color': 'transparent',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#E8FF47',
          'circle-stroke-opacity': 0.3,
          'circle-opacity': 0,
        }
      })

      m.addLayer({
        id: 'site-labels',
        type: 'symbol',
        source: 'lancium-sites',
        layout: {
          'text-field': ['concat', ['get', 'site_name'], '\n', ['case', ['>', ['get', 'planned_mw'], 0], ['concat', ['to-string', ['get', 'planned_mw']], ' MW'], '?? MW']],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 4, 9, 10, 11],
          'text-offset': [0, 1.8],
          'text-anchor': 'top',
          'text-max-width': 12,
        },
        paint: {
          'text-color': ['case', ['==', ['get', 'site_status'], 'operational'], '#E8FF47', ['==', ['get', 'site_status'], 'in_development'], '#60A5FA', '#6B7280'],
          'text-opacity': 0.9,
          'text-halo-color': '#0A0F1E',
          'text-halo-width': 2,
        }
      })

      m.on('click', 'site-circles', (e: any) => {
        if (!e.features?.[0]) return
        const siteId = e.features[0].properties?.site_id
        if (siteId) handleSiteClick(siteId)
      })

      m.on('mouseenter', 'site-circles', () => { m.getCanvas().style.cursor = 'pointer' })
      m.on('mouseleave', 'site-circles', () => { m.getCanvas().style.cursor = '' })
      m.on('click', (e: any) => {
        const features = m.queryRenderedFeatures(e.point, { layers: ['site-circles'] })
        if (!features.length) setSelectedSite(null)
      })

      setMapLoaded(true)
    })

    return () => { map.current?.remove(); map.current = null }
  }, [handleSiteClick])

  useEffect(() => {
    if (!map.current || !mapLoaded) return
    const source = map.current.getSource('lancium-sites') as mapboxgl.GeoJSONSource
    if (source) source.setData(buildGeoJSON(SITES, selectedSite?.site_id || null))
    if (map.current.getLayer('site-circles')) {
      map.current.setPaintProperty('site-circles', 'circle-stroke-width', ['case', ['==', ['get', 'site_id'], selectedSite?.site_id || ''], 3, 1])
      map.current.setPaintProperty('site-circles', 'circle-stroke-opacity', ['case', ['==', ['get', 'site_id'], selectedSite?.site_id || ''], 0.9, 0.3])
    }
  }, [selectedSite, mapLoaded])

  const selectedTenants = selectedSite ? getTenantsForSite(selectedSite.site_id) : []

  return (
    <>
      <Head>
        <title>Time-To-Energize | Lancium Clean Campus Intelligence</title>
        <meta name="description" content="Track Lancium Clean Campus sites, ERCOT queue positions, and tenant pipelines across West Texas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0A0F1E', backgroundImage: 'linear-gradient(rgba(30,45,80,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,80,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        <div ref={mapContainer} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }} />
        <Header selectedSiteId={selectedSite?.site_id || null} />
        {selectedSite && <SitePanel site={selectedSite} tenants={selectedTenants} onClose={handleClose} />}
        {!selectedSite && <StatsBar sites={SITES} tenants={TENANTS} />}
        <ExportButton />
        <InfoPanel />
        {!selectedSite && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="font-mono text-xs text-gray-600 tracking-widest text-center">CLICK A SITE TO EXPLORE</div>
          </div>
        )}
      </main>
    </>
  )
}
