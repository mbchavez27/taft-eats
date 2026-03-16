import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EstablishmentService } from '../services/establishments.services'
import { useNavigate } from 'react-router'

export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (restaurantId: number) =>
      EstablishmentService.delete(restaurantId),
    onSuccess: () => {
      // Clear cache so the restaurant vanishes everywhere
      queryClient.invalidateQueries({ queryKey: ['establishments'] })
      queryClient.invalidateQueries({ queryKey: ['userBookmarks'] })
      queryClient.invalidateQueries({ queryKey: ['ownerRestaurant'] })

      // Redirect back to home/feed
      navigate('/')
    },
    onError: (error) => {
      console.error('Failed to delete restaurant:', error)
      alert('Failed to delete establishment. Please try again.')
    },
  })
}
