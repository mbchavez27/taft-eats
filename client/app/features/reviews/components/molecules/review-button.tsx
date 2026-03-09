import React from 'react'

// Extend standard HTML button attributes so it accepts type="submit", disabled, etc.
type AddReviewButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function ReviewButton({
  onClick,
  children,
  className,
  ...props // Catch the rest of the props (like type and disabled)
}: AddReviewButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        {...props} // Pass them into the native button
        className={`bg-[#FFCB00] text-[#326F33] font-inter font-bold text-xl rounded-full px-6 py-2 hover:opacity-90 transition duration-75 disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
      >
        {children}
      </button>
    </>
  )
}
