import { ScrollArea } from '~/components/ui/scroll-area'
import { Checkbox } from '~/components/ui/checkbox'
import { useFilterStore } from '../../store/filter.store'
import type { BackendTag } from '../../services/filters.services'

interface SelectCuisinesProps {
  cuisines: BackendTag[]
}

export default function SelectCuisines({ cuisines }: SelectCuisinesProps) {
  const { selectedCuisines, toggleCuisine } = useFilterStore()

  return (
    <section className="flex flex-col gap-2 px-8 py-4 pb-6">
      <div>
        <h1 className="font-bold text-2xl text-black">Cuisines</h1>
      </div>
      <div className="text-[#BEBEBE] text-sm px-3">
        <div className="font-inter text-[#326F33] font-semibold">
          <ScrollArea className="px-4 py-2 text-lg flex flex-col gap-6 h-32 scroll-left">
            {cuisines.map((cuisine) => (
              <div
                key={cuisine.tag_id}
                className="flex gap-2 items-center text-black"
              >
                <Checkbox
                  id={`cuisine-${cuisine.tag_id}`}
                  checked={selectedCuisines.includes(cuisine.name)}
                  onCheckedChange={() => toggleCuisine(cuisine.name)}
                  className="border-2 border-[#416CAE] data-[state=checked]:bg-[#416CAE] data-[state=checked]:text-white"
                />
                <label htmlFor={`cuisine-${cuisine.tag_id}`}>
                  {cuisine.name}
                </label>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </section>
  )
}
