import { useState } from 'react'

export default function PriceRange() {
  const [selected, setSelected] = useState<number | null>(null)

  const prices = ['₱', '₱₱', '₱₱₱']

  return (
    <section className="flex flex-col gap-2 px-8 py-2">
      <h1 className="font-bold text-2xl">Price Range</h1>

      <div className="py-1 flex gap-2">
        {prices.map((price, index) => {
          const isSelected = selected === index

          return (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`font-bold text-lg rounded-xl px-5 py-0.5 border-2 transition
                ${
                  isSelected
                    ? 'bg-[#326F33] text-white border-[#326F33]'
                    : 'bg-white text-[#326F33] border-[#326F33]'
                }
              `}
            >
              {price}
            </button>
          )
        })}
      </div>
    </section>
  )
}
