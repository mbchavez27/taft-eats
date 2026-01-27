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
      <section>
        <ReviewsList />
      </section>
    </main>
  )
}
