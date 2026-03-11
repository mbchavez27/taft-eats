import { useEffect, useRef } from "react";
import { useReviewStore } from "../context/review.store";
import { ReviewService } from "../services/reviews.services";
import type { ReactionType } from "../types/reviews.types";

/**
 * Custom hook to manage review reactions (like/dislike) with optimistic UI updates.
 *
 * @param {number} reviewId - The unique identifier of the review.
 * @param {ReactionType} [initialReaction=null] - The user's initial reaction from the database.
 * @param {number} [initialLikes=0] - The initial like count from the database.
 * @param {number} [initialDislikes=0] - The initial dislike count from the database.
 * @returns {Object} An object containing the current reaction state and handler functions.
 */
export default function useReaction(
  reviewId: number,
  initialReaction: ReactionType = null,
  initialLikes: number = 0,
  initialDislikes: number = 0,
) {
  // 1. SELECT ONLY WHAT WE NEED (Prevents infinite re-renders)
  const setInitialReactions = useReviewStore(
    (state) => state.setInitialReactions,
  );
  const toggleLike = useReviewStore((state) => state.toggleLike);
  const toggleDislike = useReviewStore((state) => state.toggleDislike);

  // 2. ONLY subscribe to this specific review's data
  const current = useReviewStore((state) => state.reactions[reviewId]);

  // 3. Ensure we only initialize once per component mount
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      setInitialReactions(
        reviewId,
        initialReaction,
        initialLikes,
        initialDislikes,
      );
      hasInitialized.current = true;
    }
  }, [
    reviewId,
    initialReaction,
    initialLikes,
    initialDislikes,
    setInitialReactions,
  ]);

  // Fallback to initial props while Zustand is setting up
  const reaction = current?.reaction ?? initialReaction;
  const likes = current?.likes ?? initialLikes;
  const dislikes = current?.dislikes ?? initialDislikes;

  /**
   * Handles the voting logic, applies an optimistic update, and synchronizes with the backend.
   * Rolls back the state if the API request fails.
   *
   * @param {'like' | 'dislike'} type - The type of vote being cast.
   * @returns {Promise<void>}
   */
  const handleVote = async (type: "like" | "dislike") => {
    // Save current state for a potential rollback
    const previousReaction = reaction;
    const previousLikes = likes;
    const previousDislikes = dislikes;

    // Optimistic Update
    if (type === "like") {
      toggleLike(reviewId);
    } else {
      toggleDislike(reviewId);
    }

    const isUndoing = previousReaction === type;
    const votePayload = isUndoing ? "none" : type;

    try {
      await ReviewService.voteReview(reviewId, votePayload);
    } catch (error) {
      console.error("Failed to update reaction in database:", error);

      // Rollback on failure
      setInitialReactions(
        reviewId,
        previousReaction,
        previousLikes,
        previousDislikes,
      );
    }
  };

  return {
    reaction,
    likeCount: likes,
    dislikeCount: dislikes,
    handleLike: () => handleVote("like"),
    handleDislike: () => handleVote("dislike"),
  };
}
