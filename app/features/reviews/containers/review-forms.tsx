import Stars from "~/features/shared/components/molecules/stars";

export default function ReviewForms() {
  return (
    <>
      <main className="bg-white rounded-xl w-full p-5 sm:py-8 sm:px-10 flex flex-col gap-10 h-125 overflow-hidden font-lexend font-bold text-[#326F33]">
        <section className="flex flex-col gap-5">
          <h1 className="text-3xl">How would you rate your experience?</h1>
          <div className="flex flex-wrap gap-4 px-2">
            <Stars size={48} />
          </div>
        </section>
        <section className="flex flex-col gap-5 flex-1">
          <label htmlFor="review" className="text-2xl">
            Tell us about your experience
          </label>
          <textarea
            name="review"
            id="review"
            className="text-black text-md border-2 border-black outline-none focus:outline-none rounded-lg p-3 w-full h-full resize-none"
            placeholder="Write your review here..."
          ></textarea>
          <p className="text-[#9CB16F]">
            Reviews need to be at least 20 characters.
          </p>
        </section>
      </main>
    </>
  );
}
