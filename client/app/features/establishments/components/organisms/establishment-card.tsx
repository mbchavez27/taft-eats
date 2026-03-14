import { Link } from 'react-router'
import EstablishmentRating from './establishment-rating'

export default function EstablishmentsCard({
  id,
  name,
  rating,
  show_ratings = true,
}: {
  id: number
  name?: string
  rating?: number
  show_ratings?: boolean
}) {
  return (
    <>
      <Link
        to={`/restaurants/${id}`}
        className="flex flex-col items-center gap-2"
      >
        <section className="bg-[#326F33] hover:bg-[#265527] text-[#326F33] hover:text-white transition duration-100 w-36 max-h-36 md:w-44 md:max-h-44 rounded-md flex flex-col justify-between p-2 gap-4 border-black border-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
          <div className="flex justify-center">
            <div className="bg-[#D9D9D9] w-full h-24 rounded-md px-1 py-2">
              <div className="bg-[#848484] w-7 h-7 rounded-full"></div>
            </div>
          </div>
          <div className="font-lexend font-bold text-xl pb-2 truncate text-white">
            {name ?? 'Establishment Name'}
          </div>
        </section>
        {show_ratings ? (
          <>
            <section className="flex justify-center">
              <EstablishmentRating rating={rating} />
            </section>
          </>
        ) : null}
      </Link>
    </>
  )
}
// Express app configuration (no listen)
