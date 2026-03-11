import { useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'
import Stars from '~/features/shared/components/molecules/stars'
import { useFilterStore } from "../../store/filter.store";

export default function StarRating() {
  const { rating, setRating } = useFilterStore()

  return (
    <section className="flex flex-col gap-2 px-8 py-2">
      <div>
        <h1 className="font-bold text-2xl text-black">Star Rating</h1>
      </div>
      <div className="px-5 py-1 text-[#416CAE] flex gap-2">
        <Stars value={rating} onChange={setRating} />
      </div>
    </section>
  )
}
