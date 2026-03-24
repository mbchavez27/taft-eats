import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router'
import { IoIosSearch } from 'react-icons/io'
import { FiArrowUpRight } from 'react-icons/fi'
import { useSearchRestaurants } from '~/features/establishments/hook/useSearchRestaurant'
import type { RestaurantDto } from '~/features/establishments/types/establishments.types'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

export default function SearchField({ placeholder }: { placeholder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const { results, isLoading } = useSearchRestaurants(query)

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const getFullImageUrl = (path?: string | null) => {
    if (!path) return undefined
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}${path}`
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchClick = () => {
    inputRef.current?.focus()
    if (query.trim().length > 0) setIsOpen(true)
  }

  const showDropdown = isOpen && query.trim().length > 0

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-[400px] font-inter z-50"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        className={`w-full border-3 border-[#326F33] text-sm px-4 py-2 pr-16 focus:outline-none transition-all bg-white relative z-10 ${
          showDropdown ? 'rounded-t-xl border-b-0' : 'rounded-xl'
        }`}
      />

      <button
        onClick={handleSearchClick}
        className={`absolute right-0 top-0 h-full bg-[#326F33] text-white px-3 flex items-center justify-center border-3 border-[#326F33] z-20 transition-all ${
          showDropdown ? 'rounded-tr-xl rounded-br-none' : 'rounded-xl'
        }`}
      >
        <IoIosSearch size={20} />
      </button>

      {showDropdown && (
        <div className="absolute top-[calc(100%-3px)] left-0 w-full bg-white border-3 border-[#326F33] border-t-0 rounded-b-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500 animate-pulse">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No restaurants found.
            </div>
          ) : (
            <div className="flex flex-col py-2">
              {results.map((restaurant: RestaurantDto, index: number) => {
                // Get the first letter for the fallback avatar
                const fallbackInitial = restaurant.name
                  ? restaurant.name.charAt(0).toUpperCase()
                  : 'R'

                const banner_picture_url = getFullImageUrl(
                  restaurant.banner_picture_url,
                )

                return (
                  <Link
                    key={restaurant.restaurant_id}
                    to={`/restaurants/${restaurant.restaurant_id}`}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors relative"
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-[#326F33] opacity-0 group-hover:opacity-100 transition-opacity ${index === 0 ? 'opacity-100' : ''}`}
                    />

                    {/* Replaced <img> with Shadcn Avatar */}
                    <Avatar className="w-10 h-10 border border-gray-200">
                      <AvatarImage
                        src={banner_picture_url || undefined}
                        alt={restaurant.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-green-50 text-[#326F33] font-semibold text-sm">
                        {fallbackInitial}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col flex-1 truncate">
                      <span className="font-medium text-black text-sm truncate font-inter">
                        {restaurant.name}
                      </span>
                    </div>

                    <FiArrowUpRight
                      size={18}
                      className="text-gray-400 group-hover:text-black transition-colors"
                    />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
