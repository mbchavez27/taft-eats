type AddReviewButtonProps = {
  onClick?: () => void
}

export default function AddReviewButton({ onClick }: AddReviewButtonProps) {
  return (
    <>
      <main className="flex justify-end">
        <button
          className="bg-[#FFCB00] text-[#326F33] font-inter font-bold text-xl rounded-full px-6 py-2 hover:opacity-90
           transition duration-75"
          onClick={onClick}
        >
          Write a Review
        </button>
      </main>
    </>
  )
}
