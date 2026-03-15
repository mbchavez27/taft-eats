export default function FoodCard({
  food,
  img,
  isSelected,
}: {
  food?: string
  img?: string
  isSelected?: boolean
}) {
  return (
    <>
      <main
        className={`cursor-pointer transition duration-100 w-36 max-h-36 md:w-44 md:max-h-44 rounded-lg flex flex-col justify-between p-2 gap-4 border-black border-7 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          ${isSelected
            ? 'bg-[#326F33] text-white'
            : 'bg-[#F7C025] hover:bg-[#e6b11f] text-[#326F33] hover:text-white'
          }`}
      >
        <div className="flex justify-center items-center mt-3">
          <img
            src={img}
            alt=""
            className="object-contain max-w-full max-h-[90px] w-auto h-auto"
          />
        </div>
        <div className="font-lexend font-bold text-xl pb-2 truncate">
          {food ?? 'Food Name'}
        </div>
      </main>
    </>
  )
}
