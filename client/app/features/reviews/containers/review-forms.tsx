import { useFormContext, Controller } from 'react-hook-form'
import Stars from '~/features/shared/components/molecules/stars'
import type { ReviewFormValues } from '../hooks/use-review'

export default function ReviewForms() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ReviewFormValues>()

  return (
    <main className="bg-white rounded-xl w-full p-5 sm:py-8 sm:px-10 flex flex-col gap-10 h-125 overflow-hidden font-lexend font-bold text-[#326F33]">
      <section className="flex flex-col gap-5">
        <h1 className="text-3xl">How would you rate your experience?</h1>
        <div className="flex flex-col gap-1 px-2">
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <Stars size={48} value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.rating && (
            <p className="text-red-500 text-sm">{errors.rating.message}</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-5 flex-1">
        <label htmlFor="body" className="text-2xl">
          Tell us about your experience
        </label>
        <textarea
          id="body"
          {...register('body')}
          className="text-black text-md border-2 border-black outline-none focus:outline-none rounded-lg p-3 w-full h-full resize-none"
          placeholder="Write your review here..."
        />
        {errors.body ? (
          <p className="text-red-500">{errors.body.message}</p>
        ) : (
          <p className="text-[#9CB16F]">
            Reviews need to be at least 20 characters.
          </p>
        )}
      </section>
    </main>
  )
}
