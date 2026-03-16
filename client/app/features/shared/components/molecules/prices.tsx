type PricesProps = {
  textSize?: string
  selectedColor?: string
  unselectedColor?: string
  values?: string[] // Changed to array
  onChange?: (val: string) => void
}

export default function Prices({
  textSize = 'text-lg',
  selectedColor = 'bg-[#416CAE] text-white border-[#416CAE]',
  unselectedColor = 'bg-white text-[#326F33] border-[#416CAE]',
  values = [],
  onChange,
}: PricesProps) {
  const priceOptions = [
    { label: '₱', val: '$' },
    { label: '₱₱', val: '$$' },
    { label: '₱₱₱', val: '$$$' },
  ]

  return (
    <>
      {priceOptions.map((price, index) => {
        const isSelected = values.includes(price.val)

        return (
          <button
            type="button"
            key={index}
            onClick={() => onChange?.(price.val)}
            className={`font-bold rounded-xl px-5 py-0.5 border-2 transition ${textSize} ${
              isSelected ? selectedColor : unselectedColor
            }`}
          >
            {price.label}
          </button>
        )
      })}
    </>
  )
}
