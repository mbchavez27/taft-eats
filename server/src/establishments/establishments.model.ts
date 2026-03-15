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
}

export interface GetRestaurantsFilterParams {
  tags?: string[]
  priceRanges?: string[]
  limit?: number
  lastId?: number
}

export interface Tag extends RowDataPacket {
  tag_id: number
  name: string
  category: 'tag' | 'cuisine' | 'food'
}

<<<<<<< HEAD
/**
 * Interface for filtering restaurants by various tags and price ranges.
 */
export interface GetRestaurantsFilterParams {
  tags?: string[];          // Array of tag names (covers cuisines, foods, and tags)
  priceRanges?: string[];   // Array of price ranges (e.g., ['$', '$$'])
  limit?: number;           // Pagination limit
  lastId?: number;          // Cursor for pagination
}

/**
 * Represents a Tag database record.
 * @interface Tag
 * @extends {RowDataPacket}
 */
export interface Tag extends RowDataPacket {
  tag_id: number
  name: string
  category: 'tag' | 'cuisine' | 'food'
}

/**
 * Model object containing methods to interact with the Restaurants and Tags database tables.
 * @namespace EstablishmentModel
 */
=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
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

<<<<<<< HEAD
  /**
   * Fetches a paginated list of restaurants filtered by tags, cuisines, foods, and price range.
   * @async
   * @memberof EstablishmentModel
   * @param {GetRestaurantsFilterParams} params - The filter criteria.
   * @returns {Promise<Restaurant[]>}
   */
  getAllRestaurantsByTags: async (
    params: GetRestaurantsFilterParams
  ): Promise<Restaurant[]> => {
    const { tags = [], priceRanges = [], limit = 10, lastId } = params

    let query = `SELECT r.* FROM Restaurants r WHERE 1=1`
    const queryParams: (number | string)[] = []

    // 1. Cursor-based pagination filter
=======
  getAllRestaurantsByTags: async (
    params: GetRestaurantsFilterParams,
    currentUserId?: number,
  ): Promise<Restaurant[]> => {
    const { tags = [], priceRanges = [], limit = 10, lastId } = params

    let query = `
      SELECT r.*,
      IF(ub.user_id IS NOT NULL, 1, 0) AS is_bookmarked
      FROM Restaurants r
      LEFT JOIN User_Bookmarks ub ON r.restaurant_id = ub.restaurant_id AND ub.user_id = ?
      WHERE 1=1
    `
    const queryParams: any[] = [currentUserId || 0]

>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
    if (lastId) {
      query += ` AND r.restaurant_id < ?`
      queryParams.push(lastId)
    }

<<<<<<< HEAD
    // 2. Filter by Price Range (direct column on Restaurants table)
=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
    if (priceRanges.length > 0) {
      const placeholders = priceRanges.map(() => '?').join(', ')
      query += ` AND r.price_range IN (${placeholders})`
      queryParams.push(...priceRanges)
    }

<<<<<<< HEAD
    // 3. Filter by Tags (Cuisines, Foods, Tags in the Tags table)
    // Using EXISTS prevents duplicate restaurant rows if a restaurant matches multiple tags
=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
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

<<<<<<< HEAD
    // Order by ID descending and apply pagination limit
=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
    query += ` ORDER BY r.restaurant_id DESC LIMIT ?`
    queryParams.push(limit)

    const [rows] = await pool.query<Restaurant[]>(query, queryParams)
<<<<<<< HEAD

    return rows
  },

  /**
   * Retrieves a single restaurant record by its unique establishment ID.
   * @async
   * @memberof EstablishmentModel
   * @param {number} id - The primary key (restaurant_id) of the establishment to retrieve.
   * @returns {Promise<Restaurant | null>} A promise resolving to the restaurant object if found, or null if it doesn't exist.
   */
  getRestaurantById: async (id: number): Promise<Restaurant | null> => {
    const [rows] = await pool.query<Restaurant[]>(
      'SELECT * FROM Restaurants WHERE restaurant_id = ? LIMIT 1',
      [id],
    )
=======
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
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e

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

<<<<<<< HEAD
  /**
   * Retrieves all tags associated with a specific restaurant.
   * @async
   * @memberof EstablishmentModel
   * @param {number} restaurantId - The unique ID of the restaurant.
   * @returns {Promise<Tag[]>} A promise resolving to an array of Tag objects.
   */
=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
  getTagsByRestaurantId: async (restaurantId: number): Promise<Tag[]> => {
    const query = `
      SELECT t.tag_id, t.name, t.category 
      FROM Tags t
      JOIN Restaurant_Tags rt ON t.tag_id = rt.tag_id
      WHERE rt.restaurant_id = ?
    `
<<<<<<< HEAD

=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
    const [rows] = await pool.query<Tag[]>(query, [restaurantId])
    return rows
  },

<<<<<<< HEAD
  /**
   * Inserts a new restaurant record into the database.
   * @async
   * @memberof EstablishmentModel
   * @param {Pick<Restaurant, 'owner_user_id' | 'name' | 'description' | 'latitude' | 'longitude' | 'price_range' | 'banner_picture_url'>} restaurant - The restaurant data to insert.
   * @param {Pool | PoolConnection} [connection] - Optional database connection/pool to use (useful for transactions).
   * @returns {Promise<number>} A promise that resolves to the newly created restaurant's auto-incremented ID.
   */
  //Create Establishment
=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
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
    >,
    connection?: Pool | PoolConnection,
  ): Promise<number> => {
    const db = (connection || pool) as Pool
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Restaurants 
        (owner_user_id, name, description, latitude, longitude, price_range, banner_picture_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurant.owner_user_id,
        restaurant.name,
        restaurant.description || null,
        restaurant.latitude || null,
        restaurant.longitude || null,
        restaurant.price_range || '$',
        restaurant.banner_picture_url || null,
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
<<<<<<< HEAD

    // FIX: Add 'IGNORE' so it doesn't crash on duplicate tags
=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
    await db.query(
      'INSERT IGNORE INTO Restaurant_Tags (restaurant_id, tag_id) VALUES ?',
      [values],
    )
  },

  findRestaurantTagByLabel: async (
    label: string,
    connection?: Pool | PoolConnection,
  ): Promise<{ tag_id: number } | null> => {
    const db = (connection || pool) as Pool
<<<<<<< HEAD

    // FIX: Changed 'label' to 'name'
=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
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
<<<<<<< HEAD

    // FIX: Changed 'label' to 'name'
=======
>>>>>>> f4be32f40609428a4857cab3aad880a714af629e
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
}
