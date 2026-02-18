import bcrypt from 'bcrypt'
import { UserModel } from './user.model.js'
import {
  CreateUserDTO,
  LoginDTO,
  UserResponseDTO,
  UpdateUserDTO,
} from './dto/user-dto.js'

export const UserService = {
  //Register
  register: async (data: CreateUserDTO): Promise<UserResponseDTO> => {
    //Check if user already exists
    const existingEmail = await UserModel.findByEmail(data.email)
    if (existingEmail) throw new Error('Email already registered')

    const existingUser = await UserModel.findByUsername(data.username)
    if (existingUser) throw new Error('Username already taken')

    //Hash Passwords
    const saltRounds = 10
    const password_hash = await bcrypt.hash(data.password, saltRounds)

    const userId = await UserModel.createUser({
      username: data.username,
      name: data.name,
      email: data.email,
      password_hash: password_hash,
      bio: data.bio,
      role: data.role || 'user',
      profile_picture_url: data.profile_picture_url || null,
    })

    return {
      user_id: userId,
      username: data.username,
      name: data.name,
      email: data.email,
      bio: data.bio || null,
      role: data.role || 'user',
      profile_picture_url: data.profile_picture_url || null,
      created_at: new Date(),
    }
  },

  login: async (data: LoginDTO): Promise<UserResponseDTO | null> => {
    const user = await UserModel.findByEmail(data.email)

    if (!user) return null

    const isValid = await bcrypt.compare(data.password, user.password_hash)
    if (!isValid) return null

    return {
      user_id: user.user_id,
      username: user.username,
      name: user.name,
      email: user.email,
      bio: user.bio || null,
      role: user.role,
      profile_picture_url: user.profile_picture_url || null,
      created_at: new Date(user.created_at),
    }

    //TODO: Add Update Profile Service
  },
}
