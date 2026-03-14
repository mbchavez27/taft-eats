/**
 * BASE DTO:
 * The standard representation of a Restaurant sent to the frontend.
 */
export interface RestaurantDto {
  restaurant_id: number
  owner_user_id: number | null
  name: string
  description: string | null
  price_range: '$' | '$$' | '$$$' | '$$$$'
  rating: number
  latitude: number | null
  longitude: number | null
  banner_picture_url: string | null
  created_at: string
  is_bookmarked?: boolean | number
}

/**
 * RESPONSE DTOs:
 * What the backend sends back to the frontend.
 */

// Used for GET /api/establishments (Your Infinite Scroll)
export interface PaginatedRestaurantsResponseDto {
  success: boolean
  data: RestaurantDto[]
  nextCursor?: number
}

// Used for GET /api/establishments/:id or /owner/:ownerId
export interface SingleRestaurantResponseDto {
  success: boolean
  data: RestaurantDto
}
