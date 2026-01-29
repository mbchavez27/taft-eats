import { ScrollArea } from "~/components/ui/scroll-area";
import { Checkbox } from "~/components/ui/checkbox";
import Prices from "~/features/shared/components/molecules/prices";
import { tags } from "~/features/filter-menu/data/dummy_tags";

export default function ReviewTags() {
  return (
    <>
      <main className="bg-white rounded-xl w-full p-7 font-lexend font-bold text-[#326F33] flex flex-col gap-5">
        <section>
          <h1 className="uppercase underline font-climate text-3xl text-[#326F33]">
            Filters
          </h1>
        </section>
        <section className="flex flex-col gap-2">
          <p className="text-2xl">Price Range</p>
          <div className="py-1 flex gap-2">
            <Prices
              textSize="text-md"
              unselectedColor="bg-white text-[#FFCB00] border-[#FFCB00]"
              selectedColor="bg-[#FFCB00] text-white border-[#FFCB00]"
            />
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <p className="text-2xl">Tags</p>
          <div className="font-inter text-[#326F33] font-semibold">
            <ScrollArea className="px-4 py-2 text-xl flex flex-col gap-6 h-48 scroll-left">
              {tags.map((tag) => (
                <div key={tag.id} className="flex gap-6 items-center">
                  <Checkbox
                    id={tag.id}
                    className="
          border-2
          data-[state=unchecked]:bg-white
          data-[state=unchecked]:border-[#FFCB00]
          data-[state=checked]:bg-[#FFCB00]
          data-[state=checked]:border-[#FFCB00]
          data-[state=checked]:text-white
        "
                  />
                  <label htmlFor={tag.id}>{tag.label}</label>
                </div>
              ))}
            </ScrollArea>
          </div>
        </section>
      </main>
    </>
  );
}
