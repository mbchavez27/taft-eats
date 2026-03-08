import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query' // <-- 1. Import useQuery
import { useEffect, useState } from 'react'

import type { Route } from '../+types/restaurants/index'
import EstablishmentDetails from '~/features/establishments/containers/establishment-details'
import EstablishmentHeader from '~/features/establishments/components/organisms/establishment-header'
import ReviewButton from '~/features/reviews/components/molecules/review-button'
import EstablishmentReviews from '~/features/reviews/containers/establishment-reviews'
import ReviewForms from '~/features/reviews/containers/review-forms'
import { EstablishmentService } from '~/features/establishments/services/establishments.services'

export async function loader({ params }: Route.LoaderArgs) {
  const restaurantId = parseInt(params.restaurant_id as string, 10)

  if (!restaurantId) {
    throw new Response('Not Found', { status: 404 })
  }

  // Fetch the restaurant data
  const response = await EstablishmentService.getById(restaurantId)
  return response
}

export function meta({ data }: Route.MetaArgs) {
  const restaurantName = data?.data?.name || 'Restaurant'

  return [
    { title: `Taft Eats - ${restaurantName}` },
    {
      name: 'description',
      content: `View details and reviews for ${restaurantName} on Taft Eats`,
    },
  ]
}

export default function Restaurant() {
  const { restaurant_id } = useParams<{ restaurant_id: string }>()
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const handleOpenReview = () => setIsReviewOpen(true)

  const restaurantId = restaurant_id ? parseInt(restaurant_id, 10) : 0

  // Fetch the data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['establishment', restaurantId],
    queryFn: () => EstablishmentService.getById(restaurantId),
    enabled: !!restaurantId,
  })

  console.log(data?.data)
  return (
    <>
      <main className="flex flex-col lg:flex-row py-12 px-10 lg:gap-8 gap-16">
        {/* Sidebar */}
        <div className="flex lg:w-1/4">
          <EstablishmentDetails isReviewOpen={isReviewOpen} data={data?.data} />
        </div>

        {/* Main content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8">
          <EstablishmentHeader
            name={data?.data.name}
            lat={data?.data.latitude}
            lng={data?.data.latitude}
          />
          {isReviewOpen ? (
            <>
              <ReviewForms />
            </>
          ) : (
            <EstablishmentReviews onReply={handleOpenReview} />
          )}
          {isReviewOpen ? (
            <>
              <div className="flex justify-end gap-4">
                <ReviewButton
                  onClick={() => {
                    setIsReviewOpen(false)
                  }}
                >
                  Cancel
                </ReviewButton>
                <ReviewButton>Submit</ReviewButton>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-end">
                <ReviewButton
                  onClick={() => {
                    setIsReviewOpen(true)
                  }}
                >
                  Write a Review
                </ReviewButton>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
