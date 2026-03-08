import type {
  PaginatedRestaurantsResponseDto,
  RestaurantTagsResponseDto,
  SingleRestaurantResponseDto,
} from '../types/establishments.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const EstablishmentService = {
  getAll: async ({
    pageParam = undefined,
  }: {
    pageParam?: number
  }): Promise<PaginatedRestaurantsResponseDto> => {
    let url = `${API_BASE_URL}/api/establishments?limit=10`

    if (pageParam !== undefined) {
      url += `&lastId=${pageParam}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data: PaginatedRestaurantsResponseDto = await response.json()

    if (!response.ok) {
      throw new Error((data as any).error || 'Failed to fetch establishments')
    }

    return data
  },

  getById: async (id: number): Promise<SingleRestaurantResponseDto> => {
    const response = await fetch(`${API_BASE_URL}/api/establishments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data: SingleRestaurantResponseDto = await response.json()

    if (!response.ok) {
      throw new Error(
        (data as any).error || 'Failed to fetch establishment details',
      )
    }

    return data
  },

  getByOwnerId: async (
    ownerId: number,
  ): Promise<SingleRestaurantResponseDto> => {
    const response = await fetch(
      `${API_BASE_URL}/api/establishments/owner/${ownerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data: SingleRestaurantResponseDto = await response.json()

    if (!response.ok) {
      throw new Error(
        (data as any).error || "Failed to fetch owner's establishment",
      )
    }

    return data
  },

  getTagsByRestaurantId: async (
    id: number,
  ): Promise<RestaurantTagsResponseDto> => {
    const response = await fetch(
      `${API_BASE_URL}/api/establishments/${id}/tags`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data: RestaurantTagsResponseDto = await response.json()

    if (!response.ok) {
      throw new Error(
        (data as any).error || 'Failed to fetch establishment tags',
      )
    }

    return data
  },
}
