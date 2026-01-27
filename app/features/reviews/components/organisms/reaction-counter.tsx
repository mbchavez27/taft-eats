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
      {/* LIKE */}
      <div className="flex items-center gap-2 sm:gap-3">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-lexend font-semibold">
          {likeCount}
        </h1>

        {reaction === 'like' ? (
          <FaThumbsUp
            className="cursor-pointer hover:opacity-70 text-xl sm:text-2xl lg:text-3xl"
            onClick={handleLike}
            color="#9CB16F"
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

        {reaction === 'dislike' ? (
          <FaThumbsDown
            className="cursor-pointer hover:opacity-70 scale-x-[-1] text-xl sm:text-2xl lg:text-3xl"
            onClick={handleDislike}
            color="#D40000"
          />
        ) : (
          <FaRegThumbsDown
            className="cursor-pointer hover:opacity-70 scale-x-[-1] text-xl sm:text-2xl lg:text-3xl"
            onClick={handleDislike}
          />
        )}
      </div>
    </main>
  )
}
