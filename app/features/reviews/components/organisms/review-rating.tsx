import { FaStar } from 'react-icons/fa'

export default function ReviewRating() {
  return (
    <main className="flex items-center gap-2 sm:gap-4 font-lexend font-semibold">
      <h1 className="text-lg sm:text-2xl lg:text-4xl">5.0</h1>
      <FaStar className="text-yellow-400 text-lg sm:text-2xl lg:text-4xl" />
    </main>
  )
}
