import React, { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { ScrollArea } from '~/components/ui/scroll-area'
import SingleReview from '../components/organisms/single-review'
import { ReviewService } from '../services/reviews.services'

export default function ReviewsList({
  restaurantId,
  onOpenForms,
}: {
  restaurantId: number
  onOpenForms: () => void
}) {
  const location = useLocation()
  const isUserRoute = location.pathname.includes('/user')
  const isOwnerRoute = location.pathname.includes('/restaurants/owner')
  const { ref, inView } = useInView()

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['reviews', restaurantId],
      queryFn: ({ pageParam }) =>
        ReviewService.getByRestaurantId({ restaurantId, pageParam }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!restaurantId,
    })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage])

  if (status === 'pending')
    return (
      <div className="h-125 flex items-center justify-center bg-white rounded-xl">
        Loading...
      </div>
    )

  return (
    <main className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col gap-4 h-125 overflow-hidden">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-4">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((review: any) => (
                <SingleReview
                  key={review.review_id}
                  review={review}
                  onOpenForms={onOpenForms}
                  is_owner={isOwnerRoute}
                  is_user={isUserRoute}
                />
              ))}
            </React.Fragment>
          ))}
          <div ref={ref} className="h-10 w-full" />
        </div>
      </ScrollArea>
    </main>
  )
}
