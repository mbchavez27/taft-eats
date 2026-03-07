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
}

export const EstablishmentModel = {
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

  // Links tags to the restaurant in the junction table
  addRestaurantTags: async (
    restaurantId: number,
    tagIds: number[],
    connection?: Pool | PoolConnection,
  ): Promise<void> => {
    if (!tagIds || tagIds.length === 0) return

    const db = (connection || pool) as Pool
    const values = tagIds.map((id) => [restaurantId, id])

    await db.query(
      'INSERT INTO Restaurant_Tags (restaurant_id, tag_id) VALUES ?',
      [values],
    )
  },
}
