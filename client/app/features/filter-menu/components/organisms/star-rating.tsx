import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import Stars from "~/features/shared/components/molecules/stars";

export default function StarRating() {
  return (
    <section className="flex flex-col gap-2 px-8 py-2">
      <div>
        <h1 className="font-bold text-2xl">Star Rating</h1>
      </div>
      <div className="px-5 py-1 text-[#FFD24D] flex gap-2">
        <Stars />
      </div>
    </section>
  );
}
