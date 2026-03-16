import { useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Checkbox } from '~/components/ui/checkbox'
import Prices from '~/features/shared/components/molecules/prices'
import { initial_tags } from '~/features/filter-menu/data/tags'
import type { ReviewFormValues } from '../hooks/useCreateReview'

type CustomTag = { id: bigint | string | number; label: string }

export default function ReviewTags() {
  const formContext = useFormContext<ReviewFormValues>()

  // Local state for adding custom tags
  const [customTags, setCustomTags] = useState<CustomTag[]>([])
  const [tagInput, setTagInput] = useState('')

  if (!formContext) {
    return (
      <div className="p-5 text-red-500">
        Error: Missing FormProvider wrapper
      </div>
    )
  }

  const { control, watch, setValue } = formContext

  const selectedTags = watch('tags') || []

  // Handle toggling tags on and off
  const handleTagToggle = (tagObj: CustomTag, checked: boolean | string) => {
    if (checked) {
      setValue('tags', [...selectedTags, tagObj], {
        shouldDirty: true,
        shouldValidate: true,
      })
    } else {
      setValue(
        'tags',
        selectedTags.filter((t) => t.id !== tagObj.id),
        { shouldDirty: true, shouldValidate: true },
      )
    }
  }

  // Handle adding a brand new custom tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return
    const newTag: CustomTag = {
      id: BigInt(-Date.now()), // Negative ID tells the backend it's a new tag
      label: tagInput.trim(),
    }
    setCustomTags([...customTags, newTag])
    setTagInput('')
    setValue('tags', [...selectedTags, newTag], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  // Combine initial tags from your data file with any custom ones the user just made
  const allTags = [...initial_tags, ...customTags]

  return (
    <>
      <main className="bg-white rounded-xl w-full p-7 font-lexend font-bold text-[#326F33] flex flex-col gap-5">
        <section>
          <h1 className="uppercase underline font-climate text-3xl text-black">
            Filters
          </h1>
        </section>
        <section className="flex flex-col gap-2">
          <p className="text-2xl text-black">Price Range</p>
          <div className="py-1 flex gap-2">
            <Controller
              name="price_range"
              control={control}
              render={({ field }) => (
                <Prices
                  values={field.value ? [field.value] : []}
                  onChange={field.onChange}
                  textSize="text-md"
                  unselectedColor="bg-white text-[#416CAE] border-[#416CAE] border-2"
                  selectedColor="bg-[#416CAE] text-white border-[#416CAE]"
                />
              )}
            />
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <p className="text-2xl text-black">Tags</p>
          <div className="font-inter text-black font-semibold">
            <ScrollArea className="px-4 py-2 text-xl flex flex-col gap-6 h-48 scroll-left">
              {/* Existing Tags */}
              {allTags.map((tag) => {
                const isChecked = selectedTags.some((t) => t.id === tag.id)
                return (
                  <div
                    key={tag.id.toString()}
                    className="flex gap-6 items-center text-black mb-4"
                  >
                    <Checkbox
                      id={tag.id.toString()}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleTagToggle(tag, checked)
                      }
                      className="
                        border-2 h-6 w-6
                        data-[state=unchecked]:bg-white
                        data-[state=unchecked]:border-[#416CAE]
                        data-[state=checked]:bg-[#416CAE]
                        data-[state=checked]:border-[#416CAE]
                        data-[state=checked]:text-white
                      "
                    />
                    <label
                      htmlFor={tag.id.toString()}
                      className="cursor-pointer"
                    >
                      {tag.label}
                    </label>
                  </div>
                )
              })}

              {/* Input box for new custom tags - Designed to match the checkboxes */}
              <div className="flex gap-6 items-center text-black mb-4">
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="flex items-center justify-center border-2 border-[#416CAE] text-[#416CAE] hover:bg-[#416CAE] hover:text-white transition-colors h-6 w-6 rounded-sm shrink-0"
                  aria-label="Add custom tag"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                </button>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault() // Prevents the form from submitting
                      handleAddTag()
                    }
                  }}
                  placeholder="Add custom tag..."
                  className="flex-1 bg-transparent outline-none placeholder-gray-400 text-xl font-semibold border-b-2 border-transparent focus:border-[#416CAE] transition-colors pb-0.5"
                />
              </div>
            </ScrollArea>
          </div>
        </section>
      </main>
    </>
  )
}
