/**
 * @fileoverview Updated EstablishmentModel with robust is_bookmarked checks.
 */

import {
  RowDataPacket,
  ResultSetHeader,
  Pool,
  PoolConnection,
} from 'mysql2/promise'
import { pool } from 'shared/config/database.js'

export interface Restaurant extends RowDataPacket {
  restaurant_id: number
  owner_user_id: number | null
  name: string
  description?: string
  price_range: '$' | '$$' | '$$$'
  rating: number
  latitude: number | null
  longitude: number | null
  banner_picture_url: string | null
  created_at: string
  is_bookmarked?: number
  is_temporarily_closed: number
}

export interface GetRestaurantsFilterParams {
  tags?: string[]
  priceRanges?: string[]
  limit?: number
  lastId?: number
  rating?: number
}

export interface Tag extends RowDataPacket {
  tag_id: number
  name: string
  category: 'tag' | 'cuisine' | 'food'
}

export const EstablishmentModel = {
  getAllRestaurants: async (
    limit: number = 10,
    lastId?: number,
    currentUserId?: number,
  ): Promise<Restaurant[]> => {
    // Note the user_id = ? check in the JOIN
    let query = `
      SELECT r.*, 
      IF(ub.user_id IS NOT NULL, 1, 0) AS is_bookmarked
      FROM Restaurants r
      LEFT JOIN User_Bookmarks ub ON r.restaurant_id = ub.restaurant_id AND ub.user_id = ?
    `
    const params: any[] = [currentUserId || 0] // Use 0 instead of null to avoid ambiguity

    if (lastId) {
      query += ` WHERE r.restaurant_id < ?`
      params.push(lastId)
    }

    query += ` ORDER BY r.restaurant_id DESC LIMIT ?`
    params.push(limit)

    const [rows] = await pool.query<Restaurant[]>(query, params)
    return rows
  },

  getAllRestaurantsByTags: async (
    params: GetRestaurantsFilterParams,
    currentUserId?: number,
  ): Promise<Restaurant[]> => {
    const { tags = [], priceRanges = [], limit = 10, lastId, rating } = params

    let query = `
      SELECT r.*,
      IF(ub.user_id IS NOT NULL, 1, 0) AS is_bookmarked
      FROM Restaurants r
      LEFT JOIN User_Bookmarks ub ON r.restaurant_id = ub.restaurant_id AND ub.user_id = ?
      WHERE 1=1
    `
    const queryParams: any[] = [currentUserId || 0]

    if (lastId) {
      query += ` AND r.restaurant_id < ?`
      queryParams.push(lastId)
    }

    if (priceRanges.length > 0) {
      const placeholders = priceRanges.map(() => '?').join(', ')
      query += ` AND r.price_range IN (${placeholders})`
      queryParams.push(...priceRanges)
    }

    if (rating !== undefined && rating > 0) {
      query += ` AND r.rating = ?`
      queryParams.push(rating)
    }

    if (tags.length > 0) {
      const placeholders = tags.map(() => '?').join(', ')
      query += ` AND EXISTS (
        SELECT 1 FROM Restaurant_Tags rt
        JOIN Tags t ON rt.tag_id = t.tag_id
        WHERE rt.restaurant_id = r.restaurant_id
        AND t.name IN (${placeholders})
      )`
      queryParams.push(...tags)
    }

    query += ` ORDER BY r.restaurant_id DESC LIMIT ?`
    queryParams.push(limit)

    const [rows] = await pool.query<Restaurant[]>(query, queryParams)
    return rows
  },

  getRestaurantById: async (
    id: number,
    currentUserId?: number,
  ): Promise<Restaurant | null> => {
    const query = `
      SELECT r.*,
      IF(ub.user_id IS NOT NULL, 1, 0) AS is_bookmarked
      FROM Restaurants r
      LEFT JOIN User_Bookmarks ub ON r.restaurant_id = ub.restaurant_id AND ub.user_id = ?
      WHERE r.restaurant_id = ? 
      LIMIT 1
    `
    // Ensure currentUserId is passed as the first parameter
    const [rows] = await pool.query<Restaurant[]>(query, [
      currentUserId || 0,
      id,
    ])

    return rows.length > 0 ? rows[0] : null
  },

  getRestaurantByOwnerId: async (
    ownerId: number,
  ): Promise<Restaurant | null> => {
    const [rows] = await pool.query<Restaurant[]>(
      'SELECT * FROM Restaurants WHERE owner_user_id = ? LIMIT 1',
      [ownerId],
    )
    return rows.length > 0 ? rows[0] : null
  },

  getTagsByRestaurantId: async (restaurantId: number): Promise<Tag[]> => {
    const query = `
      SELECT t.tag_id, t.name, t.category 
      FROM Tags t
      JOIN Restaurant_Tags rt ON t.tag_id = rt.tag_id
      WHERE rt.restaurant_id = ?
    `
    const [rows] = await pool.query<Tag[]>(query, [restaurantId])
    return rows
  },

  createRestaurant: async (
    restaurant: Pick<
      Restaurant,
      | 'owner_user_id'
      | 'name'
      | 'description'
      | 'latitude'
      | 'longitude'
      | 'price_range'
      | 'banner_picture_url'
      | 'location'
    >,
    connection?: Pool | PoolConnection,
  ): Promise<number> => {
    const db = (connection || pool) as Pool
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Restaurants 
        (owner_user_id, name, description, latitude, longitude, price_range, banner_picture_url, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurant.owner_user_id,
        restaurant.name,
        restaurant.description || null,
        restaurant.latitude || null,
        restaurant.longitude || null,
        restaurant.price_range || '$',
        restaurant.banner_picture_url || null,
        restaurant.location || null,
      ],
    )
    return result.insertId
  },

  addRestaurantTags: async (
    restaurantId: number,
    tagIds: bigint[],
    connection?: Pool | PoolConnection,
  ): Promise<void> => {
    if (!tagIds || tagIds.length === 0) return
    const db = (connection || pool) as Pool
    const values = tagIds.map((id) => [restaurantId, id.toString()])
    await db.query(
      'INSERT IGNORE INTO Restaurant_Tags (restaurant_id, tag_id) VALUES ?',
      [values],
    )
  },

  // src/models/establishments.model.ts

  /**
   * Searches for restaurants by name using a partial match.
   * Includes logic to check if the current user has bookmarked the results.
   *
   * @param {string} searchQuery - The text to search for in restaurant names.
   * @param {number} [limit=5] - The maximum number of results to return.
   * @param {number} [currentUserId] - Optional user ID to check bookmark status.
   * @returns {Promise<Restaurant[]>} A promise that resolves to an array of matching restaurants.
   */
  searchRestaurantsByName: async (
    searchQuery: string,
    limit: number = 5,
    currentUserId?: number,
  ): Promise<Restaurant[]> => {
    const query = `
      SELECT r.*,
      IF(ub.user_id IS NOT NULL, 1, 0) AS is_bookmarked
      FROM Restaurants r
      LEFT JOIN User_Bookmarks ub ON r.restaurant_id = ub.restaurant_id AND ub.user_id = ?
      WHERE r.name LIKE ?
      ORDER BY r.name ASC
      LIMIT ?
    `
    // Use % around the search query for partial matching
    const params: (string | number)[] = [
      currentUserId || 0,
      `%${searchQuery}%`,
      limit,
    ]

    const [rows] = await pool.query<Restaurant[]>(query, params)
    return rows
  },

  findRestaurantTagByLabel: async (
    label: string,
    connection?: Pool | PoolConnection,
  ): Promise<{ tag_id: number } | null> => {
    const db = (connection || pool) as Pool
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT tag_id FROM Tags WHERE LOWER(name) = LOWER(?) LIMIT 1',
      [label],
    )
    return rows.length > 0 ? (rows[0] as { tag_id: number }) : null
  },

  createRestaurantTags: async (
    label: string,
    connection?: Pool | PoolConnection,
  ): Promise<number> => {
    const db = (connection || pool) as Pool
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO Tags (name) VALUES (?)',
      [label],
    )
    return result.insertId
  },

  bookmarkRestaurant: async (
    userId: number,
    restaurantId: number,
  ): Promise<void> => {
    await pool.query(
      'INSERT IGNORE INTO User_Bookmarks (user_id, restaurant_id) VALUES (?, ?)',
      [userId, restaurantId],
    )
  },

  unbookmarkRestaurant: async (
    userId: number,
    restaurantId: number,
  ): Promise<void> => {
    await pool.query(
      'DELETE FROM User_Bookmarks WHERE user_id = ? AND restaurant_id = ?',
      [userId, restaurantId],
    )
  },

  getUserBookmarks: async (
    userId: number,
    limit: number = 10,
    lastId?: number,
  ): Promise<Restaurant[]> => {
    let query = `
      SELECT r.*, 1 AS is_bookmarked 
      FROM Restaurants r
      JOIN User_Bookmarks ub ON r.restaurant_id = ub.restaurant_id
      WHERE ub.user_id = ?
    `
    const params: (number | string)[] = [userId]
    if (lastId) {
      query += ` AND r.restaurant_id < ?`
      params.push(lastId)
    }
    query += ` ORDER BY r.restaurant_id DESC LIMIT ?`
    params.push(limit)

    const [rows] = await pool.query<Restaurant[]>(query, params)
    return rows
  },

  deleteRestaurant: async (
    restaurantId: number,
    ownerId: number,
  ): Promise<boolean> => {
    // We check BOTH restaurant_id and owner_user_id for security
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM Restaurants WHERE restaurant_id = ? AND owner_user_id = ?',
      [restaurantId, ownerId],
    )
    // Returns true if a row was actually deleted
    return result.affectedRows > 0
  },

  toggleTemporarilyClosed: async (
    restaurantId: number,
    ownerId: number,
    isClosed: boolean,
  ): Promise<boolean> => {
    // We check owner_user_id to ensure only the real owner can update the status
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE Restaurants SET is_temporarily_closed = ? WHERE restaurant_id = ? AND owner_user_id = ?',
      [isClosed, restaurantId, ownerId],
    )
    return result.affectedRows > 0
  },

  /**
   * Updates a restaurant's name, description (bio), and banner picture.
   * Ensures only the owner can perform the update.
   */
  updateRestaurant: async (
    restaurantId: number,
    ownerId: number,
    data: { name?: string; description?: string; banner_picture_url?: string },
  ): Promise<boolean> => {
    const updates: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.description !== undefined) {
      updates.push('description = ?')
      values.push(data.description)
    }
    if (data.banner_picture_url !== undefined) {
      updates.push('banner_picture_url = ?')
      values.push(data.banner_picture_url)
    }

    if (updates.length === 0) return false // Nothing to update

    // Add restaurantId and ownerId for the WHERE clause
    values.push(restaurantId, ownerId)

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE Restaurants SET ${updates.join(', ')} 
       WHERE restaurant_id = ? AND owner_user_id = ?`,
      values,
    )

    return result.affectedRows > 0
  },
}
