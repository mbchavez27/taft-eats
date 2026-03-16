import { useQuery } from '@tanstack/react-query'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'
import { useAuthStore } from '~/features/auth/context/auth.store'

export const useOwnerRestaurant = () => {
  const { user } = useAuthStore()

  // Assumes your user object has an 'id' property.
  // Adjust to user?.userId or user?._id if your schema differs.
  const ownerId = user?.user_id

  return useQuery({
    queryKey: ['owner-establishment', ownerId],
    queryFn: () => EstablishmentService.getByOwnerId(ownerId as number),
    enabled: !!ownerId, // Only run the query if we have an ownerId
  })
}
