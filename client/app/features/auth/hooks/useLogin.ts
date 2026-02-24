import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { AuthService } from '../services/auth.services'
import { useAuthStore } from '../context/auth.store'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false).optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const useLogin = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const setSession = useAuthStore((state) => state.setSession)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const submitHandler = async (data: LoginFormValues) => {
    setServerError(null)
    try {
      const response = await AuthService.login(data)

      setSession(response.user)

      navigate('/')
    } catch (error: any) {
      setServerError(error.message || 'Failed to login. Please try again.')
    }
  }

  return {
    form,
    serverError,
    isSubmitting: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(submitHandler),
  }
}
