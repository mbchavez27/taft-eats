import { useQuery } from '@tanstack/react-query'
import EstablishmentsCard from '~/features/establishments/components/organisms/establishment-card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useMapStore } from '../store/map.store'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'
import { X } from 'lucide-react'

export default function NearbyRestaurants() {
  const { selectedLocation, selectedLandmarkName, clearLocation } =
    useMapStore()

  const { data, isLoading } = useQuery({
    queryKey: ['nearby', selectedLocation],
    queryFn: () => {
      if (!selectedLocation) return null
      // Call the 500m radius endpoint
      return EstablishmentService.getNearby(
        selectedLocation[0],
        selectedLocation[1],
        0.5,
      )
    },
    enabled: !!selectedLocation, // Only fetch if a location is picked
  })

  return (
    <main className="bg-[#FFFF] border-10 rounded-xl border-[#416CAE] font-lexend text-[#326F33] py-4 px-8 flex flex-col gap-6 shadow-xl">
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold text-2xl text-black">
          {selectedLandmarkName
            ? `Near ${selectedLandmarkName}`
            : 'Select a Landmark'}
        </h1>
        {selectedLocation && (
          <button
            onClick={clearLocation}
            className="flex items-center gap-1 text-xs text-red-500 hover:underline font-bold"
          >
            <X size={14} /> Clear Filter
          </button>
        )}
      </div>

      <ScrollArea className="h-[600px]">
        <div className="flex flex-col gap-4 pr-4">
          {!selectedLocation && (
            <p className="text-gray-400 italic text-center py-10">
              Click a green marker on the map to see nearby eats!
            </p>
          )}

          {isLoading && (
            <p className="text-center animate-pulse">Finding food...</p>
          )}

          {data?.data.map((establishment) => (
            <EstablishmentsCard
              key={establishment.restaurant_id}
              id={establishment.restaurant_id}
              name={establishment.name}
              rating={establishment.rating}
              banner_url={establishment.banner_picture_url ?? undefined}
              show_ratings={true}
            />
          ))}

          {selectedLocation && data?.data.length === 0 && (
            <p className="text-gray-400 text-center">
              No establishments found within 500m.
            </p>
          )}
        </div>
      </ScrollArea>
    </main>
  )
}
