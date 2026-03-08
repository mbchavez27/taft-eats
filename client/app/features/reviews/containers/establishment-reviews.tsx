import ReviewSorts from '~/features/reviews/containers/review-sorts'
import ReviewsList from '~/features/reviews/containers/reviews-list'

export default function EstablishmentReviews({
  onReply,
  restaurantId,
}: {
  onReply: () => void
  restaurantId?: number
}) {
  return (
    <main className="flex flex-col gap-4">
      <ReviewSorts />
      {restaurantId ? (
        <ReviewsList onOpenForms={onReply} restaurantId={restaurantId} />
      ) : (
        <div className="text-gray-400">Loading reviews...</div>
      )}
    </main>
  )
}
