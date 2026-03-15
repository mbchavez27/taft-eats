import type {
  PaginatedReviewsResponseDto,
  CreateReviewDTO,
  ReviewResponseDTO,
  VoteResponseDTO,
} from '../types/reviews.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const ReviewService = {
  getByRestaurantId: async ({
    restaurantId,
    pageParam = undefined,
    sort = 'newest',
  }: {
    restaurantId: number
    pageParam?: number
    sort?: 'newest' | 'oldest' | 1 | 2 | 3 | 4 | 5 | string | number
  }): Promise<PaginatedReviewsResponseDto> => {
    let url = `${API_BASE_URL}/api/reviews/restaurant/${restaurantId}?limit=10`

    if (pageParam !== undefined) {
      url += `&lastId=${pageParam}`
    }

    if (typeof sort === 'number' || (typeof sort === 'string' && /^[1-5]$/.test(sort))) {
      url += `&rating=${sort}`
    } else if (typeof sort === 'string') {
      url += `&sort=${sort}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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

  create: async (reviewData: CreateReviewDTO): Promise<ReviewResponseDTO> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reviewData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create review')
    }

    return data as ReviewResponseDTO
  },

  /**
   * Fetches a paginated list of reviews created by a specific user.
   * @param {Object} params - The parameters for the request.
   * @param {number} params.userId - The ID of the user whose reviews are being fetched.
   * @param {number} [params.pageParam] - Optional. The ID of the last review for cursor pagination.
   * @returns {Promise<PaginatedReviewsResponseDto>} A promise resolving to the paginated reviews.
   */
  getByUserId: async ({
    userId,
    pageParam = undefined,
  }: {
    userId: number
    pageParam?: number
  }): Promise<PaginatedReviewsResponseDto> => {
    let url = `${API_BASE_URL}/api/reviews/user/${userId}?limit=10`

    if (pageParam !== undefined) {
      url += `&lastId=${pageParam}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user reviews')
    }

    // Set up the next cursor for infinite scrolling/pagination
    if (data.data && data.data.length > 0) {
      data.nextCursor = data.data[data.data.length - 1].review_id
    } else {
      data.nextCursor = undefined
    }

    return data as PaginatedReviewsResponseDto
  },

  /**
   * Submits a vote (like/dislike/none) for a specific review.
   */
  voteReview: async (
    reviewId: number,
    voteType: 'like' | 'dislike' | 'none',
  ): Promise<VoteResponseDTO> => {
    const response = await fetch(
      `${API_BASE_URL}/api/reviews/${reviewId}/vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ voteType }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit vote')
    }

    return data as VoteResponseDTO
  },

  updateBody: async (reviewId: number, body: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ body }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to update review')
  },

  delete: async (reviewId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to delete review')
  },
}
