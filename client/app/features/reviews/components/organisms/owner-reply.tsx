// ~/features/reviews/components/organisms/owner-reply.tsx
export default function OwnerReply({
  body,
  date,
}: {
  body: string
  date: string
}) {
  return (
    <div className="bg-[#F0F4F8] border-l-4 border-[#416CAE] rounded-r-lg p-4 mt-4 w-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-1">
        <p className="font-lexend font-bold text-[#416CAE] text-sm uppercase">
          Restaurant Owner
        </p>
        <p className="text-xs text-gray-500 font-inter">
          {new Date(date).toLocaleDateString()}
        </p>
      </div>
      <p className="font-inter text-black text-md leading-relaxed">{body}</p>
    </div>
  )
}
