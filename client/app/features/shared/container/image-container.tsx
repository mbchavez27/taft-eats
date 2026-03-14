import { useAuthStore } from '~/features/auth/context/auth.store'
import { useBookmark } from '~/features/establishments/hook/useBookmark'

interface ImageContainerProps {
  restaurantId?: number
  initialIsBookmarked?: boolean
}

export default function ImageContainer({
  restaurantId,
  initialIsBookmarked,
}: ImageContainerProps) {
  const { isAuthenticated } = useAuthStore()
  const { isBookmarked, toggleBookmark } = useBookmark(
    restaurantId,
    initialIsBookmarked,
  )

  return (
    <main className="relative bg-gray-400 bg-cover bg-center w-full h-56 rounded-xl border-12 border-black">
      {isAuthenticated && restaurantId && (
        <div
          className="absolute -top-3 left-3 cursor-pointer transition-transform hover:scale-105 active:scale-95 z-10"
          onClick={toggleBookmark}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Restaurant'}
        >
          <svg
            width="48"
            height="64"
            viewBox="0 0 32 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            <path
              d="M4 2 V40 L16 30 L28 40 V2 Z"
              fill={isBookmarked ? '#FFD24D' : 'rgba(255, 255, 255, 0.5)'}
              stroke="black"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </main>
  )
}
