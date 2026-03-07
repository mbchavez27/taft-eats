import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { SignUpFormValues } from '../../hooks/useSignUp'
import { Checkbox } from '~/components/ui/checkbox'
import {
  initial_cuisines,
  initial_foods,
  initial_tags,
} from '~/features/filter-menu/data/tags'

interface Step3Props {
  onBack: () => void
  onNext?: () => void
  form: UseFormReturn<SignUpFormValues>
  isLoading?: boolean
}

// Strictly locked to bigint to match your database and Zod schema
type CustomTag = { id: bigint; label: string }

export function OwnerStep3({ onBack, form, isLoading }: Step3Props) {
  const { setValue, watch } = form

  const selectedTags = watch('tags') || []

  const currentPriceRange = watch('price_range')

  // --- Local State for Custom Tags ---
  const [customFoods, setCustomFoods] = useState<CustomTag[]>([])
  const [foodInput, setFoodInput] = useState('')

  const [customCuisines, setCustomCuisines] = useState<CustomTag[]>([])
  const [cuisineInput, setCuisineInput] = useState('')

  const [customTags, setCustomTags] = useState<CustomTag[]>([])
  const [tagInput, setTagInput] = useState('')

  // --- Toggle tag selection in React Hook Form ---
  const handleToggleTag = (tag: CustomTag, isChecked: boolean) => {
    if (isChecked) {
      setValue('tags', [...selectedTags, tag], { shouldValidate: true })
    } else {
      setValue(
        'tags',
        selectedTags.filter((t) => t.id !== tag.id),
        { shouldValidate: true },
      )
    }
  }

  const isTagSelected = (id: bigint) => {
    return selectedTags.some((t) => t.id === id)
  }

  // --- Handlers for Adding Custom Tags (Using negative BigInt for temp IDs) ---
  const handleAddFood = () => {
    if (!foodInput.trim()) return
    // Generate a temporary negative bigint based on the current timestamp
    const newFood: CustomTag = {
      id: BigInt(-Date.now()),
      label: foodInput.trim(),
    }
    setCustomFoods([...customFoods, newFood])
    setFoodInput('')
    setValue('tags', [...selectedTags, newFood], { shouldValidate: true })
  }

  const handleAddCuisine = () => {
    if (!cuisineInput.trim()) return
    const newCuisine: CustomTag = {
      id: BigInt(-Date.now()),
      label: cuisineInput.trim(),
    }
    setCustomCuisines([...customCuisines, newCuisine])
    setCuisineInput('')
    setValue('tags', [...selectedTags, newCuisine], { shouldValidate: true })
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return
    const newTag: CustomTag = {
      id: BigInt(-Date.now()),
      label: tagInput.trim(),
    }
    setCustomTags([...customTags, newTag])
    setTagInput('')
    setValue('tags', [...selectedTags, newTag], { shouldValidate: true })
  }

  return (
    <div className="w-full flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-[#326F33] font-bold flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl md:text-3xl font-bold mt-2 leading-tight">
          Last Step!
        </h1>
        <p className="text-black font-normal mt-1">
          Select which food tags apply to your establishment:
        </p>
      </div>

      {/* --- FOODS SECTION --- */}
      <div className="flex flex-col justify-center items-center w-full">
        <p className="text-xl text-black font-bold mt-4 mb-2 ">Foods</p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-12 px-8 py-4 w-fit mx-auto">
          {[...initial_foods, ...customFoods].map((tag) => (
            <div
              key={tag.id.toString()}
              className="flex gap-3 items-center text-black"
            >
              <Checkbox
                id={tag.id.toString()}
                checked={isTagSelected(tag.id)}
                onCheckedChange={(checked) =>
                  handleToggleTag(tag, checked as boolean)
                }
                className="border-2 border-gray-800 data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-800 data-[state=checked]:bg-[#416CAE] data-[state=checked]:border-[#416CAE] data-[state=checked]:text-white w-6 h-6 rounded-sm cursor-pointer"
              />
              <label
                htmlFor={tag.id.toString()}
                className="text-lg font-semibold cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag.label}
              </label>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 px-8 w-full max-w-sm">
          <input
            type="text"
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddFood()
              }
            }}
            placeholder="Add custom food..."
            className="flex-1 border-2 border-gray-300 rounded-md p-2 outline-none focus:border-[#326F33] transition-colors text-sm"
          />
          <button
            type="button"
            onClick={handleAddFood}
            className="bg-[#326F33] text-white p-2 rounded-md hover:bg-[#285a29] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <hr />

      {/* --- CUISINES SECTION --- */}
      <div className="flex flex-col justify-center items-center w-full">
        <p className="text-xl text-black font-bold mb-2 ">Cuisines</p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-12 px-8 py-4 w-fit mx-auto">
          {[...initial_cuisines, ...customCuisines].map((tag) => (
            <div
              key={tag.id.toString()}
              className="flex gap-3 items-center text-black"
            >
              <Checkbox
                id={tag.id.toString()}
                checked={isTagSelected(tag.id)}
                onCheckedChange={(checked) =>
                  handleToggleTag(tag, checked as boolean)
                }
                className="border-2 border-gray-800 data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-800 data-[state=checked]:bg-[#416CAE] data-[state=checked]:border-[#416CAE] data-[state=checked]:text-white w-6 h-6 rounded-sm cursor-pointer"
              />
              <label
                htmlFor={tag.id.toString()}
                className="text-lg font-semibold cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag.label}
              </label>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 px-8 w-full max-w-sm">
          <input
            type="text"
            value={cuisineInput}
            onChange={(e) => setCuisineInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCuisine()
              }
            }}
            placeholder="Add custom cuisine..."
            className="flex-1 border-2 border-gray-300 rounded-md p-2 outline-none focus:border-[#326F33] transition-colors text-sm"
          />
          <button
            type="button"
            onClick={handleAddCuisine}
            className="bg-[#326F33] text-white p-2 rounded-md hover:bg-[#285a29] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <hr />

      {/* --- TAGS SECTION --- */}
      <div className="flex flex-col justify-center items-center w-full">
        <p className="text-xl text-black font-bold mb-2 ">Tags</p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-12 px-8 py-4 w-fit mx-auto">
          {[...initial_tags, ...customTags].map((tag) => (
            <div
              key={tag.id.toString()}
              className="flex gap-3 items-center text-black"
            >
              <Checkbox
                id={tag.id.toString()}
                checked={isTagSelected(tag.id)}
                onCheckedChange={(checked) =>
                  handleToggleTag(tag, checked as boolean)
                }
                className="border-2 border-gray-800 data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-800 data-[state=checked]:bg-[#416CAE] data-[state=checked]:border-[#416CAE] data-[state=checked]:text-white w-6 h-6 rounded-sm cursor-pointer"
              />
              <label
                htmlFor={tag.id.toString()}
                className="text-lg font-semibold cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag.label}
              </label>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 px-8 w-full max-w-sm">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddTag()
              }
            }}
            placeholder="Add custom tag..."
            className="flex-1 border-2 border-gray-300 rounded-md p-2 outline-none focus:border-[#326F33] transition-colors text-sm"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-[#326F33] text-white p-2 rounded-md hover:bg-[#285a29] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <hr />

      {/* --- Price Ranges & Footer --- */}
      <div className="flex flex-col justify-center items-center gap-2 mb-8">
        <p className="text-xl text-black font-bold mb-2 ">Price Ranges</p>
        <div className="flex gap-4">
          {[
            { label: '₱', value: '$' },
            { label: '₱₱', value: '$$' },
            { label: '₱₱₱', value: '$$$' },
          ].map((price, index) => {
            const isSelected = currentPriceRange === price.value
            return (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setValue('price_range', price.value as '$' | '$$' | '$$$', {
                    shouldValidate: true,
                  })
                }
                className={`font-bold rounded-xl px-5 py-0.5 border-2 transition text-lg ${
                  isSelected
                    ? 'bg-[#416CAE] text-white border-[#416CAE]'
                    : 'bg-white text-[#326F33] border-[#416CAE]'
                }`}
              >
                {price.label}
              </button>
            )
          })}
        </div>
      </div>
      <p className="text-xs text-center text-[#326F33] leading-tight px-2">
        By continuing, you agree to Taft Eat’s{' '}
        <span className="font-bold underline cursor-pointer">
          Terms of Service
        </span>{' '}
        and acknowledge Taft Eat’s{' '}
        <span className="font-bold underline cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>

      <div className="flex justify-center gap-3 mt-1">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="bg-[#326F33] text-white font-bold rounded-full py-2 px-10 cursor-pointer hover:bg-[#285a29] transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#326F33] text-white font-bold rounded-full py-2 px-10 cursor-pointer hover:bg-[#285a29] transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
              Saving...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </div>
    </div>
  )
}
