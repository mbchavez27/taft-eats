import type { ReviewDto, ReviewResponseDTO } from '../../types/reviews.types'
import ReactionCounter from './reaction-counter'
import ReviewContent from './review-content'
import ReviewRating from './review-rating'
import UserDetails from './user-details'
import { MdEdit, MdDelete } from 'react-icons/md'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '~/components/ui/dialog'

interface SingleReviewProps {
  is_owner?: boolean
  is_user?: boolean
  onOpenForms?: () => void
  review: ReviewDto
}

export default function SingleReview({
  is_owner,
  is_user,
  onOpenForms,
  review,
}: SingleReviewProps) {
  console.log(review)

  const handleDelete = () => {
    console.log('Deleting review:', review.review_id)
    // Add your delete API call and state invalidation here later
  }

  return (
    <main
      className="
        bg-white rounded-lg border-2 border-black drop-shadow-xl
        px-6 py-4
        flex flex-col gap-4
        lg:flex-row lg:items-center lg:justify-between
      "
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12">
        <UserDetails review={review} />
        <ReviewContent review={review} />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-6 lg:gap-12">
        <ReviewRating review={review.rating} />
        {is_user ? (
          <>
            <div className="flex gap-6">
              <button>
                <MdEdit size={24} />
              </button>

              {/* DELETE DIALOG */}
              <Dialog>
                <DialogTrigger asChild>
                  <button>
                    <MdDelete size={24} />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white rounded-lg border-2 border-black drop-shadow-xl p-6 sm:max-w-md">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="font-lexend text-3xl font-bold">
                      Delete Review
                    </DialogTitle>
                    <DialogDescription className="font-lexend text-lg text-gray-700">
                      Are you sure you want to delete this review? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-end gap-4 mt-6">
                    <DialogClose asChild>
                      <button className="font-inter font-bold text-black bg-white border-2 border-black text-xl px-4 py-1 rounded-2xl hover:bg-gray-100 transition-colors drop-shadow-md">
                        Cancel
                      </button>
                    </DialogClose>
                    <DialogClose asChild>
                      <button
                        onClick={handleDelete}
                        className="font-inter font-bold text-white bg-red-500 border-2 border-black text-xl px-4 py-1 rounded-2xl hover:bg-red-600 transition-colors drop-shadow-md"
                      >
                        Delete
                      </button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : is_owner ? (
          <>
            <button
              onClick={onOpenForms}
              className="font-inter font-bold text-white bg-[#416CAE] text-2xl px-3 py-1 rounded-2xl hover:bg-[#345a96] transition-colors"
            >
              Reply
            </button>
          </>
        ) : (
          <>
            <ReactionCounter
              reviewId={review.review_id}
              initialReaction={review.user_vote} // Comes from the updated DB query
              initialLikes={review.like_count} // Comes from the updated DB query
              initialDislikes={review.dislike_count} // Comes from the updated DB query
            />
          </>
        )}
      </div>
    </main>
  )
}
