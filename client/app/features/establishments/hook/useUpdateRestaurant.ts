// ~/features/establishments/hook/useUpdateRestaurant.ts
import { useState } from 'react'
import { EstablishmentService } from '../services/establishments.services'

export function useUpdateRestaurant() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateRestaurant = async (
    id: number,
    data: { name?: string; description?: string; banner_picture_url?: string },
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      await EstablishmentService.update(id, data)
      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Failed to update')
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  return { updateRestaurant, isLoading, error }
}
