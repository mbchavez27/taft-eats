import { useFilterStore } from '../../store/filter.store'
import Stars from '~/features/shared/components/molecules/stars'

export default function StarRating() {
  const { rating, setRating } = useFilterStore()

  return (
    <section className="flex flex-col gap-2 px-8 py-2 overflow-hidden w-full">
      <div>
        <h1 className="font-bold text-2xl text-black truncate">Star Rating</h1>
      </div>
      <div className="px-2 py-1 text-[#416CAE] flex flex-nowrap items-center w-full">
        <Stars
          value={rating}
          onChange={(newVal) => setRating(newVal === rating ? 0 : newVal)}
        />
      </div>
    </section>
  )
}
