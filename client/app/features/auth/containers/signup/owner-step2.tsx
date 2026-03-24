import type { UseFormReturn } from 'react-hook-form'
import type { SignUpFormValues } from '../../hooks/useSignUp'
import { useState, Suspense, lazy } from 'react'
import { Camera, MapPin, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
const LocationPickerMap = lazy(() => import('./location-picker-map'))

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

  const [showMap, setShowMap] = useState(false)

  // Watch coordinates for the marker and manual inputs
  const lat = watch('latitude')
  const lng = watch('longitude')

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
        <div className="flex items-center justify-between">
          <p className="text-black font-medium text-lg">Location Details</p>
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-1 text-xs font-bold text-[#326F33] bg-green-50 px-3 py-1.5 rounded-full"
          >
            <MapPin size={14} />
            {showMap ? 'Hide Map' : 'Pin on Map'}
          </button>
        </div>

        {showMap && (
          <div className="w-full h-64 rounded-xl border-2 border-black overflow-hidden relative">
            <Suspense
              fallback={
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <Loader2 className="animate-spin text-[#326F33]" />
                </div>
              }
            >
              <LocationPickerMap
                lat={lat}
                lng={lng}
                onLocationSelect={(newLat, newLng) => {
                  setValue('latitude', newLat, { shouldValidate: true })
                  setValue('longitude', newLng, { shouldValidate: true })
                }}
              />
            </Suspense>
          </div>
        )}

        {/* Manual Inputs */}
        <div className="flex flex-col w-full">
          <label className="text-black font-medium mb-1">Address *</label>
          <input
            type="text"
            {...register('location')}
            className={getInputClass('location')}
          />
        </div>

        <div className="flex gap-2 w-full">
          <div className="flex flex-col w-1/2">
            <label className="text-[10px] uppercase text-gray-400 font-bold">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              {...register('latitude')}
              className="border-b text-sm py-1 outline-none"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="text-[10px] uppercase text-gray-400 font-bold">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              {...register('longitude')}
              className="border-b text-sm py-1 outline-none"
            />
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
