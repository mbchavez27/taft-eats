/**
 * @fileoverview Data access layer for handling establishment (restaurant) and tag records in the database.
 * @module models/EstablishmentModel
 */

import {
  RowDataPacket,
  ResultSetHeader,
  Pool,
  PoolConnection,
} from 'mysql2/promise'
import { pool } from 'shared/config/database.js'

/**
 * Represents a Restaurant database record.
 * @interface Restaurant
 * @extends {RowDataPacket}
 */
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
export const EstablishmentModel = {
  /**
   * Fetches a paginated list of restaurants using a Cursor (last seen ID).
   * @async
   * @param {number} limit - The number of restaurants to return.
   * @param {number} [lastId] - The ID of the last restaurant fetched in the previous request.
   * @returns {Promise<Restaurant[]>}
   */
  getAllRestaurants: async (
    limit: number = 10,
    lastId?: number,
  ): Promise<Restaurant[]> => {
    let query = `SELECT * FROM Restaurants`
    const params: (number | string)[] = []

    // If a lastId is provided, only get restaurants older than that ID
    if (lastId) {
      query += ` WHERE restaurant_id < ?`
      params.push(lastId)
    }

    query += ` ORDER BY restaurant_id DESC LIMIT ?`
    params.push(limit)

    const [rows] = await pool.query<Restaurant[]>(query, params)

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

    return rows.length > 0 ? rows[0] : null
  },

  /**
   * Retrieves the single restaurant record associated with a specific owner's user ID.
   * Assumes a strict one-to-one relationship between owners and establishments.
   * @async
   * @memberof EstablishmentModel
   * @param {number} ownerId - The unique user ID of the restaurant owner.
   * @returns {Promise<Restaurant | null>} A promise resolving to the owner's restaurant object, or null if they don't have one.
   */
  getRestaurantByOwnerId: async (
    ownerId: number,
  ): Promise<Restaurant | null> => {
    const [rows] = await pool.query<Restaurant[]>(
      'SELECT * FROM Restaurants WHERE owner_user_id = ? LIMIT 1',
      [ownerId],
    )

    return rows.length > 0 ? rows[0] : null
  },

  /**
   * Retrieves all tags associated with a specific restaurant.
   * @async
   * @memberof EstablishmentModel
   * @param {number} restaurantId - The unique ID of the restaurant.
   * @returns {Promise<Tag[]>} A promise resolving to an array of Tag objects.
   */
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

  /**
   * Inserts a new restaurant record into the database.
   * @async
   * @memberof EstablishmentModel
   * @param {Pick<Restaurant, 'owner_user_id' | 'name' | 'description' | 'latitude' | 'longitude' | 'price_range' | 'banner_picture_url'>} restaurant - The restaurant data to insert.
   * @param {Pool | PoolConnection} [connection] - Optional database connection/pool to use (useful for transactions).
   * @returns {Promise<number>} A promise that resolves to the newly created restaurant's auto-incremented ID.
   */
  //Create Establishment
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

  /**
   * Links an array of tag IDs to a specific restaurant in the junction table.
   * @async
   * @memberof EstablishmentModel
   * @param {number} restaurantId - The ID of the restaurant.
   * @param {bigint[]} tagIds - An array of tag IDs (as BigInts) to link to the restaurant.
   * @param {Pool | PoolConnection} [connection] - Optional database connection/pool to use (useful for transactions).
   * @returns {Promise<void>} A promise that resolves when the insertion is complete.
   */
  // Links tags to the restaurant in the junction table
  addRestaurantTags: async (
    restaurantId: number,
    tagIds: bigint[],
    connection?: Pool | PoolConnection,
  ): Promise<void> => {
    if (!tagIds || tagIds.length === 0) return

    const db = (connection || pool) as Pool

    const values = tagIds.map((id) => [restaurantId, id.toString()])

    await db.query(
      'INSERT INTO Restaurant_Tags (restaurant_id, tag_id) VALUES ?',
      [values],
    )
  },

  /**
   * Searches for an existing tag by its string label (case-insensitive).
   * @async
   * @memberof EstablishmentModel
   * @param {string} label - The text label of the tag to find.
   * @param {Pool | PoolConnection} [connection] - Optional database connection/pool to use.
   * @returns {Promise<{ tag_id: number } | null>} A promise resolving to an object containing the tag_id, or null if not found.
   */
  //Find Restaurant Tags
  findRestaurantTagByLabel: async (
    label: string,
    connection?: Pool | PoolConnection,
  ): Promise<{ tag_id: number } | null> => {
    const db = (connection || pool) as Pool

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT tag_id FROM Tags WHERE LOWER(label) = LOWER(?) LIMIT 1',
      [label],
    )
    return rows.length > 0 ? (rows[0] as { tag_id: number }) : null
  },

  /**
   * Creates a new tag record in the database.
   * @async
   * @memberof EstablishmentModel
   * @param {string} label - The text label for the new tag.
   * @param {Pool | PoolConnection} [connection] - Optional database connection/pool to use (useful for transactions).
   * @returns {Promise<number>} A promise that resolves to the newly created tag's auto-incremented ID.
   */
  // Create Restaurant Tag
  createRestaurantTags: async (
    label: string,
    connection?: Pool | PoolConnection,
  ): Promise<number> => {
    const db = (connection || pool) as Pool

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO Tags (label) VALUES (?)',
      [label],
    )
    return result.insertId
  },
}
