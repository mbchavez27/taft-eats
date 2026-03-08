/**
 * @fileoverview Data Transfer Objects for Reviews.
 * @module dtos/review-dto
 */

/**
 * Represents the structure of a tag sent from the frontend when creating a review.
 * @interface TagInputDTO
 */
export interface TagInputDTO {
  id: number | string | bigint
  label: string
  category?: 'tag' | 'cuisine' | 'food'
}

/**
 * Data Transfer Object for creating a new review.
 * @interface CreateReviewDTO
 */
export interface CreateReviewDTO {
  restaurant_id: number
  rating: number
  body: string
  price_range?: '$' | '$$' | '$$$'
  tags?: TagInputDTO[]
}

/**
 * Standard response representation after a review is created.
 * @interface ReviewResponseDTO
 */
export interface ReviewResponseDTO {
  success: boolean
  reviewId: number
  message: string
}

/**
 * Represents a single review returned to the frontend.
 * @interface ReviewDto
 */
export interface ReviewDto {
  review_id: number
  restaurant_id: number
  user_id: number
  rating: number
  body: string
  is_edited: boolean
  created_at: string
  // Joined from the Users table for the frontend UI
  username: string
  profile_picture_url: string | null
}

/**
 * Paginated response for fetching reviews.
 * @interface PaginatedReviewsResponseDto
 */
export interface PaginatedReviewsResponseDto {
  success: boolean
  data: ReviewDto[]
  count: number
  nextCursor?: number
}
