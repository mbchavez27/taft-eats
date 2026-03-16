interface Props {
  name?: string | null
  location?: string
}

export default function EstablishmentHeader({ name, location }: Props) {
  return (
    <header>
      <h1 className="text-black font-climate uppercase text-3xl md:text-6xl lg:text-7xl tracking-wider">
        {name}
      </h1>
      <p className="font-lexend text-xl font-bold text-[#9CB16F]">
        Location: {location}
      </p>
    </header>
  )
}
