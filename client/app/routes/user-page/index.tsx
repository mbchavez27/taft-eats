import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useInfiniteQuery } from '@tanstack/react-query'

import UserDetails from '~/features/users/containers/user-details'
import UserStatistics from '~/features/users/components/organisms/user-statistics'
import SavedEstablishments from '~/features/users/components/organisms/saved-establishments'
import UserReviews from '~/features/reviews/containers/user-reviews'

import { useAuthStore } from '~/features/auth/context/auth.store'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'

export function meta({}) {
  return [
    { title: 'Taft Eats - User' },
    { name: 'description', content: 'Taft Eats' },
  ]
}

export default function UserPage() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const { SetBookmarkCount } = useAuthStore()

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['userBookmarks', user?.user_id],
      queryFn: ({ pageParam }) =>
        EstablishmentService.getBookmarks({ pageParam }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: !!user, // Only fetch if user exists
    })

  const allBookmarks = data?.pages.flatMap((page) => page.data) || []
  const totalCount = allBookmarks.length

  useEffect(() => {
    if (status === 'success') {
      SetBookmarkCount(totalCount)
    }
  }, [totalCount, status, SetBookmarkCount])

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <>
      <main className="flex flex-col lg:flex-row py-12 px-10 lg:gap-8 gap-16">
        {/* Sidebar */}
        <div className="flex lg:w-1/4">
          <UserDetails />
        </div>

        {/* Main content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8">
          <section className="flex flex-row flex-wrap gap-10">
            <div className="flex-2">
              <UserStatistics />
            </div>
            <div className="flex-1">
              <SavedEstablishments items={allBookmarks} />
            </div>
          </section>
          <section>
            <UserReviews />
          </section>
        </div>
      </main>
    </>
  )
}
