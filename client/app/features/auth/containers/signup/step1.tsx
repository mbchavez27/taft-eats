import type { UseFormReturn } from 'react-hook-form'
import type { SignUpFormValues } from '../../hooks/useSignUp'

interface Step1Props {
  onNext: () => void
  form: UseFormReturn<SignUpFormValues>
}

export function Step1({ onNext, form }: Step1Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = form

  const passwordValue = watch('password')
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/

  const getInputClass = (fieldName: keyof SignUpFormValues) => {
    const hasError = !!errors[fieldName]
    return `border-2 rounded-md w-full p-2 outline-none transition-colors ${
      hasError
        ? 'border-red-500 focus:border-red-600'
        : 'border-black focus:border-[#326F33]'
    }`
  }

  return (
    <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="text-[#326F33] font-bold flex flex-col justify-center items-center text-center mb-2">
        <h1 className="text-2xl md:text-3xl font-bold mt-2 leading-tight">
          Sign Up to unlock the <br className="hidden md:block" />
          best of Taft Eats!
        </h1>
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="name" className="text-black font-medium mb-1">
          Name *
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          {...register('name')}
          className={getInputClass('name')}
        />
        {errors.name && (
          <span className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="email" className="text-black font-medium mb-1">
          Email *
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={getInputClass('email')}
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="password" className="text-black font-medium mb-1">
          Password *
        </label>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          {...register('password')}
          className={getInputClass('password')}
        />
        {errors.password && (
          <span className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="flex flex-col w-full">
        <label
          htmlFor="confirmPassword"
          className="text-black font-medium mb-1"
        >
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          {...register('confirmPassword')}
          className={getInputClass('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <div className="flex mt-2">
        <button
          type="button"
          onClick={onNext}
          className="bg-[#326F33] text-white font-bold rounded-lg w-full py-2 px-6 cursor-pointer hover:bg-[#285a29] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
