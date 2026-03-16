import { Camera, Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { SignUpFormValues } from '../../hooks/useSignUp'

interface Step2Props {
  onBack: () => void
  onNext: () => void
  form: UseFormReturn<SignUpFormValues>
  isLoading?: boolean
}

export function OwnerStep2({ onBack, onNext, form, isLoading }: Step2Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form

  // Watch the banner file
  const bannerFile = watch('restaurantBanner')
  const bannerPreviewUrl =
    bannerFile instanceof File || bannerFile instanceof Blob
      ? URL.createObjectURL(bannerFile)
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
          Fill up to proceed
        </h1>
      </div>

      {/* Banner Upload UI */}
      <div className="flex flex-col w-full gap-2">
        <label
          htmlFor="banner-upload"
          className="cursor-pointer group relative w-full h-32 rounded-xl border-2 border-dashed border-[#326F33] bg-[#f0fdf4] flex flex-col items-center justify-center overflow-hidden transition-colors hover:bg-green-100"
        >
          {bannerPreviewUrl ? (
            <>
              <img
                src={bannerPreviewUrl}
                alt="Banner Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-sm text-white font-bold">
                  Change Banner
                </span>
              </div>
            </>
          ) : (
            <>
              <Camera size={32} className="text-[#326F33] mb-2" />
              <span className="text-sm text-[#326F33] font-medium">
                Upload Establishment Banner
              </span>
            </>
          )}
        </label>

        <input
          type="file"
          id="banner-upload"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setValue('restaurantBanner', e.target.files[0], {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          }}
        />
        {errors.restaurantBanner && (
          <span className="text-red-500 text-sm">
            {errors.restaurantBanner.message as string}
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="flex flex-col w-full">
        <label htmlFor="restaurantName" className="text-black font-medium mb-1">
          Establishment Name*
        </label>
        <input
          type="text"
          id="restaurantName"
          {...register('restaurantName')}
          className={getInputClass('restaurantName')}
          placeholder="Choose an Establishment Name"
        />
        {errors.restaurantName && (
          <span className="text-red-500 text-sm mt-1">
            {errors.restaurantName.message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-full">
        <label
          htmlFor="restaurantDescription"
          className="text-black font-medium mb-1"
        >
          Description
        </label>
        <textarea
          id="restaurantDescription"
          {...register('restaurantDescription')}
          className={`${getInputClass('restaurantDescription')} min-h-[100px] resize-none`}
          placeholder="Tell us a little about the establishment"
        />
        {errors.restaurantDescription && (
          <span className="text-red-500 text-sm mt-1">
            {errors.restaurantDescription.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-black font-medium text-lg">Location Details</p>

        <div className="flex flex-col w-full">
          <label htmlFor="location" className="text-black font-regular mb-1">
            Address *
          </label>
          <input
            type="text"
            id="location"
            {...register('location')}
            className={getInputClass('location')}
            placeholder="e.g. 2401 Taft Ave, Malate, Manila"
          />
          {errors.location && (
            <span className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </span>
          )}
        </div>

        <div className="flex gap-2 w-full mt-2">
          <div className="flex flex-col w-full">
            <label htmlFor="latitude" className="text-black font-regular mb-1">
              Latitude *
            </label>
            <input
              type="number"
              id="latitude"
              step="0.000001"
              {...register('latitude', { valueAsNumber: true })}
              className={getInputClass('latitude')}
              placeholder="e.g. 14.5995"
            />
            {errors.latitude && (
              <span className="text-red-500 text-sm mt-1">
                {errors.latitude.message}
              </span>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="longitude" className="text-black font-regular mb-1">
              Longitude *
            </label>
            <input
              type="number"
              id="longitude"
              step="0.000001"
              {...register('longitude', { valueAsNumber: true })}
              className={getInputClass('longitude')}
              placeholder="e.g. 120.9842"
            />
            {errors.longitude && (
              <span className="text-red-500 text-sm mt-1">
                {errors.longitude.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="bg-[#326F33] text-white font-bold rounded-full py-2 px-10 hover:bg-[#285a29] transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={onNext}
          className="bg-[#326F33] text-white font-bold rounded-full py-2 px-10 hover:bg-[#285a29] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
