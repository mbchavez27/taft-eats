import { ScrollArea } from '~/components/ui/scroll-area'
import { Checkbox } from '~/components/ui/checkbox'
import { tags } from '../../data/dummy_tags'
import { useFilterStore } from "../../store/filter.store";

export default function SelectTags() {
  const { selectedTags, toggleTag } = useFilterStore()

  return (
    <>
      <section className="flex flex-col gap-2 px-8 py-2 pb-8">
        <div>
          <h1 className="font-bold text-2xl text-black">Tags</h1>
        </div>
        <div className="text-[#BEBEBE] text-sm px-3">
          <div className="flex items-center gap-4">
          </div>

          <div className="font-inter text-[#326F33] font-semibold">
        <ScrollArea className="px-4 py-2 text-lg flex flex-col gap-2 h-32 scroll-left">
          {tags.map((tag) => (
            <div key={tag.id} className="flex gap-6 items-center text-black">
              <Checkbox
                id={tag.id.toString()}
                checked={selectedTags.includes(tag.label)}
                onCheckedChange={() => toggleTag(tag.label)}
                className="border-2 border-[#416CAE] data-[state=checked]:bg-[#416CAE] data-[state=checked]:text-white"
              />
              <label htmlFor={tag.id.toString()}>{tag.label}</label>
            </div>
          ))}
        </ScrollArea>
      </div>
        </div>
      </section>
    </>
  )
}
