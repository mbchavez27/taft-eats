/**
 * @fileoverview Reviews list with infinite scroll logic.
 * Maintains the white container and ScrollArea regardless of data state.
 */

import React, { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import { ScrollArea } from '~/components/ui/scroll-area'
import SingleReview from '../components/organisms/single-review'
import { ReviewService } from '../services/reviews.services'

interface ReviewsListProps {
  restaurantId: number
  onOpenForms: () => void
}

export default function ReviewsList({
  restaurantId,
  onOpenForms,
}: ReviewsListProps) {
  const location = useLocation()
  const isUserRoute = location.pathname.includes('/user')
  const isOwnerRoute = location.pathname.includes('/restaurants/owner')

  const { ref, inView } = useInView()

  const {
    data,
    error,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['reviews', restaurantId],
    queryFn: ({ pageParam }) =>
      ReviewService.getByRestaurantId({ restaurantId, pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!restaurantId,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

  // Handles loading and error inside the same styled container for layout stability
  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center h-125 text-gray-500 bg-white rounded-xl w-full p-4">
        Loading reviews...
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-125 text-red-500 bg-white rounded-xl w-full p-4">
        Error loading reviews: {error.message}
      </div>
    )
  }

  // Check if there is absolutely no data across all pages
  const isEmpty = data?.pages[0]?.data.length === 0

  return (
    <main className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col gap-4 h-125 overflow-hidden">
      <ScrollArea className="h-full w-full overflow-x-auto">
        {/* Only render the content if the array is not empty */}
        {!isEmpty && (
          <>
            <div className="flex flex-col gap-4">
              {data?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.data.map((review) => (
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
            </div>

            {/* The invisible intersection observer target */}
            <div
              ref={ref}
              className="h-10 w-full flex items-center justify-center mt-6 pb-6"
            >
              {isFetchingNextPage ? (
                <span className="text-sm text-gray-400 animate-pulse">
                  Loading more reviews...
                </span>
              ) : hasNextPage ? (
                <span className="text-sm text-gray-300">
                  Scroll down to load more
                </span>
              ) : (
                <span className="text-sm text-gray-400">
                  You've reached the end!
                </span>
              )}
            </div>
          </>
        )}
      </ScrollArea>
    </main>
  )
}
