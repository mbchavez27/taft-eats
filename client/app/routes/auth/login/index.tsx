import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import type { Route } from './+types/index'
import { Checkbox } from '~/components/ui/checkbox'
import { useLogin, type LoginFormValues } from '~/features/auth/hooks/useLogin'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Login' }, { name: 'description', content: 'Taft Eats' }]
}

export default function Login() {
  const { form, onSubmit, serverError, isSubmitting } = useLogin()

  const {
    register,
    setValue,
    formState: { errors },
  } = form

  const getInputClass = (fieldName: keyof LoginFormValues) => {
    const hasError = !!errors[fieldName]
    return `border-2 rounded-md w-full p-2 outline-none transition-colors ${
      hasError
        ? 'border-red-500 focus:border-red-600'
        : 'border-black focus:border-[#326F33]'
    }`
  }

  return (
    <main className="flex justify-center items-center min-h-screen p-4">
      <form
        onSubmit={onSubmit}
        className="
        bg-white 
        font-lexend 
        flex flex-col justify-center items-center 
        gap-5 
        py-8 px-6 
        w-full max-w-[500px] 
        rounded-2xl 
        shadow-sm"
      >
        <img
          src="/logos/tafteats_logo.png"
          alt="Taft Eats Logo"
          className="w-[150px] h-[150px] object-contain"
        />

        <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="text-[#326F33] font-bold flex flex-col justify-center items-center text-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mt-2 leading-tight">
              Log in to Taft Eats!
            </h1>
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
              placeholder="Enter your password"
              {...register('password')}
              className={getInputClass('password')}
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex justify-center items-center gap-2 text-[#9CB16F] mt-1">
            <Checkbox
              id="rememberMe"
              onCheckedChange={(checked) =>
                setValue('rememberMe', checked as boolean, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className="
                border-2 border-[#9CB16F]
                data-[state=unchecked]:bg-white
                data-[state=unchecked]:border-[#9CB16F]
                data-[state=checked]:bg-[#9CB16F]
                data-[state=checked]:border-[#9CB16F]
                w-5 h-5
              "
            />
            <label
              htmlFor="rememberMe"
              className="cursor-pointer select-none text-sm font-medium"
            >
              Remember me
            </label>
          </div>

          {serverError && (
            <div className="w-full p-3 text-sm text-red-600 bg-red-50 rounded-md text-center border border-red-200 mt-2">
              {serverError}
            </div>
          )}

          <div className="flex mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#326F33] text-white font-bold rounded-lg w-full py-2 px-6 cursor-pointer hover:bg-[#285a29] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
