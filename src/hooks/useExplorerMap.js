import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { createClusterIcon } from '../lib/markerFactory'
import { explorerCache } from '../components/explorer/explorerCache'

const DEFAULT_CENTER = [37.77, -122.42]
const DEFAULT_ZOOM = 12

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

export function useExplorerMap(containerRef, { hasUrlTarget, onCleanup }) {
  const mapRef = useRef(null)
  const clusterGroupRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) return

    const saved = explorerCache.mapView
    const useSavedView = !hasUrlTarget && saved

    const map = L.map(containerRef.current, {
      center: useSavedView ? saved.center : DEFAULT_CENTER,
      zoom: useSavedView ? saved.zoom : DEFAULT_ZOOM,
      zoomControl: true,
    })

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 20,
      subdomains: 'abcd',
    }).addTo(map)

    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      disableClusteringAtZoom: 16,
      iconCreateFunction: createClusterIcon,
    })
    map.addLayer(clusterGroup)

    mapRef.current = map
    clusterGroupRef.current = clusterGroup

    return () => {
      explorerCache.mapView = {
        center: [map.getCenter().lat, map.getCenter().lng],
        zoom: map.getZoom(),
      }
      onCleanup?.()
      map.remove()
      mapRef.current = null
      clusterGroupRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { mapRef, clusterGroupRef }
}
