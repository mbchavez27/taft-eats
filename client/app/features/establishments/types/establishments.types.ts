/**
 * BASE DTO:
 * The standard representation of a Restaurant received from the backend.
 */
export interface RestaurantDto {
  restaurant_id: number
  owner_user_id: number | null
  name: string
  description: string | null
  price_range: '$' | '$$' | '$$$'
  rating: number
  latitude: number | null
  longitude: number | null
  banner_picture_url: string | null
  created_at: string
  is_bookmarked?: boolean | number
}

/**
 * RESPONSE DTO:
 * Used for GET /api/establishments (Infinite Scroll)
 */
export interface PaginatedRestaurantsResponseDto {
  success: boolean
  data: RestaurantDto[]
  nextCursor?: number
}

/**
 * RESPONSE DTO:
 * Used for GET /api/establishments/:id or /api/establishments/owner/:ownerId
 */
export interface SingleRestaurantResponseDto {
  success: boolean
  data: RestaurantDto
}

export interface RestaurantTagsResponseDto {
  success: boolean
  data: {
    tag_id: number
    name: string
    category: string
  }[]
}
