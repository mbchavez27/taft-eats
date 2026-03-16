import { useFormContext } from 'react-hook-form'
import type { ReplyFormValues } from '../hooks/useCreateReply'

export default function ReplyForms() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReplyFormValues>()

  return (
    <main className="bg-white rounded-xl w-full p-5 sm:py-8 sm:px-10 flex flex-col gap-10 h-125 overflow-hidden font-lexend font-bold text-[#326F33]">
      <section className="flex flex-col gap-5">
        <h1 className="text-3xl">Reply to User</h1>
      </section>

      <section className="flex flex-col gap-5 flex-1">
        <label htmlFor="body" className="text-2xl">
          Send Message to Reply
        </label>

        <textarea
          id="body"
          {...register('body')}
          className="text-black text-md border-2 border-black outline-none focus:outline-none rounded-lg p-3 w-full h-full resize-none font-inter font-normal"
          placeholder="Write your reply here..."
        />

        {errors.body ? (
          <p className="text-red-500 text-sm">{errors.body.message}</p>
        ) : (
          <p className="text-[#9CB16F]">
            Replies need to be at least 20 characters.
          </p>
        )}
      </section>
    </main>
  )
}
