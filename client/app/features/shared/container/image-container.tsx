import { useLocation, useParams } from 'react-router'
import { Camera } from 'lucide-react'
import { useAuthStore } from '~/features/auth/context/auth.store'
import { useBookmark } from '~/features/establishments/hook/useBookmark'

/**
 * @fileoverview Adaptive Image Container that detects context via Routes.
 * - /restaurants/:id -> Bookmark Ribbon
 * - /restaurants/owner -> Owner Edit Tools
 * - /user -> User Profile Tools
 */

interface ImageContainerProps {
  bannerUrl?: string | null
  initialIsBookmarked?: boolean
  className?: string
}

export default function ImageContainer({
  bannerUrl,
  initialIsBookmarked,
  className = '',
}: ImageContainerProps) {
  const { pathname } = useLocation()
  const params = useParams()
  const { isAuthenticated, user } = useAuthStore()

  // 1. Context Detection based on RouteConfig
  // Matches route(':restaurant_id', './routes/restaurants/index.tsx')
  const isPublicRestaurantPage =
    pathname.startsWith('/restaurants/') &&
    !pathname.includes('/owner') &&
    params.restaurant_id

  // Matches route('owner', './routes/restaurants/owner/index.tsx')
  const isOwnerPage = pathname.includes('/restaurants/owner')

  // Matches route('/', './routes/user-page/index.tsx')
  const isUserProfilePage = pathname.startsWith('/user')

  // 2. Bookmark Hook Logic
  // Only extract ID and run sync if on the public details page
  const restaurantId = isPublicRestaurantPage
    ? Number(params.restaurant_id)
    : undefined
  const { isBookmarked, toggleBookmark } = useBookmark(
    restaurantId,
    initialIsBookmarked,
  )

  return (
    <main
      className={`relative bg-[#D9D9D9] w-full h-56 rounded-xl border-12 border-black overflow-hidden group ${className}`}
    >
      {/* --- BACKGROUND IMAGE LAYER --- */}
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 gap-2">
          <div className="bg-gray-500 w-12 h-12 rounded-full opacity-30" />
          {(isOwnerPage || isUserProfilePage) && (
            <span className="text-black/40 font-lexend text-[10px] uppercase font-bold tracking-tighter">
              No Image Set
            </span>
          )}
        </div>
      )}

      {/* --- CONTEXTUAL OVERLAYS --- */}

      {/* A. CUSTOMER VIEW: Bookmark Ribbon */}
      {isPublicRestaurantPage && isAuthenticated && user?.role === 'user' && (
        <div
          className="absolute -top-3 left-3 cursor-pointer transition-transform hover:scale-105 active:scale-95 z-10"
          onClick={(e) => {
            e.preventDefault()
            toggleBookmark()
          }}
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

      {/* B. OWNER VIEW: Restaurant Image Upload */}
      {isOwnerPage && (
        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
          <Camera className="text-white w-10 h-10 mb-2" />
          <span className="text-white font-lexend font-bold text-xs uppercase tracking-tight text-center px-4">
            Edit Restaurant Banner
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file)
                console.log('Handling Restaurant Upload for file:', file.name)
            }}
          />
        </label>
      )}

      {/* C. USER VIEW: Profile Header Upload */}
      {isUserProfilePage && (
        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
          <Camera className="text-white w-10 h-10 mb-2" />
          <span className="text-white font-lexend font-bold text-xs uppercase tracking-tight">
            Edit Profile Cover
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file)
                console.log('Handling User Profile Upload for file:', file.name)
            }}
          />
        </label>
      )}
    </main>
  )
}
