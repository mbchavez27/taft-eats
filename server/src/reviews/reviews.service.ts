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
          let tagId = 0n

          try {
            tagId = BigInt(tag.id)
          } catch (e) {
            tagId = 0n
          }

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

      const safePriceRange = data.price_range || '$'

      await ReviewModel.updateRestaurantStats(
        data.restaurant_id,
        safePriceRange, // Pass the safe string
        connection,
      )

      await connection.commit()
      return reviewId
    } catch (error) {
      await connection.rollback()
      console.error('[Database Transaction Failed]:', error)
      throw error
    } finally {
      connection.release()
    }
  },
}
