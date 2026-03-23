import React, { useRef, useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import mapboxgl from 'mapbox-gl'
import { getSites, getTenants, getTenantsForSite } from '@/lib/data'
import { STATUS_COLORS, TENANT_STATUS_COLORS } from '@/lib/types'
import type { LanciumSite, LanciumTenant } from '@/lib/types'
import Header from '@/components/Header'
import ButtonBar from '@/components/ButtonBar'
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


      // Abilene campus polygon - 5502 Spinks Rd, ~1000 acres
      // Bounded by Spinks Rd (W), Summerhill Rd (N), approx 1000 acres
      // Coordinates derived from address + acreage + satellite reference
      m.addSource('abilene-polygon', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-99.8009, 32.5100],
              [-99.7773, 32.5100],
              [-99.7773, 32.4934],
              [-99.8009, 32.4934],
              [-99.8009, 32.5100],
            ]]
          },
          properties: { site_id: 'LNC-002', name: 'Abilene Clean Campus' }
        }
      })

      m.addLayer({
        id: 'abilene-polygon-fill',
        type: 'fill',
        source: 'abilene-polygon',
        paint: {
          'fill-color': '#E8FF47',
          'fill-opacity': 0.06,
        }
      })

      m.addLayer({
        id: 'abilene-polygon-border',
        type: 'line',
        source: 'abilene-polygon',
        paint: {
          'line-color': '#E8FF47',
          'line-width': 1.5,
          'line-opacity': 0.5,
          'line-dasharray': [3, 2],
        }
      })



      // ── TIER 1 GIS LAYERS ──────────────────────────────────────────
      // Rendered UNDER polygons and site dots. Static, non-interactive.

      // 1. ERCOT Load Zone boundaries (West/North/South/Houston)
      // Source: Mapbox public tileset approximation via custom GeoJSON
      m.addSource('ercot-zones', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { zone: 'WEST' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [-106.6, 31.0], [-106.6, 34.5], [-101.0, 34.5],
                  [-101.0, 33.0], [-100.0, 33.0], [-100.0, 31.0],
                  [-106.6, 31.0]
                ]]
              }
            },
            {
              type: 'Feature',
              properties: { zone: 'NORTH' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [-100.0, 33.0], [-101.0, 33.0], [-101.0, 34.5],
                  [-96.5, 34.5], [-96.5, 31.5], [-100.0, 31.5],
                  [-100.0, 33.0]
                ]]
              }
            },
            {
              type: 'Feature',
              properties: { zone: 'SOUTH' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [-100.0, 31.0], [-100.0, 31.5], [-96.5, 31.5],
                  [-96.5, 28.0], [-99.0, 26.0], [-100.5, 28.5],
                  [-100.0, 31.0]
                ]]
              }
            },
            {
              type: 'Feature',
              properties: { zone: 'HOUSTON' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [-96.5, 31.5], [-96.5, 28.0], [-93.8, 28.0],
                  [-93.8, 31.5], [-96.5, 31.5]
                ]]
              }
            }
          ]
        }
      })

      m.addLayer({
        id: 'ercot-zones-fill',
        type: 'fill',
        source: 'ercot-zones',
        paint: {
          'fill-color': [
            'match', ['get', 'zone'],
            'WEST', '#3B82F6',
            'NORTH', '#8B5CF6',
            'SOUTH', '#06B6D4',
            'HOUSTON', '#10B981',
            '#6B7280'
          ],
          'fill-opacity': 0.04,
        }
      })

      m.addLayer({
        id: 'ercot-zones-border',
        type: 'line',
        source: 'ercot-zones',
        paint: {
          'line-color': [
            'match', ['get', 'zone'],
            'WEST', '#3B82F6',
            'NORTH', '#8B5CF6',
            'SOUTH', '#06B6D4',
            'HOUSTON', '#10B981',
            '#6B7280'
          ],
          'line-width': 0.8,
          'line-opacity': 0.25,
          'line-dasharray': [4, 3],
        }
      })

      m.addLayer({
        id: 'ercot-zones-labels',
        type: 'symbol',
        source: 'ercot-zones',
        layout: {
          'text-field': ['concat', 'ERCOT ', ['get', 'zone']],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 9,
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#1E3A5F',
          'text-opacity': 0.6,
        }
      })

      // 2. Major 345kV transmission lines - West Texas
      // Key lines serving Abilene and Childress areas
      // Source: HIFLD / Texas PUC public data (approximated centerlines)
      m.addSource('tx-transmission', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            // Tuco-Abilene 345kV (serves Lancium Abilene directly)
            { type: 'Feature', properties: { kv: 345, name: 'Tuco-Abilene' },
              geometry: { type: 'LineString', coordinates: [
                [-102.0, 33.8], [-101.2, 33.5], [-100.4, 33.0],
                [-99.9, 32.7], [-99.78, 32.50]
              ]}},
            // Abilene-Comanche 345kV
            { type: 'Feature', properties: { kv: 345, name: 'Abilene-Comanche' },
              geometry: { type: 'LineString', coordinates: [
                [-99.78, 32.50], [-99.3, 32.2], [-98.6, 31.9]
              ]}},
            // Childress area 138kV
            { type: 'Feature', properties: { kv: 138, name: 'Childress-Area' },
              geometry: { type: 'LineString', coordinates: [
                [-100.6, 34.8], [-100.3, 34.6], [-100.1, 34.36],
                [-99.8, 34.2], [-99.5, 34.0]
              ]}},
            // West TX 345kV backbone
            { type: 'Feature', properties: { kv: 345, name: 'WTX-Backbone' },
              geometry: { type: 'LineString', coordinates: [
                [-104.0, 31.8], [-103.0, 31.9], [-102.0, 32.2],
                [-101.0, 32.5], [-100.0, 32.8], [-99.0, 33.0]
              ]}},
            // Lubbock-Abilene 345kV
            { type: 'Feature', properties: { kv: 345, name: 'Lubbock-Abilene' },
              geometry: { type: 'LineString', coordinates: [
                [-101.85, 33.55], [-101.2, 33.2], [-100.5, 32.8],
                [-99.9, 32.6], [-99.78, 32.50]
              ]}},
            // Panhandle 345kV
            { type: 'Feature', properties: { kv: 345, name: 'Panhandle' },
              geometry: { type: 'LineString', coordinates: [
                [-102.5, 35.2], [-101.8, 35.0], [-101.0, 34.8],
                [-100.5, 34.5], [-100.1, 34.36]
              ]}},
            // Fort Stockton area 138kV
            { type: 'Feature', properties: { kv: 138, name: 'FortStockton-Area' },
              geometry: { type: 'LineString', coordinates: [
                [-103.2, 31.2], [-102.9, 30.9], [-102.5, 30.9],
                [-102.0, 30.9], [-101.5, 31.0]
              ]}},
          ]
        }
      })

      m.addLayer({
        id: 'tx-transmission-345',
        type: 'line',
        source: 'tx-transmission',
        filter: ['==', ['get', 'kv'], 345],
        paint: {
          'line-color': '#F59E0B',
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.8, 10, 2],
          'line-opacity': 0.2,
        }
      })

      m.addLayer({
        id: 'tx-transmission-138',
        type: 'line',
        source: 'tx-transmission',
        filter: ['==', ['get', 'kv'], 138],
        paint: {
          'line-color': '#F59E0B',
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 10, 1],
          'line-opacity': 0.12,
        }
      })

      // 3. Wind resource zones - West Texas high-wind corridor
      // Source: NREL Wind Atlas approximation - Permian Basin / Panhandle wind zones
      m.addSource('wind-zones', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            // Panhandle high wind zone (where Childress sits)
            { type: 'Feature', properties: { intensity: 'high', label: 'PANHANDLE WIND CORRIDOR' },
              geometry: { type: 'Polygon', coordinates: [[
                [-103.0, 35.5], [-99.0, 35.5], [-99.0, 33.5],
                [-103.0, 33.5], [-103.0, 35.5]
              ]]}},
            // Central West TX wind zone (where Abilene sits)
            { type: 'Feature', properties: { intensity: 'medium', label: 'CENTRAL WIND ZONE' },
              geometry: { type: 'Polygon', coordinates: [[
                [-101.5, 33.5], [-98.5, 33.5], [-98.5, 31.5],
                [-101.5, 31.5], [-101.5, 33.5]
              ]]}},
            // Permian wind zone (Fort Stockton area)
            { type: 'Feature', properties: { intensity: 'high', label: 'PERMIAN WIND ZONE' },
              geometry: { type: 'Polygon', coordinates: [[
                [-104.0, 32.0], [-101.0, 32.0], [-101.0, 30.0],
                [-104.0, 30.0], [-104.0, 32.0]
              ]]}},
          ]
        }
      })

      m.addLayer({
        id: 'wind-zones-fill',
        type: 'fill',
        source: 'wind-zones',
        paint: {
          'fill-color': [
            'match', ['get', 'intensity'],
            'high', '#22C55E',
            'medium', '#86EFAC',
            '#6B7280'
          ],
          'fill-opacity': [
            'match', ['get', 'intensity'],
            'high', 0.04,
            'medium', 0.025,
            0.02
          ],
        }
      })

      m.addLayer({
        id: 'wind-zones-labels',
        type: 'symbol',
        source: 'wind-zones',
        layout: {
          'text-field': ['get', 'label'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 8,
          'text-anchor': 'center',
          'text-max-width': 10,
        },
        paint: {
          'text-color': '#166534',
          'text-opacity': 0.5,
        }
      })

      // ── END TIER 1 GIS LAYERS ───────────────────────────────────────

      // Childress campus polygon - 34.357136, -100.098100
      // 3000 acres ~12km2, ~4.5km E-W x 2.7km N-S
      m.addSource('childress-polygon', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-100.1226, 34.3693],
              [-99.9736, 34.3693],
              [-99.9736, 34.3450],
              [-100.1226, 34.3450],
              [-100.1226, 34.3693],
            ]]
          },
          properties: { site_id: 'LNC-003', name: 'Childress Clean Campus' }
        }
      })

      m.addLayer({
        id: 'childress-polygon-fill',
        type: 'fill',
        source: 'childress-polygon',
        paint: {
          'fill-color': '#3B82F6',
          'fill-opacity': 0.06,
        }
      })

      m.addLayer({
        id: 'childress-polygon-border',
        type: 'line',
        source: 'childress-polygon',
        paint: {
          'line-color': '#3B82F6',
          'line-width': 1.5,
          'line-opacity': 0.5,
          'line-dasharray': [3, 2],
        }
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
        <StatsBar sites={SITES} tenants={TENANTS} />
        <ButtonBar />
        
        {!selectedSite && (
          <div style={{ position: "fixed", bottom: "100px", left: "50%", transform: "translateX(-50%)", zIndex: 19, pointerEvents: "none" }}>
            <div className="font-sans text-xs text-gray-600 tracking-widest text-center">CLICK A SITE TO EXPLORE</div>
          </div>
        )}
      </main>
    </>
  )
}
