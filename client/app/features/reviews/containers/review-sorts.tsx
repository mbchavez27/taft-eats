import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

type SortValue = 'newest' | 'oldest' | 1 | 2 | 3 | 4 | 5

interface ReviewSortsProps {
  onSortChange: (sort: SortValue) => void
}

export default function ReviewSorts({ onSortChange }: ReviewSortsProps) {
  const [selected, setSelected] = useState<SortValue>('newest')

  const handleSelect = (value: SortValue) => {
    const next = selected === value ? 'newest' : value
    setSelected(next)
    onSortChange(next)
  }

  const starButtons: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5]

  return (
    <main className="flex gap-8">
      <section className="flex gap-2 flex-wrap">
        <div
          className={`font-inter font-bold text-xl rounded-full px-5 py-1 border-2 transition duration-100 cursor-pointer flex gap-1
            ${selected === 'newest' ? 'bg-[#9CB16F] text-white border-[#9CB16F]' : 'bg-white text-[#9CB16F] border-[#9CB16F] hover:bg-[#9CB16F] hover:text-white'}`}
          onClick={() => handleSelect('newest')}
        >
          Newest
        </div>

        <div
          className={`font-inter font-bold text-xl rounded-full px-5 py-1 border-2 transition duration-100 cursor-pointer flex gap-1
            ${selected === 'oldest' ? 'bg-[#9CB16F] text-white border-[#9CB16F]' : 'bg-white text-[#9CB16F] border-[#9CB16F] hover:bg-[#9CB16F] hover:text-white'}`}
          onClick={() => handleSelect('oldest')}
        >
          Oldest
        </div>

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