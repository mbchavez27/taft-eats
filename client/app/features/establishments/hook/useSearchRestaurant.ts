// src/hooks/use-search-restaurants.ts
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { EstablishmentService } from '../services/establishments.services'
import type { RestaurantDto } from '../types/establishments.types'

// Utility hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Main search hook
export const useSearchRestaurants = (query: string, limit: number = 5) => {
  const debouncedQuery = useDebounce(query, 300)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['searchRestaurants', debouncedQuery, limit],
    queryFn: () => EstablishmentService.searchByName(debouncedQuery, limit),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  })

  // Extract the typed data directly
  const results: RestaurantDto[] = data?.data || []

  return {
    results,
    isLoading,
    isError,
    error,
  }
}
