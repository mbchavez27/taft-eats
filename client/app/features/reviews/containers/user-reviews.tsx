import React, { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { ScrollArea } from '~/components/ui/scroll-area'
import SingleReview from '../components/organisms/single-review'
import { ReviewService } from '../services/reviews.services'
import { useAuthStore } from '~/features/auth/context/auth.store'
import type { ReviewDto } from '../types/reviews.types'

export default function UserReviews() {
  const { user, setReviewCount } = useAuthStore()
  const { ref, inView } = useInView()

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['userReviews', user?.user_id],
      queryFn: ({ pageParam = 0 }) =>
        ReviewService.getByUserId({
          userId: user!.user_id,
          pageParam,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!user?.user_id,
    })

  // Handle infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Update Zustand review count whenever the first page of data is fetched
  useEffect(() => {
    if (data?.pages?.[0]?.count !== undefined) {
      setReviewCount(data.pages[0].count)
    }
  }, [data, setReviewCount])

  if (status === 'pending') {
    return (
      <main className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col gap-4 h-125 overflow-hidden font-lexend justify-center items-center">
        <p className="text-gray-500">Loading reviews...</p>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col gap-4 h-125 overflow-hidden font-lexend justify-center items-center">
        <p className="text-red-500">Failed to load reviews.</p>
      </main>
    )
  }

  return (
    <>
      <main className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col gap-4 h-125 overflow-hidden font-lexend">
        <header className="py-3 font-bold text-2xl">My Reviews</header>
        <ScrollArea className="h-full w-full overflow-x-auto">
          <div className="flex flex-col gap-4">
            {data?.pages[0].data.length === 0 ? (
              <p className="text-gray-500">
                You haven't written any reviews yet.
              </p>
            ) : (
              <>
                {data?.pages.map((page: any, i) => (
                  <React.Fragment key={i}>
                    {page.data.map((review: ReviewDto) => (
                      <SingleReview
                        key={review.review_id}
                        review={review}
                        is_user={true} // Forces the edit/delete buttons to show
                      />
                    ))}
                  </React.Fragment>
                ))}
                {/* Invisible element to trigger the next page fetch */}
                <div ref={ref} className="h-10 w-full" />
              </>
            )}
          </div>
        </ScrollArea>
      </main>
    </>
  )
}
