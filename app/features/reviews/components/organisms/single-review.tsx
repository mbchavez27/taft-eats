import ReactionCounter from './reaction-counter'
import ReviewContent from './review-content'
import ReviewRating from './review-rating'
import UserDetails from './user-details'

export default function SingleReview() {
  return (
    <>
      <main
        className="bg-white rounded-lg border-2 border-black drop-shadow-xl px-9 py-3 flex justify-between
       items-center"
      >
        <div className="flex items-center gap-12">
          <UserDetails />
          <ReviewContent />
        </div>
        <div className="flex items-center gap-12">
          <ReviewRating />
          <ReactionCounter />
        </div>
      </main>
    </>
  )
}
