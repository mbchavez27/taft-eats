import Prices from '~/features/shared/components/molecules/prices'
import { useFilterStore } from "../../store/filter.store";

export default function PriceRange() {
  const { selectedPriceRanges, togglePriceRange } = useFilterStore()

  return (
    <section className="flex flex-col gap-2 px-8 py-2 text-black">
      <h1 className="font-bold text-2xl">Price Range</h1>
      <div className="py-1 flex gap-2">
        <Prices 
          values={selectedPriceRanges} 
          onChange={togglePriceRange} 
          selectedColor="border-black bg-black text-white" 
          unselectedColor="border-black bg-white text-black" 
        />
      </div>
    </section>
  )
}
