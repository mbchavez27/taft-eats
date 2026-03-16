import React, { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { ScrollArea } from '~/components/ui/scroll-area'
import SingleReview from '../components/organisms/single-review'
import { ReviewService } from '../services/reviews.services'
import type { ReviewDto } from '../types/reviews.types'
import { MdEdit } from 'react-icons/md'

type SortValue = 'newest' | 'oldest' | 1 | 2 | 3 | 4 | 5

export default function ReviewsList({
  restaurantId,
  onOpenForms,
  sort = 'newest',
  restaurantName,
}: {
  restaurantId: number
  onOpenForms: (reviewId: number) => void
  sort?: SortValue
  restaurantName?: string
}) {
  const location = useLocation()
  const isUserRoute = location.pathname.includes('/user')
  const isOwnerRoute = location.pathname.includes('/restaurants/owner')
  const { ref, inView } = useInView()

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['reviews', restaurantId, sort],
      queryFn: ({ pageParam = 0 }) =>
        ReviewService.getByRestaurantId({ restaurantId, pageParam, sort }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!restaurantId,
    })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage])

  if (status !== 'success')
    return (
      <div className="h-125 flex items-center justify-center bg-white rounded-xl">
        Loading...
      </div>
    )

  const allReviews = data?.pages.flatMap((page: any) => page.data) ?? []
  const isEmpty = allReviews.length === 0

  return (
    <main className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col gap-4 h-125 overflow-hidden">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-[450px] gap-4 text-center">
              <MdEdit size={100} className="text-gray-400" />
              <p className="font-lexend text-gray-400 text-xl leading-relaxed">
                Be the first to share your experience!
                <br />
                Share your food adventures at{' '}
                {restaurantName ?? 'this restaurant'}.
              </p>
            </div>
          ) : (
            <>
              {data?.pages.map((page: any, i) => (
                <React.Fragment key={i}>
                  {page.data.map((review: ReviewDto) => (
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
            </>
          )}
        </div>
      </ScrollArea>
    </main>
  )
}
