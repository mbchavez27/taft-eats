export interface SignUpFormTypes {
  name: string
  email: string
  password: string
  confirmPassword: string
  username: string
  bio: string
  avatar: File | null
}

export type LoginFormTypes = {
  email: string
  password: string
  rememberMe: boolean
}
