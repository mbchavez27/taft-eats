import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { AuthService } from '../services/auth.services'
import { useAuthStore } from '../context/auth.store'
import type { CreateUserDTO } from '~/features/users/types/user.types'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/

export const signUpSchema = z
  .object({
    // --- Step 1: Shared Fields ---
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .regex(
        passwordRegex,
        'Password must contain an uppercase, lowercase, number, and special character.',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),

    // --- User Step 2: Personal Fields ---
    // Using .or(z.literal('')) prevents validation errors if an Owner leaves this blank
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .optional()
      .or(z.literal('')),
    bio: z.string().optional(),
    avatar: z.any().optional(),
    // --- Owner Step 2 & 3: Establishment Fields ---
    role: z.enum(['user', 'owner']).default('user').optional(),
    restaurantName: z
      .string()
      .min(1, 'Establishment name is required')
      .optional()
      .or(z.literal('')),
    restaurantDescription: z.string().optional(),
    restaurantBanner: z.any().optional(),
    latitude: z
      .union([z.number(), z.nan()]) // Handles the case where the input is cleared
      .optional()
      .refine((val) => val !== undefined && !isNaN(val as number), {
        message: 'Latitude is required for establishments',
      }),
    longitude: z
      .union([z.number(), z.nan()])
      .optional()
      .refine((val) => val !== undefined && !isNaN(val as number), {
        message: 'Longitude is required for establishments',
      }),
    tags: z.array(z.any()).optional(),
    price_range: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>

export const useSignUp = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const setSession = useAuthStore((state) => state.setSession)

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
      role: 'user',
      restaurantName: '',
      restaurantDescription: '',
      restaurantBanner: null,
      latitude: undefined,
      longitude: undefined,
      tags: [],
      price_range: '$',
    },
  })

  const submitHandler = async (data: SignUpFormValues) => {
    setServerError(null)
    try {
      const { confirmPassword, ...payload } = data

      const generatedUsername = payload.username
        ? payload.username
        : payload.restaurantName
            ?.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^\w]/g, '') || payload.email.split('@')[0]

      const finalPayload: CreateUserDTO = {
        ...payload,
        username: generatedUsername,
      }
      const response = await AuthService.register(finalPayload)

      setSession(response.user)

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
