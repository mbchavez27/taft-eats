import { useState } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'

type StarsProps = {
  size?: number
  color?: string
  value?: number
  onChange?: (rating: number) => void
}

export default function Stars({
  size = 32,
  color = '#FFCB00',
  value = 0,
  onChange,
}: StarsProps) {
  const [hover, setHover] = useState<number>(0)

  const handleClick = (index: number) => {
    if (onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className="flex flex-wrap gap-4">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          onMouseEnter={() => setHover(index + 1)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer"
        >
          {index < (hover || value) ? (
            <FaStar size={size} color={color} />
          ) : (
            <FaRegStar size={size} color={color} />
          )}
        </div>
      ))}
    </div>
  )
}
