import { useState } from 'react'
import type { Route } from './+types/index'
import { Step1 } from '~/features/auth/containers/signup/step1'
import { UserStep2 } from '~/features/auth/containers/signup/user-step2'
import { useSignUp } from '~/features/auth/hooks/useSignUp'
import { OwnerStep2 } from '~/features/auth/containers/signup/owner-step2'
import { OwnerStep3 } from '~/features/auth/containers/signup/owner-step3'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Sign Up' }, { name: 'description', content: 'Taft Eats' }]
}

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'owner' | 'user'>('user')

  const { form, onSubmit, serverError, isSubmitting, validateStep1 } =
    useSignUp()

  const handleNextStep = async (selectedRole: 'owner' | 'user') => {
    const isValid = await validateStep1()
    if (isValid) {
      setRole(selectedRole)
      form.setValue('role', selectedRole)
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

        {step === 2 && role === 'owner' && (
          <OwnerStep2
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            form={form}
            isLoading={isSubmitting}
          />
        )}
        {step === 2 && role === 'user' && (
          <UserStep2
            onBack={() => setStep(1)}
            form={form}
            isLoading={isSubmitting}
          />
        )}
        {step === 3 && (
          <OwnerStep3
            onBack={() => setStep(2)}
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
