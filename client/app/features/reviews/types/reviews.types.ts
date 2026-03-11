export interface TagInputDTO {
  id: number | string | bigint;
  label: string;
  category?: "tag" | "cuisine" | "food";
}

export interface CreateReviewDTO {
  restaurant_id: number;
  rating: number;
  body: string;
  price_range?: "$" | "$$" | "$$$";
  tags?: TagInputDTO[];
}

export type ReactionType = "like" | "dislike" | null;

export interface ReviewDto {
  review_id: number;
  restaurant_id: number;
  user_id: number;
  rating: number;
  body: string;
  is_edited: boolean;
  created_at: string;
  username: string;
  profile_picture_url: string | null;

  like_count: number;
  dislike_count: number;
  user_vote: ReactionType;
}

export interface PaginatedReviewsResponseDto {
  success: boolean;
  data: ReviewDto[];
  count: number;
  nextCursor?: number;
}

export interface ReviewResponseDTO {
  success: boolean;
  reviewId: number;
  message: string;
}

export interface VoteResponseDTO {
  success: boolean;
  message: string;
}
