import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { pool } from 'shared/config/database.js'

export interface Restaurant extends RowDataPacket {
  restaurant_id: number
  owner_user_id: number | null
  name: string
  description?: string
  price_range: '$' | '$$' | '$$$' | '$$$$'
  rating: number
  latitude: number | null
  longitude: number | null
  banner_picture_url: string | null
  created_at: string
}

export const EstablishmentModel = {
  //Create Establishment
  createRestaurant: async (
    restaurant: Pick<
      Restaurant,
      | 'email'
      | 'username'
      | 'password_hash'
      | 'name'
      | 'bio'
      | 'role'
      | 'profile_picture_url'
    >,
    tags: string[],
  ): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Users 
        (email, username, password_hash, name, bio, role, profile_picture_url) 
       VALUES (?, ?, ?, ?, ?, ?,?)`,
      [
        user.email,
        user.username,
        user.password_hash,
        user.name,
        user.bio || null,
        user.role || 'user',
        user.profile_picture_url || null,
      ],
    )

    return result.insertId
  },

  //TODO: Create a Update User Function for edit function ie edit forgot password and other details like bio and username and name
}
