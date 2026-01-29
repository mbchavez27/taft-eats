import { ScrollArea } from "~/components/ui/scroll-area";
import { Checkbox } from "~/components/ui/checkbox";
import { tags } from "../../data/dummy_tags";

export default function SelectTags() {
  return (
    <>
      <section className="flex flex-col gap-2 px-8 py-2 pb-8">
        <div>
          <h1 className="font-bold text-2xl">Tags</h1>
        </div>
        <div className="text-[#BEBEBE] text-sm px-3">
          <div className="flex items-center gap-4">
            <Checkbox
              id="cuisine-all"
              className="
      border-2
      border-gray-400
      data-[state=unchecked]:bg-white
      data-[state=unchecked]:border-gray-400
      data-[state=checked]:bg-gray-500
      data-[state=checked]:border-gray-500
      data-[state=checked]:text-white
    "
            />
            <label htmlFor="cuisine-all">Select All</label>
          </div>

          <div className="font-inter text-[#326F33] font-semibold">
            <ScrollArea className="px-4 py-2 text-lg flex flex-col gap-2 h-32 scroll-left">
              {tags.map((tag) => (
                <div key={tag.id} className="flex gap-6 items-center">
                  <Checkbox
                    id={tag.id}
                    className="
              border-2
              border-green-600
              data-[state=unchecked]:bg-white
              data-[state=unchecked]:border-green-600
              data-[state=checked]:bg-green-600
              data-[state=checked]:border-green-600
              data-[state=checked]:text-white
            "
                  />
                  <label htmlFor={tag.id}>{tag.label}</label>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </section>
    </>
  );
}
