import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '~/components/ui/popover'
import { CiSettings } from 'react-icons/ci'
import { useAuthStore } from '~/features/auth/context/auth.store'
import { useQuery } from '@tanstack/react-query'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'
import { useToggleClosedStatus } from '~/features/establishments/hook/useToggleClosedStatus' // <-- Import the new hook
import DeleteConsent from './delete-consent'
import EditRestaurantDialog from '../components/organisms/edit-restaurant'

export default function OwnerSettings() {
  const { user } = useAuthStore()
  const userId = user?.user_id

  const { data: response, isLoading } = useQuery({
    queryKey: ['ownerRestaurant', userId],
    queryFn: () => EstablishmentService.getByOwnerId(userId!),
    enabled: !!userId,
  })

  // Safely get the restaurant, defaulting to null if not loaded or not found
  const restaurant = response?.data || null

  // Bring in the mutation
  const { mutate: toggleStatus, isPending } = useToggleClosedStatus()

  // Convert the 1/0 from MySQL to a boolean (safe access with ?.)
  const isClosed = !!restaurant?.is_temporarily_closed

  // Optional: Handle loading state
  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className="bg-[#326F33] text-white p-2 rounded-full hover:opacity-80 transition cursor-pointer">
            <CiSettings size={24} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="bg-white text-[#326F33] border-2 border-[#326F33] font-lexend font-bold px-6 py-8 flex flex-col justify-center items-center gap-6">
          <PopoverHeader className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-3xl font-lexend font-bold">Settings</h1>
          </PopoverHeader>

          {/* Only render the settings if the restaurant actually exists */}
          {restaurant ? (
            <section className="font-inter font-semibold text-md flex flex-col gap-4">
              <EditRestaurantDialog
                restaurantId={restaurant.restaurant_id}
                currentName={restaurant.name}
                currentBio={restaurant.description || ''}
              />

              <button
                onClick={() => {
                  toggleStatus({
                    id: restaurant.restaurant_id,
                    isClosed: !isClosed,
                  })
                }}
                disabled={isPending}
                className="px-4 py-2 text-black border-black border rounded-2xl hover:opacity-50 transition duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending
                  ? 'Updating...'
                  : isClosed
                    ? 'Mark "Open"'
                    : 'Mark "Temporarily Closed"'}
              </button>

              <div className="flex flex-col gap-3 font-semibold items-center text-center">
                <p className="text-xs text-[#ED1C24]">
                  Warning: this action cannot be undone!
                </p>
                <DeleteConsent restaurantId={restaurant.restaurant_id} />
              </div>
            </section>
          ) : (
            <p>No restaurant found.</p>
          )}
        </PopoverContent>
      </Popover>
    </>
  )
}
