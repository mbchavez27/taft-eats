/**
 * @fileoverview Service layer for review-related business logic.
 * @module services/ReviewService
 */

import { pool } from 'shared/config/database.js'
import { ReviewModel } from './reviews.model.js'
import { CreateReviewDTO } from './dto/reviews-dto.js'
import { EstablishmentModel } from '../establishments/establishments.model.js'

/**
 * Service object containing methods for review management.
 * @namespace ReviewService
 */
export const ReviewService = {
  /**
   * Creates a review, handles new/existing tags, and updates restaurant stats within a transaction.
   * @async
   * @memberof ReviewService
   * @param {number} userId - The ID of the user creating the review.
   * @param {CreateReviewDTO} data - The review data including optional tags and price range.
   * @returns {Promise<number>} The ID of the newly created review.
   * @throws {Error} Throws if the database transaction fails.
   */
  createReviewWithTags: async (
    userId: number,
    data: CreateReviewDTO,
  ): Promise<number> => {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const reviewId = await ReviewModel.createReview(
        {
          restaurant_id: data.restaurant_id,
          user_id: userId,
          rating: data.rating,
          body: data.body,
        },
        connection,
      )

      if (data.tags && data.tags.length > 0) {
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
              const newTagId = await EstablishmentModel.createRestaurantTags(
                tag.label,
                connection,
              )
              finalTagIds.push(BigInt(newTagId))
            }
          }
        }

        await EstablishmentModel.addRestaurantTags(
          data.restaurant_id,
          finalTagIds,
          connection,
        )
      }

      await ReviewModel.updateRestaurantStats(
        data.restaurant_id,
        data.price_range,
        connection,
      )

      await connection.commit()
      return reviewId
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },
}
