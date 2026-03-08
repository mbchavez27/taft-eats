import React, { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import EstablishmentsCard from '../components/organisms/establishment-card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { EstablishmentService } from '../services/establishments.services'

export default function EstablishmentsLists() {
  // Setup the Intersection Observer to detect when the user hits the bottom
  const { ref, inView } = useInView()

  // Setup TanStack Infinite Query
  const {
    data,
    error,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['establishments'],
    queryFn: EstablishmentService.getAll, // Calls clean service object
    initialPageParam: undefined as number | undefined,
    // Grabs the nextCursor your backend strictly provides via DTO
    getNextPageParam: (lastPage) => lastPage.nextCursor,
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
