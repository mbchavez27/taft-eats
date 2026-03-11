import type {
  PaginatedReviewsResponseDto,
  CreateReviewDTO,
  ReviewResponseDTO,
  VoteResponseDTO,
} from "../types/reviews.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ReviewService = {
  getByRestaurantId: async ({
    restaurantId,
    pageParam = undefined,
  }: {
    restaurantId: number;
    pageParam?: number;
  }): Promise<PaginatedReviewsResponseDto> => {
    let url = `${API_BASE_URL}/api/reviews/restaurant/${restaurantId}?limit=10`;

    if (pageParam !== undefined) {
      url += `&lastId=${pageParam}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Include credentials if you want the backend to know who is requesting
      // so it can return their specific 'user_vote' status
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch reviews");
    }

    if (data.data && data.data.length > 0) {
      data.nextCursor = data.data[data.data.length - 1].review_id;
    } else {
      data.nextCursor = undefined;
    }

    return data as PaginatedReviewsResponseDto;
  },

  create: async (reviewData: CreateReviewDTO): Promise<ReviewResponseDTO> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create review");
    }

    return data as ReviewResponseDTO;
  },

  /**
   * Submits a vote (like/dislike/none) for a specific review.
   */
  voteReview: async (
    reviewId: number,
    voteType: "like" | "dislike" | "none",
  ): Promise<VoteResponseDTO> => {
    const response = await fetch(
      `${API_BASE_URL}/api/reviews/${reviewId}/vote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ voteType }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit vote");
    }

    return data as VoteResponseDTO;
  },
};
