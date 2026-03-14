import { Link } from 'react-router'
import EstablishmentRating from './establishment-rating'
import ImageContainer from '~/features/shared/container/image-container'

interface EstablishmentsCardProps {
  id: number
  name?: string
  rating?: number
  show_ratings?: boolean
  banner_url?: string
  initialIsBookmarked?: boolean
}

export default function EstablishmentsCard({
  id,
  name,
  rating,
  show_ratings = true,
  banner_url,
  initialIsBookmarked,
}: EstablishmentsCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <section className="relative bg-[#326F33] hover:bg-[#265527] transition duration-100 w-36 md:w-44 rounded-md flex flex-col justify-between p-2 gap-4 border-black border-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
        <Link to={`/restaurants/${id}`} className="block">
          <div className="flex justify-center">
            <div className="w-full h-24 overflow-hidden">
              {/* Using the smart ImageContainer here */}
              <ImageContainer
                bannerUrl={banner_url}
                initialIsBookmarked={initialIsBookmarked}
                className="h-full border-4 rounded-md" // Overriding the border-12 for the small card
              />
            </div>
          </div>

          <div className="font-lexend font-bold text-lg md:text-xl pt-2 truncate text-white text-center">
            {name ?? 'Establishment Name'}
          </div>
        </Link>
      </section>

      {show_ratings && (
        <section className="flex justify-center">
          <EstablishmentRating rating={rating} />
        </section>
      )}
    </div>
  )
}
