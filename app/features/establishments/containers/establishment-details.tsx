import ReviewSorts from '~/features/reviews/containers/review-sorts'
import ReviewsList from '~/features/reviews/containers/reviews-list'

export default function EstablishmentDetails() {
  return (
    <main className="flex flex-col gap-8">
      <header>
        <h1 className="text-[#F9ECA8] font-climate uppercase text-7xl tracking-wider">
          EL POCO CANTINA
        </h1>
        <p className="font-lexend text-xl font-bold text-[#9CB16F]">
          945 Estrada Street, Malate, Manila - Metro Manila
        </p>
      </header>
      <section className="flex flex-col gap-4">
        <ReviewSorts />
        <ReviewsList />
        <section className="flex justify-end">
          <button
            className="bg-[#FFCB00] text-[#326F33] font-inter font-bold text-xl rounded-full px-6 py-2 hover:opacity-90
           transition duration-75"
          >
            Write a Review
          </button>
        </section>
      </section>
    </main>
  )
}
