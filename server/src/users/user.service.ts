import bcrypt from 'bcrypt'
import { UserModel } from './user.model.js'
import {
  CreateUserDTO,
  LoginDTO,
  UserResponseDTO,
  UpdateUserDTO,
} from './dto/user-dto.js'
import { pool } from 'shared/config/database.js'
import { EstablishmentModel } from 'establishments/establishments.model.js'

export const UserService = {
  //Register
  register: async (data: CreateUserDTO): Promise<UserResponseDTO> => {
    //Check if user already exists
    const existingEmail = await UserModel.findByEmail(data.email)
    if (existingEmail) throw new Error('Email already registered')

    if (data.username) {
      const existingUser = await UserModel.findByUsername(data.username)
      if (existingUser) throw new Error('Username already taken')
    }

    //Hash Passwords
    const saltRounds = 10
    const password_hash = await bcrypt.hash(data.password, saltRounds)

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const userId = await UserModel.createUser(
        {
          username: data.username,
          name: data.name,
          email: data.email,
          password_hash: password_hash,
          bio: data.bio,
          role: data.role || 'user',
          profile_picture_url: data.profile_picture_url || null,
        },
        connection,
      )

      if (data.role === 'owner') {
        const restaurantId = await EstablishmentModel.createRestaurant(
          {
            owner_user_id: userId,
            name: data.restaurantName!,
            description: data.restaurantDescription!,
            latitude: data.latitude!,
            longitude: data.longitude!,
            price_range: data.price_range as any,
            banner_picture_url: data.restaurantBanner!,
          },
          connection,
        )

        if (data.tags && data.tags.length > 0) {
          const finalTagIds: number[] = []

          for (const tag of data.tags) {
            if (typeof tag.id === 'number') {
              finalTagIds.push(tag.id)
            } else {
              const existingTag =
                await EstablishmentModel.findRestaurantTagByLabel(
                  tag.label,
                  connection,
                )

              if (existingTag) {
                finalTagIds.push(existingTag.tag_id)
              } else {
                const newTagId = await EstablishmentModel.createRestaurantTags(
                  tag.label,
                  connection,
                )
                finalTagIds.push(newTagId)
              }
            }
          }

          // Finally, link all the collected tag IDs to the restaurant
          await EstablishmentModel.addRestaurantTags(
            restaurantId,
            finalTagIds,
            connection,
          )
        }
      }

      await connection.commit()

      return {
        user_id: userId,
        username: data.username || '',
        name: data.name,
        email: data.email,
        bio: data.bio || null,
        role: data.role || 'user',
        profile_picture_url: data.profile_picture_url || null,
        created_at: new Date(),
      }
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
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
