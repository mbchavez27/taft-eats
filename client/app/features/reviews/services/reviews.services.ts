import type {
  PaginatedReviewsResponseDto,
  CreateReviewDTO,
  ReviewResponseDTO,
} from '../types/reviews.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const ReviewService = {
  /**
   * Fetches a paginated list of reviews for a specific restaurant.
   */
  getByRestaurantId: async ({
    restaurantId,
    pageParam = undefined,
  }: {
    restaurantId: number
    pageParam?: number
  }): Promise<PaginatedReviewsResponseDto> => {
    let url = `${API_BASE_URL}/api/reviews/restaurant/${restaurantId}?limit=10`

    if (pageParam !== undefined) {
      url += `&lastId=${pageParam}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch reviews')
    }

    // Automatically calculate the nextCursor for TanStack Query
    // We use the ID of the last item in the array as the cursor for the next fetch
    if (data.data && data.data.length > 0) {
      data.nextCursor = data.data[data.data.length - 1].review_id
    } else {
      data.nextCursor = undefined
    }

    return data as PaginatedReviewsResponseDto
  },

  /**
   * Creates a new review.
   */
  create: async (
    reviewData: CreateReviewDTO,
    token: string, // Pass your user auth token here
  ): Promise<ReviewResponseDTO> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Assumes Bearer token authentication
      },
      body: JSON.stringify(reviewData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create review')
    }

    return data as ReviewResponseDTO
  },
}
