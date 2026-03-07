import {
  RowDataPacket,
  ResultSetHeader,
  Pool,
  PoolConnection,
} from 'mysql2/promise'
import { pool } from 'shared/config/database.js'

export interface User extends RowDataPacket {
  user_id: number
  username?: string
  name: string
  email: string
  password_hash: string
  bio?: string
  profile_picture_url: string | null
  created_at: string
}

export const UserModel = {
  //Find Users
  findByEmail: async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM Users WHERE email = ? LIMIT 1',
      [email],
    )

    return rows.length > 0 ? rows[0] : null
  },

  findByID: async (id: number): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM Users WHERE user_id = ?',
      [id],
    )
    return rows.length > 0 ? rows[0] : null
  },

  findByUsername: async (username: string): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM Users WHERE username = ? LIMIT 1',
      [username],
    )
    return rows.length > 0 ? rows[0] : null
  },

  //Create User
  createUser: async (
    user: Pick<
      User,
      | 'email'
      | 'username'
      | 'password_hash'
      | 'name'
      | 'bio'
      | 'role'
      | 'profile_picture_url'
    >,
    connection?: Pool | PoolConnection,
  ): Promise<number> => {
    const db = (connection || pool) as Pool

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Users 
        (email, username, password_hash, name, bio, role, profile_picture_url) 
       VALUES (?, ?, ?, ?, ?, ?,?)`,
      [
        user.email,
        user.username || null,
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
