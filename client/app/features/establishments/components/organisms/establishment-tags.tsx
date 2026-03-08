import { FaStar } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'

export default function EstablishmentTags({
  id,
  stars,
  numberOfReviews,
  tags: initialTags,
}: {
  id?: number
  stars?: number
  numberOfReviews?: number
  tags?: string[]
}) {
  // Fetch tags dynamically using the restaurant ID
  const { data: tagsData, isLoading } = useQuery({
    queryKey: ['establishment-tags', id],
    queryFn: () => EstablishmentService.getTagsByRestaurantId(id!),
    enabled: !!id,
  })

  const displayTags = tagsData?.data.map((tag) => tag.name) ??
    initialTags ?? ['Mexican', 'Fast Food', 'Affordable']

  return (
    <>
      <main className="text-[#416CAE] bg-white rounded-lg px-3 py-4 flex flex-col justify-center items-center gap-4 font-bold">
        <div className="text-xl">
          <p>
            {Math.round(stars ?? 5)} ({numberOfReviews ?? 1000}+)
          </p>
        </div>

        <div className="flex gap-2">
          {Array.from({ length: stars ?? 5 }).map((_, index) => (
            <FaStar key={index} size={26} color="#416CAE" />
          ))}
        </div>

        <div className="flex justify-center flex-wrap gap-2 px-3 w-full">
          {isLoading ? (
            <span className="text-sm text-gray-400 font-normal">
              Loading tags...
            </span>
          ) : (
            displayTags.map((tag, index) => (
              <div
                key={index}
                className="bg-[#416CAE] text-white rounded-full px-4 py-1 text-md font-semibold flex grow justify-center text-center"
              >
                {tag}
              </div>
            ))
          )}
        </div>
      </main>
    </>
  )
}
