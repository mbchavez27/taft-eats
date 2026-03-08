type EstablishmentDescriptionProps = {
  description?: string | null
}

export default function EstablishmentDescription({
  description,
}: EstablishmentDescriptionProps) {
  return (
    <section className="text-md font-medium whitespace-pre-line bg-white text-black py-4 px-6 rounded-lg">
      <p>{description ?? 'No description available.'}</p>
    </section>
  )
}
