import { FaRegStar, FaStar } from 'react-icons/fa'

export default function EstablishmentRating({
  rating = 0,
}: {
  rating?: number
}) {
  return (
    <>
      <div className="bg-white flex justify-center rounded-full py-1 px-3 w-36 text-[#FFD24D] gap-2 drop-shadow-2xl">
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index}>
            {index < rating ? (
              <FaStar size={18} color="#FFD24D" />
            ) : (
              <FaRegStar size={18} color="#FFD24D" />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
