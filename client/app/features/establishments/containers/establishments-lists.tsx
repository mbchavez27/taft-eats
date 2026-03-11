import React, { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import EstablishmentsCard from '../components/organisms/establishment-card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { EstablishmentService } from '../services/establishments.services'

import { useFilterStore } from '~/features/filter-menu/store/filter.store'

export default function EstablishmentsLists() {
  const { ref, inView } = useInView()

  // 1. GET DATA FROM ZUSTAND
  const { selectedCuisines, selectedTags, selectedPriceRanges } = useFilterStore()

  // 2. COMBINE Cuisines and Tags for the backend (it checks both against the Tags table)
  const combinedTags = [...selectedCuisines, ...selectedTags]

  const {
    data,
    error,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    // 3. ATTACH THE STORE VARIABLES TO QUERY KEY (This makes React Query refetch automatically when filters change)
    queryKey: ['establishments', combinedTags, selectedPriceRanges],
    queryFn: ({ pageParam }) =>
      EstablishmentService.getAll({ 
        pageParam, 
        tags: combinedTags, 
        priceRanges: selectedPriceRanges 
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  // Trigger fetchNextPage automatically when the invisible 'ref' div comes into view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  // Handle loading and error states cleanly
  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center h-120 text-gray-500">
        Loading establishments...
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-120 text-red-500">
        Error loading establishments: {error.message}
      </div>
    )
  }

  return (
    <>
      <main className="flex flex-col gap-5">
        <header>
          <h1 className="font-climate text-xl md:text-4xl text-black">
            ESTABLISHMENTS
          </h1>
        </header>

        <ScrollArea className="h-120">
          <section className="flex flex-wrap gap-6 md:gap-12 lg:gap-9 justify-start">
            {/* Map through the infinite pages, and then the data inside each page */}
            {data?.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.map((establishment) => (
                  <EstablishmentsCard
                    id={establishment.restaurant_id}
                    key={establishment.restaurant_id}
                    name={establishment.name}
                    rating={establishment.rating}
                  />
                ))}
              </React.Fragment>
            ))}
          </section>

          {/* The invisible intersection observer target */}
          <div
            ref={ref}
            className="h-10 w-full flex items-center justify-center mt-6 pb-6"
          >
            {isFetchingNextPage ? (
              <span className="text-sm text-gray-400 animate-pulse">
                Loading more...
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
        </ScrollArea>
      </main>
    </>
  )
}