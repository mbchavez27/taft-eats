import {
  RowDataPacket,
  ResultSetHeader,
  Pool,
  PoolConnection,
} from 'mysql2/promise'
import { pool } from 'shared/config/database.js'

/**
 * Represents a User record retrieved from the database.
 * * @interface User
 * @extends {RowDataPacket}
 */
export interface User extends RowDataPacket {
  /** The unique identifier for the user */
  user_id: number
  /** The user's unique username (optional) */
  username?: string
  /** The user's full name */
  name: string
  /** The user's email address */
  email: string
  /** The hashed version of the user's password */
  password_hash: string
  /** A short biography provided by the user (optional) */
  bio?: string
  /** The user's access level and permissions within the system */
  role: 'user' | 'owner' | 'admin'
  /** The URL to the user's profile picture, or null if none exists */
  profile_picture_url: string | null
  /** The timestamp of when the user account was created */
  created_at: string
}

/**
 * Data access object for interacting with the Users table in the database.
 */
export const UserModel = {
  //Find Users
  /**
   * Finds a user by their email address.
   * * @param {string} email - The email address to search for.
   * @returns {Promise<User | null>} A promise that resolves to the User object if found, otherwise null.
   */
  findByEmail: async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM Users WHERE email = ? LIMIT 1',
      [email],
    )

    return rows.length > 0 ? rows[0] : null
  },

  /**
   * Retrieves a user by their unique database ID.
   * * @param {number} id - The unique user ID.
   * @returns {Promise<User | null>} A promise that resolves to the User object if found, otherwise null.
   */
  findByID: async (id: number): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM Users WHERE user_id = ?',
      [id],
    )
    return rows.length > 0 ? rows[0] : null
  },

  /**
   * Finds a user by their username.
   * * @param {string} username - The username to search for.
   * @returns {Promise<User | null>} A promise that resolves to the User object if found, otherwise null.
   */
  findByUsername: async (username: string): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM Users WHERE username = ? LIMIT 1',
      [username],
    )
    return rows.length > 0 ? rows[0] : null
  },

  //Create User
  /**
   * Creates a new user record in the database.
   * * @param {Pick<User, 'email' | 'username' | 'password_hash' | 'name' | 'bio' | 'role' | 'profile_picture_url'>} user - An object containing the data for the new user.
   * @param {Pool | PoolConnection} [connection] - An optional database connection or transaction pool. Defaults to the global pool.
   * @returns {Promise<number>} A promise that resolves to the auto-incremented insert ID of the newly created user.
   */
  createUser: async (
    user: Pick<
      User,
      | 'email'
      | 'username'
      | 'password_hash'
      | 'name'
      | 'bio'
      | 'role' // Note: 'role' is included in the Pick type here but is not explicitly defined in the User interface above.
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
