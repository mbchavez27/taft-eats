import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegThumbsDown,
  FaThumbsDown,
} from "react-icons/fa6";
import useReaction from "../../hooks/useReaction";
import type { ReactionType } from "../../types/reviews.types";

interface ReactionCounterProps {
  reviewId: number;
  initialReaction: ReactionType;
  initialLikes: number;
  initialDislikes: number;
}

export default function ReactionCounter({
  reviewId,
  initialReaction,
  initialLikes,
  initialDislikes,
}: ReactionCounterProps) {
  // Pass the props directly into our newly updated hook
  const { reaction, likeCount, dislikeCount, handleLike, handleDislike } =
    useReaction(reviewId, initialReaction, initialLikes, initialDislikes);

  return (
    <main className="flex items-center gap-4">
      {/* LIKE */}
      <div className="flex items-center gap-2 sm:gap-3">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-lexend font-semibold">
          {likeCount}
        </h1>

        {reaction === "like" ? (
          <FaThumbsUp
            className="cursor-pointer hover:opacity-70 text-xl sm:text-2xl lg:text-3xl text-[#9CB16F]"
            onClick={handleLike}
          />
        ) : (
          <FaRegThumbsUp
            className="cursor-pointer hover:opacity-70 text-xl sm:text-2xl lg:text-3xl"
            onClick={handleLike}
          />
        )}
      </div>

      {/* DISLIKE */}
      <div className="flex items-center gap-2 sm:gap-3">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-lexend font-semibold">
          {dislikeCount}
        </h1>

        {reaction === "dislike" ? (
          <FaThumbsDown
            className="cursor-pointer hover:opacity-70 scale-x-[-1] text-xl sm:text-2xl lg:text-3xl text-[#D40000]"
            onClick={handleDislike}
          />
        ) : (
          <FaRegThumbsDown
            className="cursor-pointer hover:opacity-70 scale-x-[-1] text-xl sm:text-2xl lg:text-3xl"
            onClick={handleDislike}
          />
        )}
      </div>
    </main>
  );
}
