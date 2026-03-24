import { ScrollArea } from '~/components/ui/scroll-area'
import { Checkbox } from '~/components/ui/checkbox'
import { useFilterStore } from '../../store/filter.store'
import type { BackendTag } from '../../services/filters.services'

interface SelectTagsProps {
  tags: BackendTag[]
}

export default function SelectTags({ tags }: SelectTagsProps) {
  const { selectedTags, toggleTag } = useFilterStore()

  return (
    <section className="flex flex-col gap-2 px-8 py-2 pb-8">
      <div>
        <h1 className="font-bold text-2xl text-black">Tags</h1>
      </div>
      <div className="text-[#BEBEBE] text-sm px-3">
        <div className="font-inter text-[#326F33] font-semibold">
          <ScrollArea className="px-4 py-2 text-lg flex flex-col gap-2 h-32 scroll-left">
            {tags.map((tag) => (
              <div
                key={tag.tag_id}
                className="flex gap-6 items-center text-black"
              >
                <Checkbox
                  id={`tag-${tag.tag_id}`}
                  checked={selectedTags.includes(tag.name)}
                  onCheckedChange={() => toggleTag(tag.name)}
                  className="border-2 border-[#416CAE] data-[state=checked]:bg-[#416CAE] data-[state=checked]:text-white"
                />
                <label htmlFor={`tag-${tag.tag_id}`}>{tag.name}</label>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </section>
  )
}
