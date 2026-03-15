import { useState } from 'react'
import { MdEdit } from 'react-icons/md'
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
import { useEditReview } from '../../hooks/useEditReview'
import type { ReviewDto } from '../../types/reviews.types'

interface EditReviewDialogProps {
  review: ReviewDto
}

export default function EditReviewDialog({ review }: EditReviewDialogProps) {
  const [body, setBody] = useState(review.body)
  const { editReview, isSubmitting, serverError } = useEditReview(
    review.restaurant_id,
  )

  const handleEdit = () => {
    editReview(review.review_id, body)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="disabled:opacity-50">
          <MdEdit size={24} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-lg border-2 border-black drop-shadow-xl p-6 sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="font-lexend text-3xl font-bold">
            Edit Review
          </DialogTitle>
          <DialogDescription className="font-lexend text-lg text-gray-700">
            Update the body of your review below.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-3 border-2 border-black rounded-lg min-h-[120px] font-lexend focus:outline-none focus:ring-2 focus:ring-[#416CAE]"
            placeholder="Write your review here..."
          />
          {serverError && (
            <p className="text-red-500 text-sm mt-2">{serverError}</p>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-4 mt-6">
          <DialogClose asChild>
            <button className="font-inter font-bold text-black bg-white border-2 border-black text-xl px-4 py-1 rounded-2xl hover:bg-gray-100 transition-colors drop-shadow-md">
              Cancel
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button
              onClick={handleEdit}
              disabled={isSubmitting || body.length < 20}
              className="font-inter font-bold text-white bg-[#416CAE] border-2 border-black text-xl px-4 py-1 rounded-2xl hover:bg-[#345a96] transition-colors drop-shadow-md disabled:bg-gray-400"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
