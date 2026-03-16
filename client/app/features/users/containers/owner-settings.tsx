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
import DeleteConsent from './delete-consent'

export default function OwnerSettings() {
  // 1. Get the current logged-in user
  const { user } = useAuthStore()

  // Handle both possible ID properties depending on your DTO
  const userId = user?.user_id

  // 2. Fetch their restaurant directly using React Query
  const { data: response } = useQuery({
    queryKey: ['ownerRestaurant', userId],
    queryFn: () => EstablishmentService.getByOwnerId(userId!),
    enabled: !!userId, // Only run if we actually have a user ID
  })

  // 3. Extract the restaurant data from the API response
  const restaurant = response?.data

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
          <section className="font-inter font-semibold text-md flex flex-col gap-4">
            <button className="px-4 py-2 text-black border-black border rounded-2xl hover:opacity-50 transition duration-100">
              Edit Establishment Banner
            </button>
            <button className="px-4 py-2 text-black border-black border rounded-2xl hover:opacity-50 transition duration-100">
              Mark "Temporarily Closed"
            </button>
            <div className="flex flex-col gap-3 font-semibold items-center text-center">
              <p className="text-xs text-[#ED1C24]">
                Warning: this action cannot be undone!
              </p>

              {/* 4. Pass the fetched ID safely. Use optional chaining just in case */}
              <DeleteConsent restaurantId={restaurant?.restaurant_id} />
            </div>
          </section>
        </PopoverContent>
      </Popover>
    </>
  )
}
