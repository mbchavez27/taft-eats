import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import EstablishmentDetails from '~/features/establishments/containers/establishment-details'
import EstablishmentHeader from '~/features/establishments/components/organisms/establishment-header'
import EstablishmentReviews from '~/features/reviews/containers/establishment-reviews'
import ReplyForms from '~/features/reviews/containers/reply-forms.tsx'
import ReviewButton from '~/features/reviews/components/molecules/review-button'
import { useOwnerRestaurant } from '~/features/establishments/hook/useOwnerRestaurant'
import { useReply } from '~/features/reviews/hooks/useCreateReply'

export function meta() {
  return [
    { title: 'Taft Eats - Owner Dashboard' },
    { name: 'description', content: 'Manage your Taft Eats restaurant' },
  ]
}

export default function OwnerRestaurant() {
  const [replyingToReviewId, setReplyingToReviewId] = useState<number | null>(
    null,
  )

  const { data, isLoading, isError } = useOwnerRestaurant()
  const restaurant = data?.data
  const restaurantId = restaurant?.restaurant_id || 0

  const handleOpenReply = (reviewId: number) => setReplyingToReviewId(reviewId)
  const handleCloseReply = () => setReplyingToReviewId(null)

  // Initialize reply hook - only valid when replyingToReviewId is set
  const { form, onSubmit, isSubmitting, serverError } = useReply(
    replyingToReviewId ?? 0,
    restaurantId,
    handleCloseReply,
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading your dashboard...
      </div>
    )
  }

  if (isError || !restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Failed to load dashboard.
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <main className="flex flex-col lg:flex-row py-12 px-10 lg:gap-8 gap-16">
        {/* Sidebar */}
        <div className="flex lg:w-1/4">
          <EstablishmentDetails
            isReviewOpen={!!replyingToReviewId}
            data={restaurant}
            restaurant_id={restaurant.restaurant_id}
          />
        </div>

        {/* Content Area */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8">
          <EstablishmentHeader
            name={restaurant.name}
            location={restaurant.location}
          />

          {replyingToReviewId ? (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold font-lexend">
                Replying to Review
              </h2>

              <div className="w-full">
                <ReplyForms />
              </div>

              {serverError && (
                <p className="text-red-500 font-bold text-right">
                  {serverError}
                </p>
              )}

              <div className="flex justify-end gap-4">
                <ReviewButton type="button" onClick={handleCloseReply}>
                  Cancel
                </ReviewButton>
                <ReviewButton
                  type="submit"
                  disabled={isSubmitting || !replyingToReviewId}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Reply'}
                </ReviewButton>
              </div>
            </form>
          ) : (
            <EstablishmentReviews
              onReply={handleOpenReply}
              restaurantId={restaurantId}
              restaurantName={restaurant.name}
            />
          )}
        </div>
      </main>
    </FormProvider>
  )
}
