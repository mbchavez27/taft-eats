export default function FoodCard({ food }: { food?: string }) {
  return (
    <>
      <main className="bg-[#FFD24D] hover:bg-[#FFBF00] text-[#326F33] hover:text-white transition duration-100 w-36 min-h-36 md:w-44 md:min-h-44 rounded-md flex flex-col justify-between p-2 gap-4 drop-shadow-2xl">
        <div className="flex justify-center"></div>
        <div className="font-lexend font-bold  text-xl pb-2 truncate">
          {food ?? 'Food Name'}
        </div>
      </main>
    </>
  )
}
