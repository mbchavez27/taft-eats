import type { ReviewDto, ReviewResponseDTO } from '../../types/reviews.types'
import DeleteReviewDialog from './delete-review-dialog'
import EditReviewDialog from './edit-review-dialog'
import ReactionCounter from './reaction-counter'
import ReviewContent from './review-content'
import ReviewRating from './review-rating'
import UserDetails from './user-details'

interface SingleReviewProps {
  is_owner?: boolean
  is_user?: boolean
  onOpenForms?: (reviewId: number) => void
  review: ReviewDto
}

export default function SingleReview({
  is_owner,
  is_user,
  onOpenForms,
  review,
}: SingleReviewProps) {
  const hasReply = !!review.reply_body
  return (
    <main
      className="
        bg-white rounded-lg border-2 border-black drop-shadow-xl
        px-6 py-4
        flex flex-col gap-4
        lg:flex-row lg:items-center lg:justify-between
      "
    >
      {/* LEFT SIDE WRAPPER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12 lg:flex-1">
        <div className="lg:shrink-0">
          <UserDetails review={review} />
        </div>

        {/* MIDDLE SECTION: Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center gap-1">
          <ReviewContent review={review} reply={review.reply_body} />
          {hasReply && (
            <span className="text-sm font-lexend text-gray-500 italic">
              (Restaurant Owner has responded to the review:)
            </span>
          )}
          {!!review.is_edited && (
            <span className="text-sm font-lexend text-gray-500 italic">
              (Edited)
            </span>
          )}
        </div>
      </div>

      {/* RIGHT SIDE WRAPPER */}
      <div className="flex justify-between items-center gap-6 lg:gap-12 shrink-0 lg:ml-6">
        <ReviewRating review={review.rating} />
        {is_user ? (
          <div className="flex gap-6">
            <EditReviewDialog review={review} />
            <DeleteReviewDialog
              reviewId={review.review_id}
              restaurantId={review.restaurant_id}
            />
          </div>
        ) : is_owner ? (
          !hasReply ? (
            <button
              onClick={() => onOpenForms?.(review.review_id)}
              className="font-inter font-bold text-white bg-[#416CAE] text-2xl px-3 py-1 rounded-2xl hover:bg-[#345a96] transition-colors"
            >
              Reply
            </button>
          ) : (
            <span className="text-sm text-gray-400 italic">Replied</span>
          )
        ) : (
          <ReactionCounter
            reviewId={review.review_id}
            initialReaction={review.user_vote}
            initialLikes={review.like_count}
            initialDislikes={review.dislike_count}
          />
        )}
      </div>
    </main>
  )
}
