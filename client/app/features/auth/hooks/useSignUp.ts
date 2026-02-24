import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { AuthService } from '../services/auth.services'
import { useAuthStore } from '../context/auth.store'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .regex(
        passwordRegex,
        'Password must contain an uppercase, lowercase, number, and special character.',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    bio: z.string().optional(),
    avatar: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>

export const useSignUp = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const verifySession = useAuthStore((state) => state.verifySession)

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      bio: '',
      avatar: null,
    },
  })

  const submitHandler = async (data: SignUpFormValues) => {
    setServerError(null)
    try {
      const { confirmPassword, ...payload } = data

      await AuthService.register(payload)

      await verifySession()
      navigate('/')
    } catch (error: any) {
      setServerError(error.message || 'Failed to register. Please try again.')
    }
  }

  const validateStep1 = async () => {
    const isStep1Valid = await form.trigger([
      'name',
      'email',
      'password',
      'confirmPassword',
    ])
    return isStep1Valid
  }

  return {
    form,
    serverError,
    isSubmitting: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(submitHandler),
    validateStep1,
  }
}
