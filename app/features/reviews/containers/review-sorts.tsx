import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

export default function ReviewSorts() {
  const [selected, setSelected] = useState<string | number>('')

  const handleSelect = (value: string | number) => {
    setSelected(selected === value ? '' : value)
  }

  const starButtons = [1, 2, 3, 4, 5]

  return (
    <main className="flex gap-8">
      <section className="flex gap-2">
        {/* Newest button */}
        <div
          className={`font-inter font-bold text-xl rounded-full px-5 py-1 border-2 transition duration-100 cursor-pointer flex gap-1
            ${selected === 'newest' ? 'bg-[#9CB16F] text-white border-[#9CB16F]' : 'bg-white text-[#9CB16F] border-[#9CB16F] hover:bg-[#9CB16F] hover:text-white'}`}
          onClick={() => handleSelect('newest')}
        >
          Newest
        </div>

        {/* Oldest button */}
        <div
          className={`font-inter font-bold text-xl rounded-full px-5 py-1 border-2 transition duration-100 cursor-pointer flex gap-1
            ${selected === 'oldest' ? 'bg-[#9CB16F] text-white border-[#9CB16F]' : 'bg-white text-[#9CB16F] border-[#9CB16F] hover:bg-[#9CB16F] hover:text-white'}`}
          onClick={() => handleSelect('oldest')}
        >
          Oldest
        </div>

        {/* Star buttons */}
        {starButtons.map((starCount) => (
          <div
            key={starCount}
            className={`rounded-full px-5 py-1 border-2 flex gap-1 transition duration-100 cursor-pointer
              ${selected === starCount ? 'bg-[#9CB16F] text-white border-[#9CB16F]' : 'bg-white text-[#9CB16F] border-[#9CB16F] hover:bg-[#9CB16F] hover:text-white'}`}
            onClick={() => handleSelect(starCount)}
          >
            {Array.from({ length: starCount }).map((_, index) => (
              <FaStar key={index} size={28} />
            ))}
          </div>
        ))}
      </section>
    </main>
  )
}
