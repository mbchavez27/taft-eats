import { ScrollArea } from "~/components/ui/scroll-area";
import SingleReview from "../components/organisms/single-review";

export default function UserReviews() {
  return (
    <>
      <main className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col gap-4 h-125 overflow-hidden font-lexend">
        <header className="py-3 font-bold text-2xl"> My Reviews,</header>
        <ScrollArea className="h-full w-full overflow-x-auto">
          <div className="flex flex-col gap-4">
            <SingleReview />
            <SingleReview />
            <SingleReview />
            <SingleReview />
            <SingleReview />
            <SingleReview />
            <SingleReview />
            <SingleReview />
          </div>
        </ScrollArea>
      </main>
    </>
  );
}
