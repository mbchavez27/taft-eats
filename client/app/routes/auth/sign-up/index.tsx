import { useState } from 'react'
import type { Route } from './+types/index'
import { Step1 } from '~/features/auth/containers/signup/step1'
import { Step2 } from '~/features/auth/containers/signup/step2'
import { useSignUp } from '~/features/auth/hooks/useSignUp'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Sign Up' }, { name: 'description', content: 'Taft Eats' }]
}

export default function SignUp() {
  const [step, setStep] = useState(1)

  const { form, onSubmit, serverError, isSubmitting, validateStep1 } =
    useSignUp()

  const handleNextStep = async () => {
    const isValid = await validateStep1()
    if (isValid) {
      setStep(2)
    }
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

        {step === 1 && <Step1 onNext={handleNextStep} form={form} />}

        {step === 2 && (
          <Step2
            onBack={() => setStep(1)}
            form={form}
            isLoading={isSubmitting}
          />
        )}
        {serverError && (
          <div className="w-full p-3 text-sm text-red-600 bg-red-50 rounded-md text-center border border-red-200">
            {serverError}
          </div>
        )}
      </form>
    </main>
  )
}
