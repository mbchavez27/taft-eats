import ImageContainer from "~/features/shared/container/image-container";
import EstablishmentDesription from "../components/organisms/establishment-description";
import EstablishmentTags from "../components/organisms/establishment-tags";
import ReviewTags from "~/features/reviews/containers/review-tags";

type EstablishmentDetailsProps = {
  isReviewOpen?: boolean;
};

export default function EstablishmentDetails({
  isReviewOpen,
}: EstablishmentDetailsProps) {
  return (
    <>
      <main className="w-xs font-lexend text-[#BFD392] px-4 flex flex-col gap-5">
        <ImageContainer />
        {isReviewOpen ? (
          <>
            <ReviewTags />
          </>
        ) : (
          <>
            <EstablishmentDesription />
            <EstablishmentTags />
          </>
        )}
      </main>
    </>
  );
}
