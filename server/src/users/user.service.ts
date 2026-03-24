/**
 * @fileoverview Service layer for user-related business logic, including registration and authentication.
 * @module services/UserService
 */

import bcrypt from 'bcrypt'
import { UserModel } from './user.model.js'
import {
  CreateUserDTO,
  LoginDTO,
  UserResponseDTO,
  UpdateUserDTO,
} from './dto/user-dto.js'
import { pool } from '#shared/config/database.js'
import { EstablishmentModel } from 'establishments/establishments.model.js'

/**
 * Service object containing methods for user management.
 * @namespace UserService
 */
export const UserService = {
  /**
   * Registers a new user. Handles password hashing and executes a database transaction
   * to ensure data integrity. If the user is an 'owner', it also provisions an associated
   * restaurant and handles tag resolution/creation.
   * * @async
   * @memberof UserService
   * @param {CreateUserDTO} data - The data transfer object containing user registration details and optional establishment data.
   * @returns {Promise<UserResponseDTO>} A promise that resolves to the newly created user's profile.
   * @throws {Error} Throws if the email or username is already registered, or if a database transaction fails.
   */
  register: async (data: CreateUserDTO): Promise<UserResponseDTO> => {
    // Check if user already exists
    const existingEmail = await UserModel.findByEmail(data.email)
    if (existingEmail) throw new Error('Email already registered')

    if (data.username) {
      const existingUser = await UserModel.findByUsername(data.username)
      if (existingUser) throw new Error('Username already taken')
    }

    // Hash Passwords
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
            location: data.location!,
          },
          connection,
        )

        if (data.tags && data.tags.length > 0) {
          // Now strictly collecting bigints
          const finalTagIds: bigint[] = []

          for (const tag of data.tags) {
            const tagId = BigInt(tag.id)

            if (tagId > 0n) {
              finalTagIds.push(tagId)
            } else {
              const existingTag =
                await EstablishmentModel.findRestaurantTagByLabel(
                  tag.label,
                  connection,
                )

              if (existingTag) {
                finalTagIds.push(BigInt(existingTag.tag_id))
              } else {
                // Completely new tag, insert it and get the newly generated ID
                const newTagId = await EstablishmentModel.createRestaurantTags(
                  tag.label,
                  connection,
                )
                finalTagIds.push(BigInt(newTagId))
              }
            }
          }

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

  /**
   * Authenticates a user by validating their email address and checking the
   * bcrypt hash of their password.
   * * @async
   * @memberof UserService
   * @param {LoginDTO} data - The data transfer object containing login credentials.
   * @returns {Promise<UserResponseDTO | null>} A promise resolving to the user's data if credentials are valid, or null if invalid.
   */
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

  /**
   * Updates the user profile and ensures username uniqueness.
   */
  updateProfile: async (
    userId: number,
    data: UpdateUserDTO,
  ): Promise<UserResponseDTO> => {
    // 1. Check if the new username is already taken by another user
    if (data.username) {
      const existingUser = await UserModel.findByUsername(data.username)
      if (existingUser && existingUser.user_id !== userId) {
        throw new Error('Username already taken')
      }
    }

    // 2. Perform the update
    await UserModel.updateUser(userId, data)

    // 3. Fetch and return the updated user
    const updatedUser = await UserModel.findByID(userId)
    if (!updatedUser) throw new Error('User not found after update')

    return {
      user_id: updatedUser.user_id,
      username: updatedUser.username,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio || null,
      role: updatedUser.role,
      profile_picture_url: updatedUser.profile_picture_url || null,
      created_at: new Date(updatedUser.created_at),
    }
  },
}
