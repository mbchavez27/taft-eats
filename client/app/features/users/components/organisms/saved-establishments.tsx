import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import type { RestaurantDto } from '~/features/establishments/types/establishments.types'

interface SavedEstablishmentsProps {
  items: RestaurantDto[]
}

export default function SavedEstablishments({
  items,
}: SavedEstablishmentsProps) {
  const visible = 3
  const extraCount = items.length - visible

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const getFullImageUrl = (path?: string | null) => {
    if (!path) return undefined
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}${path}`
  }

  return (
    <main className="bg-white rounded-3xl px-10 py-8 flex flex-col w-full h-full border-2 border-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
      <h1 className="font-climate text-xl mb-6 uppercase">
        Saved Establishments
      </h1>

      <div className="flex flex-row flex-wrap gap-5 flex-1 justify-center items-center">
        {items.slice(0, visible).map((establishment) => {
          const displayImageUrl = getFullImageUrl(
            establishment.banner_picture_url,
          )

          return (
            <Avatar
              key={establishment.restaurant_id}
              className="w-16 h-16 border-2 border-black"
            >
              <AvatarImage src={displayImageUrl} className="object-cover" />
              <AvatarFallback className="font-lexend font-bold bg-gray-100 text-black flex items-center justify-center w-full h-full">
                {establishment.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )
        })}

        {extraCount > 0 && (
          <div className="w-12 h-12 rounded-full bg-gray-300 text-black border-2 border-black flex items-center justify-center font-lexend font-bold text-sm">
            +{extraCount}
          </div>
        )}

        {items.length === 0 && (
          <p className="font-lexend text-gray-400 italic text-sm">
            No saved places yet.
          </p>
        )}
      </div>
    </main>
  )
}
