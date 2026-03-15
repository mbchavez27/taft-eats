import { useState } from 'react'
import ReviewSorts from '~/features/reviews/containers/review-sorts'
import ReviewsList from '~/features/reviews/containers/reviews-list'

type SortValue = 'newest' | 'oldest' | 1 | 2 | 3 | 4 | 5

export default function EstablishmentReviews({
  onReply,
  restaurantId,
  restaurantName,
}: {
  onReply: () => void
  restaurantId?: number
  restaurantName?: string
}) {
  const [sort, setSort] = useState<SortValue>('newest')

  return (
    <main className="flex flex-col gap-4">
      <ReviewSorts onSortChange={setSort} />
      {restaurantId ? (
        <ReviewsList
          onOpenForms={onReply}
          restaurantId={restaurantId}
          sort={sort}
          restaurantName={restaurantName}
        />
      ) : (
        <div className="text-gray-400">Loading reviews...</div>
      )}
    </main>
  )
}