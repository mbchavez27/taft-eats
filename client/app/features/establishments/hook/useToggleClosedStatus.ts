import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EstablishmentService } from '../services/establishments.services'

export const useToggleClosedStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isClosed }: { id: number; isClosed: boolean }) =>
      EstablishmentService.toggleClosedStatus(id, isClosed),
    onSuccess: () => {
      // Invalidate both the owner's fetch and the general list so it updates everywhere
      queryClient.invalidateQueries({ queryKey: ['ownerRestaurant'] })
      queryClient.invalidateQueries({ queryKey: ['establishments'] })
    },
    onError: (error) => {
      console.error('Failed to update status:', error)
      alert('Failed to update status. Please try again.')
    },
  })
}
