/**
 * @fileoverview Data access layer for handling reviews.
 * @module models/ReviewModel
 */

import {
  ResultSetHeader,
  Pool,
  PoolConnection,
  RowDataPacket,
} from "mysql2/promise";
import { pool } from "shared/config/database.js";

/**
 * Represents a Review database record joined with basic User info.
 * @interface ReviewRecord
 * @extends {RowDataPacket}
 */
export interface ReviewRecord extends RowDataPacket {
  review_id: number;
  restaurant_id: number;
  user_id: number;
  rating: number;
  body: string;
  is_edited: boolean;
  created_at: string;
  username: string;
  profile_picture_url: string | null;
  like_count: number;
  dislike_count: number;
  user_vote: "like" | "dislike" | "none";
}

/**
 * Model object containing methods to interact with the Reviews database table.
 * @namespace ReviewModel
 */
export const ReviewModel = {
  /**
   * Inserts a new review into the database.
   * @async
   * @memberof ReviewModel
   * @param {Object} reviewData - The review details to insert.
   * @param {Pool | PoolConnection} [connection] - Optional database connection for transactions.
   * @returns {Promise<number>} The ID of the newly created review.
   */
  createReview: async (
    reviewData: {
      restaurant_id: number;
      user_id: number;
      rating: number;
      body: string;
    },
    connection?: Pool | PoolConnection,
  ): Promise<number> => {
    const db = (connection || pool) as Pool;

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Reviews (restaurant_id, user_id, rating, body) VALUES (?, ?, ?, ?)`,
      [
        reviewData.restaurant_id,
        reviewData.user_id,
        reviewData.rating,
        reviewData.body,
      ],
    );

    return result.insertId;
  },

  /**
   * Fetches paginated reviews, including like/dislike counts and the current user's vote.
   */
  getReviewsByRestaurantId: async (
    restaurantId: number,
    limit: number = 10,
    lastId?: number,
    currentUserId?: number, // Passed in to check if the requester has already voted
  ): Promise<ReviewRecord[]> => {
    let query = `
      SELECT 
        r.*, 
        u.username, 
        u.profile_picture_url,
        (SELECT COUNT(*) FROM Review_Votes WHERE review_id = r.review_id AND vote_type = 'like') AS like_count,
        (SELECT COUNT(*) FROM Review_Votes WHERE review_id = r.review_id AND vote_type = 'dislike') AS dislike_count,
        IFNULL((SELECT vote_type FROM Review_Votes WHERE review_id = r.review_id AND user_id = ?), 'none') AS user_vote
      FROM Reviews r
      JOIN Users u ON r.user_id = u.user_id
      WHERE r.restaurant_id = ?
    `;
    // We pass currentUserId (or null if not logged in), then restaurantId
    const params: (number | string | null)[] = [
      currentUserId || null,
      restaurantId,
    ];

    if (lastId) {
      query += ` AND r.review_id < ?`;
      params.push(lastId);
    }

    query += ` ORDER BY r.review_id DESC LIMIT ?`;
    params.push(limit);

    const [rows] = await pool.query<ReviewRecord[]>(query, params);
    return rows;
  },

  /**
   * Upserts or deletes a user's vote on a review.
   */
  voteReview: async (
    reviewId: number,
    userId: number,
    voteType: "like" | "dislike" | "none",
  ): Promise<void> => {
    if (voteType === "none") {
      // Remove the vote
      await pool.query(
        `DELETE FROM Review_Votes WHERE review_id = ? AND user_id = ?`,
        [reviewId, userId],
      );
    } else {
      // Insert or update the vote
      await pool.query(
        `INSERT INTO Review_Votes (review_id, user_id, vote_type) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE vote_type = ?`,
        [reviewId, userId, voteType, voteType],
      );
    }
  },

  /**
   * Updates a restaurant's average rating and optionally its price range based on reviews.
   * @async
   * @memberof ReviewModel
   * @param {number} restaurant_id - The ID of the restaurant.
   * @param {string} [price_range] - The updated price range.
   * @param {Pool | PoolConnection} [connection] - Optional database connection for transactions.
   * @returns {Promise<void>}
   */
  updateRestaurantStats: async (
    restaurant_id: number,
    price_range?: string,
    connection?: Pool | PoolConnection,
  ): Promise<void> => {
    const db = (connection || pool) as Pool;

    let query = `
      UPDATE Restaurants r
      SET r.rating = (
        SELECT IFNULL(AVG(rating), 0)
        FROM Reviews
        WHERE restaurant_id = ?
      )
    `;
    const params: (number | string)[] = [restaurant_id];

    if (price_range) {
      query += `, r.price_range = ?`;
      params.push(price_range);
    }

    query += ` WHERE r.restaurant_id = ?`;
    params.push(restaurant_id);

    await db.query(query, params);
  },
};
