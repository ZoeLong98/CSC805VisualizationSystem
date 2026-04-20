import { useState, useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import { useSearchParams } from 'react-router-dom'

import FilterSidebar from '../components/explorer/FilterSidebar'
import DetailPanel from '../components/explorer/DetailPanel'
import TimelineSlider from '../components/explorer/TimelineSlider'
import LoadingProgress from '../components/explorer/LoadingProgress'
import { explorerCache } from '../components/explorer/explorerCache'

import { useAccidentRecords } from '../hooks/useAccidentRecords'
import { useExplorerMap } from '../hooks/useExplorerMap'

import { createCircleIcon } from '../lib/markerFactory'
import { matchesFilters, withinTimestampRange } from '../lib/filters'
import { computeDateRange, syncFiltersWithRange, clampRange } from '../lib/dateRange'
import { SEVERITY_LEVELS } from '../lib/constants'

const DEFAULT_FILTERS = { startDate: '', endDate: '', severity: [...SEVERITY_LEVELS], weather: [] }

export default function Explorer() {
  const [searchParams] = useSearchParams()
  const mapContainerRef = useRef(null)
  const allMarkersRef = useRef([])

  const [filters, setFilters] = useState(explorerCache.filters || DEFAULT_FILTERS)
  const [dateRange, setDateRange] = useState(explorerCache.dateRange || null)
  const [sliderRange, setSliderRange] = useState(explorerCache.sliderRange || null)
  const [selectedAccident, setSelectedAccident] = useState(null)
  const [detailPanelOpen, setDetailPanelOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const filtersRef = useRef(filters)
  const sliderRangeRef = useRef(sliderRange)
  filtersRef.current = filters
  sliderRangeRef.current = sliderRange

  const hasUrlTarget = !!(searchParams.get('lat') || searchParams.get('county'))

  const { mapRef, clusterGroupRef } = useExplorerMap(mapContainerRef, {
    hasUrlTarget,
    onCleanup: () => {
      explorerCache.filters = filtersRef.current
      explorerCache.sliderRange = sliderRangeRef.current
    },
  })

  const { records, progress, loading } = useAccidentRecords()

  const refilter = useCallback((f, sr) => {
    const cg = clusterGroupRef.current
    if (!cg) return
    cg.clearLayers()
    const visible = allMarkersRef.current.filter(
      (m) => matchesFilters(m.accidentData, f) && withinTimestampRange(m.accidentData, sr)
    )
    cg.addLayers(visible)
  }, [clusterGroupRef])

  // Build markers once records + map are both ready
  useEffect(() => {
    if (!records || !clusterGroupRef.current) return
    if (allMarkersRef.current.length > 0) return

    const markers = records.map((r) => {
      const marker = L.marker([r.lat, r.lng], { icon: createCircleIcon(r.severity) })
      marker.accidentData = r
      marker.on('click', () => {
        setSelectedAccident(r)
        setDetailPanelOpen(true)
      })
      return marker
    })

    allMarkersRef.current = markers
    clusterGroupRef.current.addLayers(markers)

    if (explorerCache.filters && explorerCache.sliderRange) {
      refilter(explorerCache.filters, explorerCache.sliderRange)
      return
    }

    const range = computeDateRange(records)
    if (range) {
      explorerCache.dateRange = range
      setDateRange(range)
      setSliderRange([range.min, range.max])
      setFilters((prev) => syncFiltersWithRange(prev, range))
    }
  }, [records, clusterGroupRef, refilter])

  // Fly to URL target (county or lat/lng) after markers load
  useEffect(() => {
    if (!mapRef.current || allMarkersRef.current.length === 0) return
    flyToUrlTarget(mapRef.current, allMarkersRef.current, searchParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records])

  const applyFilters = useCallback(
    (next) => {
      setFilters(next)
      refilter(next, sliderRangeRef.current)
    },
    [refilter]
  )

  const handleSliderChange = useCallback(
    (range) => {
      setSliderRange(range)
      const next = syncFiltersWithRange(filtersRef.current, { min: range[0], max: range[1] })
      setFilters(next)
      refilter(next, range)
    },
    [refilter]
  )

  const handleDateRangeInput = useCallback(
    ({ startDate, endDate }) => {
      const next = { ...filtersRef.current }
      if (startDate !== undefined) next.startDate = startDate
      if (endDate !== undefined) next.endDate = endDate
      setFilters(next)

      if (!dateRange) {
        refilter(next, sliderRangeRef.current)
        return
      }

      const startTs = next.startDate ? new Date(next.startDate).getTime() : dateRange.min
      const endTs = next.endDate ? new Date(next.endDate + 'T23:59:59').getTime() : dateRange.max
      const newRange = clampRange([startTs, endTs], dateRange)
      setSliderRange(newRange)
      refilter(next, newRange)
    },
    [refilter, dateRange]
  )

  return (
    <div className="flex-1 relative" style={{ height: 'calc(100vh - 65px)' }}>
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      <FilterSidebar
        filters={filters}
        onFilterChange={applyFilters}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        dateRange={dateRange}
        onDateRangeInput={handleDateRangeInput}
      />

      {detailPanelOpen && (
        <DetailPanel
          accident={selectedAccident}
          onClose={() => {
            setDetailPanelOpen(false)
            setSelectedAccident(null)
          }}
        />
      )}

      {loading && <LoadingProgress loaded={progress.loaded} total={progress.total} />}

      {!loading && dateRange && sliderRange && (
        <TimelineSlider
          dateRange={dateRange}
          sliderRange={sliderRange}
          onRangeChange={handleSliderChange}
        />
      )}
    </div>
  )
}

function flyToUrlTarget(map, markers, searchParams) {
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const county = searchParams.get('county')
  const state = searchParams.get('state')

  if (lat && lng) {
    map.flyTo([parseFloat(lat), parseFloat(lng)], 10, { duration: 1 })
    return
  }

  if (county && state) {
    const countyMarkers = markers.filter((m) => m.accidentData.state === state)
    if (countyMarkers.length === 0) return
    const bounds = L.latLngBounds(countyMarkers.map((m) => m.getLatLng()))
    map.flyToBounds(bounds.pad(0.1), { maxZoom: 10, duration: 1 })
  }
}
