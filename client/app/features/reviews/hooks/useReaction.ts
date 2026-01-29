import { useState } from 'react'

export type ReactionType = 'like' | 'dislike' | null

export default function useReaction(initialLike = 5.0, initialDislike = 5.0) {
  const [reaction, setReaction] = useState<ReactionType>(null)
  const [likeCount, setLikeCount] = useState(initialLike)
  const [dislikeCount, setDislikeCount] = useState(initialDislike)

  const handleLike = () => {
    if (reaction === 'like') {
      setReaction(null)
      setLikeCount(prev => prev - 1)
    } else {
      setReaction('like')
      setLikeCount(prev => prev + 1)
      if (reaction === 'dislike') setDislikeCount(prev => prev - 1)
    }
  }

  const handleDislike = () => {
    if (reaction === 'dislike') {
      setReaction(null)
      setDislikeCount(prev => prev - 1)
    } else {
      setReaction('dislike')
      setDislikeCount(prev => prev + 1)
      if (reaction === 'like') setLikeCount(prev => prev - 1)
    }
  }

  return { reaction, likeCount, dislikeCount, handleLike, handleDislike }
}
