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
  create: async (reviewData: CreateReviewDTO): Promise<ReviewResponseDTO> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Automatically sends session cookies
      body: JSON.stringify(reviewData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create review')
    }

    return data as ReviewResponseDTO
  },
}
