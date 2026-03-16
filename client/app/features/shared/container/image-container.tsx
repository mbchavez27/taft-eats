import { useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { Camera, Loader2 } from 'lucide-react'
import { useAuthStore } from '~/features/auth/context/auth.store'
import { useBookmark } from '~/features/establishments/hook/useBookmark'

// Make sure these paths match your actual project structure
import { UserService } from '~/features/users/services/user.services'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'

interface ImageContainerProps {
  bannerUrl?: string | null
  initialIsBookmarked?: boolean
  className?: string
  targetId?: number
  onImageUpdated?: () => void
}

export default function ImageContainer({
  bannerUrl,
  initialIsBookmarked,
  className = '',
  targetId,
  onImageUpdated,
}: ImageContainerProps) {
  const { pathname } = useLocation()
  const params = useParams()
  const { isAuthenticated, user, setSession } = useAuthStore()
  const [isUploading, setIsUploading] = useState(false)

  // --- IMAGE URL RESOLUTION ---
  // We get the API URL from your env or default to localhost:3000
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const getFullImageUrl = (path?: string | null) => {
    if (!path) return null
    // If it's already a full URL (Google, S3, etc.), return as is
    if (path.startsWith('http')) return path
    // If it's a relative path from our Express server, prepend the Base URL
    return `${API_BASE_URL}${path}`
  }

  // 1. Context Detection
  const isPublicRestaurantPage =
    pathname.startsWith('/restaurants/') &&
    !pathname.includes('/owner') &&
    params.restaurant_id

  const isOwnerPage = pathname.includes('/restaurants/owner')
  const isUserProfilePage = pathname.startsWith('/user')

  // 2. Bookmark Hook Logic
  const restaurantId = isPublicRestaurantPage
    ? Number(params.restaurant_id)
    : undefined
  const { isBookmarked, toggleBookmark } = useBookmark(
    restaurantId,
    initialIsBookmarked,
  )

  // Determine which raw image path to use
  const rawImageUrl =
    bannerUrl || (isUserProfilePage ? user?.profile_picture_url : null)

  // Final URL that points to the correct server
  const displayImageUrl = getFullImageUrl(rawImageUrl)

  // 3. Upload Handlers
  const handleOwnerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !targetId) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('restaurantBanner', file)

      await EstablishmentService.update(targetId, formData)

      if (onImageUpdated) onImageUpdated()
    } catch (error: any) {
      console.error('Owner Upload Error:', error)
      alert(error.message || 'Failed to upload restaurant banner.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleUserUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await UserService.updateUserProfile(formData)

      // Update global store so the new image path is saved immediately
      setSession(response.user)

      if (onImageUpdated) onImageUpdated()
    } catch (error: any) {
      console.error('User Upload Error:', error)
      alert(error.message || 'Failed to upload profile picture.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  return (
    <main
      className={`relative bg-[#D9D9D9] w-full h-56 rounded-xl border-12 border-black overflow-hidden group ${className}`}
    >
      {/* --- BACKGROUND IMAGE LAYER --- */}
      {displayImageUrl ? (
        <img
          src={displayImageUrl}
          alt="Banner or Profile"
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

      {/* --- LOADING OVERLAY --- */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-30">
          <Loader2 className="text-white w-10 h-10 mb-2 animate-spin" />
          <span className="text-white font-lexend font-bold text-xs uppercase tracking-tight">
            Uploading...
          </span>
        </div>
      )}

      {/* A. CUSTOMER VIEW: Bookmark Ribbon */}
      {isPublicRestaurantPage &&
        isAuthenticated &&
        user?.role === 'user' &&
        !isUploading && (
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
      {isOwnerPage && !isUploading && (
        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
          <Camera className="text-white w-10 h-10 mb-2" />
          <span className="text-white font-lexend font-bold text-xs uppercase tracking-tight text-center px-4">
            Edit Restaurant Banner
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleOwnerUpload}
          />
        </label>
      )}

      {/* C. USER VIEW: Profile Header Upload */}
      {isUserProfilePage && !isUploading && (
        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
          <Camera className="text-white w-10 h-10 mb-2" />
          <span className="text-white font-lexend font-bold text-xs uppercase tracking-tight">
            Edit Profile Cover
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUserUpload}
          />
        </label>
      )}
    </main>
  )
}
