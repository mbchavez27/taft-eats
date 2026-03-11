import { create } from 'zustand'

interface ReviewState {
  // We can track local UI updates here before they sync to the DB
  reactions: Record<
    number,
    { reaction: 'like' | 'dislike' | null; likes: number; dislikes: number }
  >
  setInitialReactions: (
    reviewId: number,
    likes: number,
    dislikes: number,
  ) => void
  toggleLike: (reviewId: number) => void
  toggleDislike: (reviewId: number) => void
}

export const useReviewStore = create<ReviewState>((set) => ({
  reactions: {},

  setInitialReactions: (reviewId, likes, dislikes) =>
    set((state) => ({
      reactions: {
        ...state.reactions,
        [reviewId]: state.reactions[reviewId] || {
          reaction: null,
          likes,
          dislikes,
        },
      },
    })),

  toggleLike: (reviewId) =>
    set((state) => {
      const current = state.reactions[reviewId]
      if (!current) return state

      const isLiked = current.reaction === 'like'
      return {
        reactions: {
          ...state.reactions,
          [reviewId]: {
            ...current,
            reaction: isLiked ? null : 'like',
            likes: isLiked ? current.likes - 1 : current.likes + 1,
            dislikes:
              current.reaction === 'dislike'
                ? current.dislikes - 1
                : current.dislikes,
          },
        },
      }
    }),

  toggleDislike: (reviewId) =>
    set((state) => {
      const current = state.reactions[reviewId]
      if (!current) return state

      const isDisliked = current.reaction === 'dislike'
      return {
        reactions: {
          ...state.reactions,
          [reviewId]: {
            ...current,
            reaction: isDisliked ? null : 'dislike',
            dislikes: isDisliked ? current.dislikes - 1 : current.dislikes + 1,
            likes:
              current.reaction === 'like' ? current.likes - 1 : current.likes,
          },
        },
      }
    }),
}))
