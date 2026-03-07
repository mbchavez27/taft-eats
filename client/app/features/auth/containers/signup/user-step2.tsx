import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { SignUpFormValues } from '../../hooks/useSignUp'

interface Step2Props {
  onBack: () => void
  form: UseFormReturn<SignUpFormValues>
  isLoading?: boolean
}

export function UserStep2({ onBack, form, isLoading }: Step2Props) {
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
          One Last Step!
        </h1>
        <p className="text-black font-normal mt-1">
          Tell us a bit about yourself.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <label
          htmlFor="avatar-upload"
          className="cursor-pointer group relative"
        >
          <Avatar className="w-24 h-24 border-2 border-[#326F33]">
            <AvatarImage src={avatarPreviewUrl} alt="Profile" />
            <AvatarFallback className="bg-[#f0fdf4] text-[#326F33]">
              <Camera size={32} />
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-xs text-white font-bold">Edit</span>
          </div>
        </label>
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setValue('avatar', e.target.files[0], {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          }}
        />
        <span className="text-sm text-[#9CB16F]">Upload Profile Picture</span>
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="username" className="text-black font-medium mb-1">
          Username *
        </label>
        <input
          type="text"
          id="username"
          {...register('username')}
          className={getInputClass('username')}
          placeholder="Choose a username"
        />
        {errors.username && (
          <span className="text-red-500 text-sm mt-1">
            {errors.username.message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="bio" className="text-black font-medium mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          {...register('bio')}
          className={`${getInputClass('bio')} min-h-[100px] resize-none`}
          placeholder="Tell us a little about yourself..."
        />
        {errors.bio && (
          <span className="text-red-500 text-sm mt-1">
            {errors.bio.message}
          </span>
        )}
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
