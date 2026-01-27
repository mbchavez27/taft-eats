import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegThumbsDown,
  FaThumbsDown,
} from 'react-icons/fa6'
import useReaction from '../../hooks/useReaction'

export default function ReactionCounter() {
  const { reaction, likeCount, dislikeCount, handleLike, handleDislike } =
    useReaction(5.0, 5.0)

  return (
    <main className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <h1 className="flex items-center gap-4 text-3xl font-lexend font-semibold">
          {likeCount}
        </h1>
        {reaction === 'like' ? (
          <FaThumbsUp
            size={36}
            className="cursor-pointer hover:opacity-70"
            onClick={handleLike}
            color="#9CB16F"
          />
        ) : (
          <FaRegThumbsUp
            size={36}
            className="cursor-pointer hover:opacity-70"
            onClick={handleLike}
          />
        )}
      </div>
      <div className="flex items-center gap-3">
        <h1 className="flex items-center gap-4 text-3xl font-lexend font-semibold">
          {dislikeCount}
        </h1>
        {reaction === 'dislike' ? (
          <FaThumbsDown
            size={36}
            className="cursor-pointer hover:opacity-70 scale-x-[-1]"
            onClick={handleDislike}
            color="#D40000"
          />
        ) : (
          <FaRegThumbsDown
            size={36}
            className="cursor-pointer hover:opacity-70 scale-x-[-1]"
            onClick={handleDislike}
          />
        )}
      </div>
    </main>
  )
}
