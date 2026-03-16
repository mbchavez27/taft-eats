import { useState, useRef, useCallback } from 'react'
import { useAuthStore } from '~/features/auth/context/auth.store'
import { UserService } from '../services/user.services'
import type { UpdateUserDTO } from '../types/user.types'

export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle')

  const setSession = useAuthStore((state) => state.setSession)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const checkUsername = useCallback(
    async (newUsername: string, currentUsername?: string) => {
      if (!newUsername || newUsername === currentUsername) {
        setUsernameStatus('idle')
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        return
      }

      setUsernameStatus('checking')

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(async () => {
        try {
          // Use the UserService instead of raw fetch
          const data = await UserService.checkUsername(newUsername)

          if (data.available) {
            setUsernameStatus('available')
          } else {
            setUsernameStatus('taken')
          }
        } catch (err) {
          console.error('Failed to verify username:', err)
          setUsernameStatus('idle')
        }
      }, 500)
    },
    [],
  )

  const updateProfile = async (data: UpdateUserDTO) => {
    setIsLoading(true)
    setError(null)

    try {
      // Use the UserService instead of raw fetch
      const result = await UserService.updateUserProfile(data)

      setSession(result.user)
      setUsernameStatus('idle')
      return { success: true, user: result.user }
    } catch (err: any) {
      // This will now catch the "Server returned an invalid response" error
      // instead of crashing on JSON.parse
      setError(err.message || 'An unexpected error occurred')
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  return { updateProfile, isLoading, error, checkUsername, usernameStatus }
}
