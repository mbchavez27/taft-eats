import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { FaStar } from 'react-icons/fa'
import ReactionCounter from './reaction-counter'
import type { ReviewDto } from '../../types/reviews.types'

export default function ReviewContent({
  review,
  reply,
}: {
  review: ReviewDto
  reply?: string | null
}) {
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth)
    }
  }, [review.body])

  // Show dialog if review is truncated OR reply exists
  const shouldShowDialog = isTruncated || !!reply

  return (
    <main className="font-lexend flex flex-col gap-3">
      {/* Review preview */}
      <div className="flex items-center gap-2 sm:gap-3">
        <p
          ref={textRef}
          className="
            truncate
            text-base sm:text-lg lg:text-2xl
            w-[18ch] sm:w-[22ch] lg:w-[25ch]
          "
        >
          {review.body}
        </p>

        {shouldShowDialog && (
          <Dialog>
            <DialogTrigger>
              <span className="text-sm sm:text-base lg:text-2xl opacity-50 underline">
                view full
              </span>
            </DialogTrigger>

            <DialogContent className="border-2 border-[#326F33] bg-white text-black flex flex-col gap-4">
              {/* Review section */}
              <section className="flex gap-4 font-lexend">
                <div className="flex items-center gap-2 flex-wrap">
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div>
                    <h1 className="text-sm sm:text-md lg:text-lg">
                      {review.username}
                    </h1>
                    <p className="text-xs sm:text-sm lg:text-md opacity-50">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-stretch bg-black opacity-20 w-[1px]"></div>

                <div className="flex items-center gap-3">
                  <h1 className="text-[#808080] text-md sm:text-lg lg:text-xl">
                    rating
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                      {review.rating}
                    </p>
                    <FaStar size={32} color={'#FFD24D'} />
                  </div>
                </div>
              </section>

              <hr className="mt-2" />

              {/* Review body */}
              <section className="border-3 border-black rounded-2xl px-2 py-3">
                <p className="font-lexend text-lg sm:text-2xl lg:text-3xl text-left px-6 py-4">
                  {review.body}
                </p>
              </section>

              {/* Reply (if exists) */}
              {reply && (
                <section className="border-3 border-black rounded-2xl px-2 py-3 mt-2">
                  <p className="font-lexend font-bold text-md sm:text-lg lg:text-xl text-left px-6 pb-3">
                    Owner Response
                  </p>
                  <p className="font-lexend text-md sm:text-lg lg:text-xl text-left px-6">
                    {reply}
                  </p>
                </section>
              )}

              {/* Reactions */}
              <section className="flex justify-end px-5">
                <ReactionCounter
                  reviewId={review.review_id}
                  initialReaction={review.user_vote}
                  initialLikes={review.like_count}
                  initialDislikes={review.dislike_count}
                />
              </section>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </main>
  )
}
