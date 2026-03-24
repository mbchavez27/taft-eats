/**
 * @fileoverview Service layer for review-related business logic.
 * @module services/ReviewService
 */

import { pool } from '#shared/config/database.js'
import { ReviewModel } from './reviews.model.js'
import { CreateReviewDTO } from './dto/reviews-dto.js'
import { EstablishmentModel } from '../establishments/establishments.model.js'

/**
 * Service object containing methods for review management.
 * @namespace ReviewService
 */
export const ReviewService = {
  /**
   * Creates a new Review
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

  /**
   * Edits the body of an existing review.
   */
  editReviewBody: async (
    reviewId: number,
    userId: number,
    body: string,
  ): Promise<boolean> => {
    return await ReviewModel.updateReviewBody(reviewId, userId, body)
  },

  /**
   * Deletes a review and safely updates the restaurant's stats.
   */
  deleteReview: async (reviewId: number, userId: number): Promise<boolean> => {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 1. Get the review to find the restaurant_id
      const review = await ReviewModel.getReviewById(reviewId, connection)
      if (!review || review.user_id !== userId) {
        throw new Error('Review not found or unauthorized to delete.')
      }

      const restaurantId = review.restaurant_id

      // 2. Delete the review
      const deleted = await ReviewModel.deleteReview(
        reviewId,
        userId,
        connection,
      )
      if (!deleted) {
        throw new Error('Failed to delete review.')
      }

      // 3. Update the restaurant's average rating
      await ReviewModel.updateRestaurantStats(
        restaurantId,
        undefined,
        connection,
      )

      await connection.commit()
      return true
    } catch (error) {
      await connection.rollback()
      console.error('[Delete Review Transaction Failed]:', error)
      throw error
    } finally {
      connection.release()
    }
  },

  /**
   * Submits an owner's reply to a review.
   */
  createReply: async (
    reviewId: number,
    ownerId: number,
    body: string,
  ): Promise<number> => {
    // 1. Verify ownership
    const isOwner = await ReviewModel.checkRestaurantOwnership(
      reviewId,
      ownerId,
    )

    if (!isOwner) {
      throw new Error(
        'Unauthorized: You do not own the restaurant for this review.',
      )
    }

    // 2. Insert reply
    return await ReviewModel.createReply(reviewId, ownerId, body)
  },
}
