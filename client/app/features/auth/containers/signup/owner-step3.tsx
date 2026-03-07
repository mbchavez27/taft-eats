import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { SignUpFormValues } from '../../hooks/useSignUp'
import { Checkbox } from '~/components/ui/checkbox'
import Prices from '~/features/shared/components/molecules/prices'
import { initial_tags } from '~/features/filter-menu/data/tags'

interface Step2Props {
  onBack: () => void
  onNext: () => void
  form: UseFormReturn<SignUpFormValues>
  isLoading?: boolean
}

export function OwnerStep3({ onBack, onNext, form, isLoading }: Step2Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form

  const avatarFile = watch('avatar')

  const avatarPreviewUrl =
    avatarFile instanceof File || avatarFile instanceof Blob
      ? URL.createObjectURL(avatarFile)
      : ''

  const getInputClass = (fieldName: keyof SignUpFormValues) => {
    const hasError = !!errors[fieldName]
    return `border-2 rounded-md w-full p-2 outline-none transition-colors ${
      hasError
        ? 'border-red-500 focus:border-red-600'
        : 'border-black focus:border-[#326F33]'
    }`
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

      <div className="flex flex-col justify-center items-center">
        <p className="text-xl text-black font-bold mb-2 ">Tags</p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-12 px-8 py-4 w-fit mx-auto">
          {initial_tags.map((tag) => (
            <div key={tag.id} className="flex gap-3 items-center text-black">
              <Checkbox
                id={tag.id.toString()}
                className="
                border-2
                border-gray-800
                data-[state=unchecked]:bg-white
                data-[state=unchecked]:border-gray-800
                data-[state=checked]:bg-[#416CAE]
                data-[state=checked]:border-[#416CAE]
                data-[state=checked]:text-white
                w-6 h-6 rounded-sm cursor-pointer
              "
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
      </div>
      <div className="flex flex-col justify-center items-center gap-2 mb-8">
        <p className="text-xl text-black font-bold mb-2 ">Price Ranges</p>
        <div className="flex gap-4">
          <Prices />
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
              <Loader2 className="w-5 h-5 animate-spin" />
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
