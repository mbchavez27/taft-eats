import type {
  PaginatedRestaurantsResponseDto,
  RestaurantTagsResponseDto,
  SingleRestaurantResponseDto,
} from '../types/establishments.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const EstablishmentService = {
  getAll: async ({
    pageParam = undefined,
    tags = [],
    priceRanges = [],
    rating, 
  }: {
    pageParam?: number
    tags?: string[]
    priceRanges?: string[]
    rating?: number 
  }): Promise<PaginatedRestaurantsResponseDto> => {
    const urlParams = new URLSearchParams()

    urlParams.append('limit', '10')
    if (pageParam !== undefined) {
      urlParams.append('lastId', pageParam.toString())
    }

    tags.forEach((tag) => urlParams.append('tags', tag))
    priceRanges.forEach((price) => urlParams.append('priceRanges', price))

    if (rating !== undefined && rating > 0) {
      urlParams.append('rating', rating.toString())
    }

    const url = `${API_BASE_URL}/api/establishments?${urlParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    const data: PaginatedRestaurantsResponseDto = await response.json()
    if (!response.ok) throw new Error((data as any).error || 'Failed to fetch establishments')

    return data
  },

  getById: async (id: number): Promise<SingleRestaurantResponseDto> => {
    const response = await fetch(`${API_BASE_URL}/api/establishments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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
        credentials: 'include',
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
        credentials: 'include',
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

  getBookmarks: async ({
    pageParam = undefined,
  }: {
    pageParam?: number
  } = {}): Promise<PaginatedRestaurantsResponseDto> => {
    const urlParams = new URLSearchParams()
    urlParams.append('limit', '10')

    if (pageParam !== undefined) {
      urlParams.append('lastId', pageParam.toString())
    }

    const response = await fetch(
      `${API_BASE_URL}/api/establishments/user/bookmarks?${urlParams.toString()}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    )

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch bookmarks')
    return data
  },

  bookmark: async (restaurantId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/establishments/${restaurantId}/bookmark`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    )

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to bookmark restaurant')
    }
  },

  unbookmark: async (restaurantId: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/establishments/${restaurantId}/bookmark`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    )

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to unbookmark restaurant')
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/establishments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to delete establishment')
    }
  },

  searchByName: async (
    query: string,
    limit: number = 5,
  ): Promise<PaginatedRestaurantsResponseDto> => {
    const urlParams = new URLSearchParams()
    urlParams.append('q', query)
    urlParams.append('limit', limit.toString())

    const response = await fetch(
      `${API_BASE_URL}/api/establishments/search?${urlParams.toString()}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    )

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to search establishments')
    }

    return data as PaginatedRestaurantsResponseDto
  },

  toggleClosedStatus: async (id: number, isClosed: boolean): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/establishments/${id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isClosed }),
      },
    )

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to update establishment status')
    }
  },

  update: async (
    id: number,
    data: { name?: string; description?: string; banner_picture_url?: string },
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/establishments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update establishment')
    }
  },

  updateAsAdmin: async (
    id: number,
    data: {
      name?: string
      description?: string
      price_range?: string
      location?: string
    },
  ): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/establishments/admin/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || 'Failed to update establishment as admin',
      )
    }
  },

  deleteAsAdmin: async (id: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/establishments/admin/${id}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    )

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to delete establishment as admin')
    }
  },
}
