interface Props {
  name?: string | null
  lat?: number | null
  lng?: number | null
}

export default function EstablishmentHeader({ name, lat, lng }: Props) {
  const displayLocation =
    lat != null && lng != null ? `${lat}, ${lng}` : 'Location not available'

  return (
    <header>
      <h1 className="text-black font-climate uppercase text-3xl md:text-6xl lg:text-7xl tracking-wider">
        {name}
      </h1>
      <p className="font-lexend text-xl font-bold text-[#9CB16F]">
        Location: {displayLocation}
      </p>
    </header>
  )
}
