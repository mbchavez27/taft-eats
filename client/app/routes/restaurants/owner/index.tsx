import { useParams } from "react-router";
import type { Route } from "../+types/restaurants/index";
import EstablishmentDetails from "~/features/establishments/containers/establishment-details";
import EstablishmentHeader from "~/features/establishments/components/organisms/establishment-header";
import { useState } from "react";
import ReviewButton from "~/features/reviews/components/molecules/review-button";
import EstablishmentReviews from "~/features/reviews/containers/establishment-reviews";
import ReplyForms from "~/features/reviews/containers/reply-forms.tsx";

export function meta({ params }: Route.MetaArgs) {
  const restaurant_id = params.restaurant;
  return [
    { title: "Taft Eats - " + restaurant_id },
    { name: "description", content: "Taft Eats" },
  ];
}

export default function Restaurant() {
  const { restaurant } = useParams();
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const handleOpenReply = () => setIsReplyOpen(true);
  return (
    <>
      <main className="flex flex-col lg:flex-row py-12 px-10 lg:gap-8 gap-16">
        {/* Sidebar */}
        <div className="flex lg:w-1/4">
          <EstablishmentDetails isReviewOpen={isReplyOpen} />
        </div>

        {/* Main content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 md:gap-8">
          <EstablishmentHeader />
          {isReplyOpen ? (
            <>
              <ReplyForms />
            </>
          ) : (
            <EstablishmentReviews onReply={handleOpenReply} />
          )}
          {isReplyOpen ? (
            <>
              <div className="flex justify-end gap-4">
                <ReviewButton
                  onClick={() => {
                    setIsReplyOpen(false);
                  }}
                >
                  Cancel
                </ReviewButton>
                <ReviewButton>Submit</ReviewButton>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
