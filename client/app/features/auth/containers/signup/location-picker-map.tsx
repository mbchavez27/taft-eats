import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface Props {
  lat: number | undefined
  lng: number | undefined
  onLocationSelect: (lat: number, lng: number) => void
}

export default function LocationPickerMap({
  lat,
  lng,
  onLocationSelect,
}: Props) {
  function ClickHandler() {
    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      },
    })
    return lat && lng ? (
      <Marker position={[lat, lng]} icon={markerIcon} />
    ) : null
  }

  function MapResizer() {
    const map = useMap()
    useEffect(() => {
      map.invalidateSize()
    }, [map])
    return null
  }

  return (
    <MapContainer
      center={[14.5648, 120.9932]}
      zoom={16}
      className="h-full w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler />
      <MapResizer />
    </MapContainer>
  )
}
