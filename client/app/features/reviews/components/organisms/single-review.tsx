import ReactionCounter from './reaction-counter'
import ReviewContent from './review-content'
import ReviewRating from './review-rating'
import UserDetails from './user-details'

export default function SingleReview() {
  return (
    <main
      className="
        bg-white rounded-lg border-2 border-black drop-shadow-xl
        px-4 py-4
        flex flex-col gap-4
        lg:flex-row lg:items-center lg:justify-between
      "
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12">
        <UserDetails />
        <ReviewContent />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-6 lg:gap-12">
        <ReviewRating />
        <ReactionCounter />
      </div>
    </main>
  )
}
