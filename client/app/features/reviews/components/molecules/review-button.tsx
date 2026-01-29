type AddReviewButtonProps = {
  onClick?: () => void
  children: React.ReactNode
}

export default function ReviewButton({
  onClick,
  children,
}: AddReviewButtonProps) {
  return (
    <>
      <button
        className="bg-[#FFCB00] text-[#326F33] font-inter font-bold text-xl rounded-full px-6 py-2 hover:opacity-90
           transition duration-75"
        onClick={onClick}
      >
        {children}
      </button>
    </>
  )
}
