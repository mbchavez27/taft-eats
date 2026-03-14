import { MdDelete } from 'react-icons/md'
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
import { useDeleteReview } from '../../hooks/useDeleteReview'

interface DeleteReviewDialogProps {
  reviewId: number
  restaurantId: number
}

export default function DeleteReviewDialog({
  reviewId,
  restaurantId,
}: DeleteReviewDialogProps) {
  const { deleteReview, isDeleting } = useDeleteReview(restaurantId)

  const handleDelete = () => {
    deleteReview(reviewId)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button disabled={isDeleting} className="disabled:opacity-50">
          <MdDelete size={24} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-lg border-2 border-black drop-shadow-xl p-6 sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="font-lexend text-3xl font-bold">
            Delete Review
          </DialogTitle>
          <DialogDescription className="font-lexend text-lg text-gray-700">
            Are you sure you want to delete this review? This action cannot be
            undone.
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
  )
}
