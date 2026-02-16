import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { FaStar } from "react-icons/fa";
import ReactionCounter from "./reaction-counter";

export default function ReviewContent() {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, []);

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

          <DialogContent className="border-2 border-[#326F33] bg-white text-black flex flex-col gap-4">
            <section className="flex gap-4 font-lexend">
              <div className="flex font-lexend items-center gap-2 flex-wrap">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-sm sm:text-md lg:text-lg">
                    User 122's comment
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-md opacity-50">
                    01/20/26
                  </p>
                </div>
              </div>
              <div className="h-full bg-black opacity-50 w-[4px]"></div>
              <div className="flex items-center gap-3">
                <h1 className="text-[#808080] text-md sm:text-lg lg:text-xl">
                  rating
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                    5.0
                  </p>
                  <FaStar size={32} color={"#FFD24D"} />
                </div>
              </div>
            </section>
            <hr className="mt-2" />
            <section>
              <p className="font-lexend text-lg sm:text-2xl lg:text-3xl text-left px-6 py-4">
                “Food was good! Service was fast and the staff were very nice!
                Love the ambiance inside too. Would come back again!”
              </p>
            </section>
            <section className="flex justify-end px-5">
              <ReactionCounter />
            </section>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
