import { useLocation } from "react-router";
import { ScrollArea } from "~/components/ui/scroll-area";
import SingleReview from "../components/organisms/single-review";

export default function ReviewsList({
  onOpenForms,
}: {
  onOpenForms: () => void;
}) {
  const location = useLocation();
  const isUserRoute = location.pathname.includes("/user");
  const isOwnerRoute = location.pathname.includes("/restaurants/owner");

  return (
    <main className="bg-white rounded-xl w-full p-4 sm:p-6 flex flex-col gap-4 h-125 overflow-hidden">
      <ScrollArea className="h-full w-full overflow-x-auto">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SingleReview
              key={index}
              onOpenForms={onOpenForms}
              is_owner={isOwnerRoute}
              is_user={isUserRoute}
            />
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}
