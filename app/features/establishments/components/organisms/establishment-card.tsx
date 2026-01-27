import EstablishmentRating from './establishment-rating'

export default function EstablishmentsCard({
  name,
  rating,
}: {
  name?: string
  rating?: number
}) {
  return (
    <>
      <main className="flex flex-col items-center gap-2">
        <section className="bg-[#FFD24D] hover:bg-[#FFBF00] text-[#326F33] hover:text-white transition duration-100 w-36 min-h-36 md:w-44 md:min-h-44 rounded-md flex flex-col justify-between p-2 gap-4 drop-shadow-2xl">
          <div className="flex justify-center">
            <div className="bg-[#D9D9D9] w-full h-24 rounded-md px-1 py-2">
              <div className="bg-[#848484] w-7 h-7 rounded-full"></div>
            </div>
          </div>
          <div className="font-lexend font-bold text-xl pb-2 truncate">
            {name ?? 'Establishment Name'}
          </div>
        </section>
        <section className="flex justify-center">
          <EstablishmentRating rating={rating} />
        </section>
      </main>
    </>
  )
}
