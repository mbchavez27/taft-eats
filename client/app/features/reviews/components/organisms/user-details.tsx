import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import type { ReviewDto } from '../../types/reviews.types'

export default function UserDetails({ review }: { review: ReviewDto }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const getFullImageUrl = (path?: string | null) => {
    if (!path) return undefined
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}${path}`
  }

  const displayImageUrl = getFullImageUrl(review.profile_picture_url)

  return (
    <main className="flex font-lexend items-center gap-3">
      <Avatar className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16">
        <AvatarImage src={displayImageUrl} className="object-cover" />
        <AvatarFallback className="font-bold">
          {review.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div>
        <h1 className="text-base sm:text-lg lg:text-xl">{review.username}</h1>
        <p className="text-sm sm:text-base lg:text-lg opacity-50">
          {new Date(review.created_at).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
          })}
        </p>
      </div>
    </main>
  )
}
