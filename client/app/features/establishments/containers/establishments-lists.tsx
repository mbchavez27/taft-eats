import React, { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useLocation } from 'react-router'

import EstablishmentsCard from '../components/organisms/establishment-card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { EstablishmentService } from '../services/establishments.services'

import { useFilterStore } from '~/features/filter-menu/store/filter.store'
import { useAuthStore } from '~/features/auth/context/auth.store'

export default function EstablishmentsLists() {
  const { ref, inView } = useInView()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  const isBookmarksPage = location.pathname.includes('/bookmarks')

  const { selectedCuisines, selectedTags, selectedPriceRanges, selectedFoods, rating } =
    useFilterStore()

  const combinedTags = [...selectedCuisines, ...selectedTags, ...selectedFoods]

  const {
    data,
    error,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      'establishments',
      combinedTags,
      selectedPriceRanges,
      rating,
      isAuthenticated,
      isBookmarksPage,
    ],
    queryFn: ({ pageParam }) =>
      EstablishmentService.getAll({
        pageParam,
        tags: combinedTags,
        priceRanges: selectedPriceRanges,
        rating,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center h-120 text-gray-500 font-lexend">
        Loading...
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-120 text-red-500 font-lexend">
        Error loading data: {error.message}
      </div>
    )
  }

  return (
    <>
      <main className="flex flex-col gap-5">
        <header>
          <h1 className="font-climate text-xl md:text-4xl text-black uppercase">
            {isBookmarksPage ? 'Saved Establishments' : 'Establishments'}
          </h1>
        </header>

        <ScrollArea className="h-120">
          <section className="flex flex-wrap gap-6 md:gap-12 lg:gap-9 justify-start">
            {data?.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data
                  .filter((est) => !isBookmarksPage || !!est.is_bookmarked)
                  .map((establishment) => (
                    <EstablishmentsCard
                      id={establishment.restaurant_id}
                      key={establishment.restaurant_id}
                      name={establishment.name}
                      rating={establishment.rating}
                      banner_url={establishment.banner_picture_url ?? undefined}
                    />
                  ))}
              </React.Fragment>
            ))}
          </section>

          <div
            ref={ref}
            className="h-10 w-full flex items-center justify-center mt-6 pb-6"
          >
            {isFetchingNextPage ? (
              <span className="text-sm text-gray-400 animate-pulse font-lexend">
                Loading more...
              </span>
            ) : hasNextPage ? (
              <span className="text-sm text-gray-300 font-lexend">
                Scroll down to load more
              </span>
            ) : (
              <span className="text-sm text-gray-400 font-lexend">
                {isBookmarksPage && data?.pages[0].data.length === 0
                  ? "You haven't saved anything yet!"
                  : "You've reached the end!"}
              </span>
            )}
          </div>
        </ScrollArea>
      </main>
    </>
  )
}