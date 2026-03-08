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
 * Model object containing methods to interact with the Restaurants and Tags database tables.
 * @namespace EstablishmentModel
 */
export const EstablishmentModel = {
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
