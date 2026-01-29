import { useParams } from "react-router";
import type { Route } from "../+types/restaurants/index";
import EstablishmentDetails from "~/features/establishments/containers/establishment-details";
import EstablishmentHeader from "~/features/establishments/components/organisms/establishment-header";
import { useState } from "react";
import ReviewButton from "~/features/reviews/components/molecules/review-button";
import EstablishmentReviews from "~/features/reviews/containers/establishment-reviews";
import ReviewForms from "~/features/reviews/containers/review-forms";

export function meta({ params }: Route.MetaArgs) {
  const restaurant_id = params.restaurant;
  return [
    { title: "Taft Eats - " + restaurant_id },
    { name: "description", content: "Taft Eats" },
  ];
}

export default function Restaurant() {
  const { restaurant } = useParams();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  return (
    <>
      <main className="flex flex-col lg:flex-row py-12 px-10 lg:gap-8 gap-16">
        {/* Sidebar */}
        <div className="flex lg:w-1/4">
          <EstablishmentDetails isReviewOpen={isReviewOpen} />
        </div>

        {/* Main content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8">
          <EstablishmentHeader />
          {isReviewOpen ? (
            <>
              <ReviewForms />
            </>
          ) : (
            <EstablishmentReviews />
          )}
          {isReviewOpen ? (
            <>
              <div className="flex justify-end gap-4">
                <ReviewButton
                  onClick={() => {
                    setIsReviewOpen(false);
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
                    setIsReviewOpen(true);
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
  );
}
