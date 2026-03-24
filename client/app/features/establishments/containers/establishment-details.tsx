import ImageContainer from '~/features/shared/container/image-container'
import EstablishmentDesription from '../components/organisms/establishment-description'
import EstablishmentTags from '../components/organisms/establishment-tags'
import ReviewTags from '~/features/reviews/containers/review-tags'
import type { RestaurantDto } from '../types/establishments.types'

type EstablishmentDetailsProps = {
  isReviewOpen?: boolean
  data?: RestaurantDto
  restaurant_id?: number
}

export default function EstablishmentDetails({
  isReviewOpen,
  data,
  restaurant_id,
}: EstablishmentDetailsProps) {
  return (
    <main className="w-xs font-lexend text-[#BFD392] px-4 flex flex-col gap-5">
      <ImageContainer
        initialIsBookmarked={!!data?.is_bookmarked}
        targetId={restaurant_id}
        bannerUrl={data?.banner_picture_url}
      />

      {isReviewOpen && !restaurant_id ? (
        <ReviewTags />
      ) : (
        <>
          <EstablishmentDesription description={data?.description} />
          <EstablishmentTags
            id={data?.restaurant_id}
            stars={data?.rating}
            price_range={data?.price_range}
          />
        </>
      )}
    </main>
  )
}
