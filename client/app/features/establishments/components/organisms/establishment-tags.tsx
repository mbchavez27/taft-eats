import { FaStar } from 'react-icons/fa'

export default function EstablishmentTags({
  stars,
  numberOfReviews,
  tags,
}: {
  stars?: number
  numberOfReviews?: number
  tags?: string[]
}) {
  return (
    <>
      <main className="text-[#9CB16F] bg-white rounded-lg px-3 py-4 flex flex-col justify-center items-center gap-4 font-bold">
        <div className="text-xl">
          <p>
            {stars ?? 5} ({numberOfReviews ?? 1000}+){' '}
          </p>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: stars ?? 5 }).map((_, index) => (
            <FaStar key={index} size={26} />
          ))}
        </div>
        <div className="flex justify-center flex-wrap gap-2 px-3">
          {(tags ?? ['Mexican', 'Fast Food', 'Affordable']).map(
            (tag, index) => (
              <div
                key={index}
                className="bg-[#326F33] text-white rounded-full px-4 py-1 text-md font-semibold flex grow justify-center"
              >
                {tag}
              </div>
            ),
          )}
        </div>
      </main>
    </>
  )
}
