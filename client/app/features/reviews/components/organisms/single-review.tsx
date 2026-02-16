import ReactionCounter from "./reaction-counter";
import ReviewContent from "./review-content";
import ReviewRating from "./review-rating";
import UserDetails from "./user-details";

interface SingleReviewProps {
  is_owner?: boolean;
  onOpenForms?: () => void;
}

export default function SingleReview({
  is_owner,
  onOpenForms,
}: SingleReviewProps) {
  return (
    <main
      className="
        bg-white rounded-lg border-2 border-black drop-shadow-xl
        px-6 py-4
        flex flex-col gap-4
        lg:flex-row lg:items-center lg:justify-between
      "
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12">
        <UserDetails />
        <ReviewContent />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-6 lg:gap-12">
        <ReviewRating />
        {is_owner ? (
          <>
            <button
              onClick={onOpenForms}
              className="font-inter font-bold text-white bg-[#416CAE] text-2xl px-3 py-1 rounded-2xl hover:bg-[#345a96] transition-colors"
            >
              Reply
            </button>
          </>
        ) : (
          <>
            <ReactionCounter />
          </>
        )}
      </div>
    </main>
  );
}
