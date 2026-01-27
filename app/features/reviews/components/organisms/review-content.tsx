import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'

export default function ReviewContent() {
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth)
    }
  }, [])

  return (
    <main className="font-lexend flex gap-2 sm:gap-3 items-center">
      <p
        ref={textRef}
        className="
          truncate
          text-base sm:text-lg lg:text-2xl
          w-[18ch] sm:w-[22ch] lg:w-[25ch]
        "
      >
        Food was good! Service was fast and the staff were very nice! Love the
        ambiance inside too. Would come back again!
      </p>

      {isTruncated && (
        <Dialog>
          <DialogTrigger>
            <span className="text-sm sm:text-base lg:text-2xl opacity-50 underline">
              view full
            </span>
          </DialogTrigger>

          <DialogContent className="border-2 border-[#326F33] bg-white text-black">
            <p className="font-lexend text-lg sm:text-2xl lg:text-3xl text-center px-6 py-4">
              “Food was good! Service was fast and the staff were very nice!
              Love the ambiance inside too. Would come back again!”
            </p>
          </DialogContent>
        </Dialog>
      )}
    </main>
  )
}
