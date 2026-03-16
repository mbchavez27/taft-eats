/**
 * @fileoverview Controller for handling review-related HTTP requests.
 * @module controllers/ReviewController
 */

import { Request, Response } from 'express'
import { ReviewService } from './reviews.service.js'
import { CreateReviewDTO } from './dto/reviews-dto.js'
import { ReviewModel } from './reviews.model.js'

/**
 * Controller object for managing reviews.
 * @namespace ReviewController
 */
export const ReviewController = {
  /**
   * Handles POST requests to create a new review.
   * @async
   * @memberof ReviewController
   * @param {Request} req - The Express request object containing the review payload.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  createReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized. Please log in.' })
        return
      }

      const reviewData: CreateReviewDTO = req.body

      const reviewId = await ReviewService.createReviewWithTags(
        userId,
        reviewData,
      )

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        reviewId,
      })
    } catch (error) {
      console.error('Error in createReview:', error)
      res
        .status(500)
        .json({ error: 'Internal server error while creating review.' })
    }
  },

  /**
   * Handles GET requests to fetch a paginated list of reviews for a restaurant.
   * Expects 'restaurantId' in the route params, and optional 'limit' and 'lastId' in query.
   * @async   * @memberof ReviewController
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  getReviewsByRestaurantId: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const restaurantId = parseInt(req.params.restaurantId as string, 10)
      const currentUserId = (req as any).user?.userId

      if (isNaN(restaurantId)) {
        res.status(400).json({ error: 'Invalid restaurant ID formatting.' })
        return
      }

      let limitRaw = req.query.limit
      let lastIdRaw = req.query.lastId
      if (Array.isArray(limitRaw)) limitRaw = limitRaw[0]
      if (Array.isArray(lastIdRaw)) lastIdRaw = lastIdRaw[0]

      const limit = typeof limitRaw === 'string' ? parseInt(limitRaw, 10) : 10
      const lastId =
        typeof lastIdRaw === 'string' ? parseInt(lastIdRaw, 10) : undefined

      const sort = req.query.sort as string | undefined
      const rating = req.query.rating
        ? parseInt(req.query.rating as string, 10)
        : undefined

      const reviews = await ReviewModel.getReviewsByRestaurantId(
        restaurantId,
        limit,
        lastId,
        currentUserId,
        sort,
        rating,
      )

      res.status(200).json({
        success: true,
        data: reviews,
        count: reviews.length,
      })
    } catch (error) {
      console.error('Error in getReviewsByRestaurantId:', error)
      res
        .status(500)
        .json({ error: 'Internal server error while fetching reviews.' })
    }
  },

  /**
   * Handles GET requests to fetch a paginated list of reviews created by a specific user.
   * Expects 'userId' in the route params, and optional 'limit' and 'lastId' in query.
   * @async
   * @memberof ReviewController
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  getReviewsByUserId: async (req: Request, res: Response): Promise<void> => {
    try {
      const targetUserId = parseInt(req.params.userId as string, 10)

      if (isNaN(targetUserId)) {
        res.status(400).json({ error: 'Invalid user ID formatting.' })
        return
      }

      let limitRaw = req.query.limit
      let lastIdRaw = req.query.lastId
      if (Array.isArray(limitRaw)) limitRaw = limitRaw[0]
      if (Array.isArray(lastIdRaw)) lastIdRaw = lastIdRaw[0]

      const limit = typeof limitRaw === 'string' ? parseInt(limitRaw, 10) : 10
      const lastId =
        typeof lastIdRaw === 'string' ? parseInt(lastIdRaw, 10) : undefined

      const reviews = await ReviewModel.getReviewsByUserId(
        targetUserId,
        limit,
        lastId,
      )

      res.status(200).json({
        success: true,
        data: reviews,
        count: reviews.length,
      })
    } catch (error) {
      console.error('Error in getReviewsByUserId:', error)
      res
        .status(500)
        .json({ error: 'Internal server error while fetching user reviews.' })
    }
  },

  /**
   * Handles POST requests to add/change/remove a vote.
   */
  voteReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized. Please log in to vote.' })
        return
      }

      const reviewId = parseInt(req.params.reviewId as string, 10)
      const { voteType } = req.body

      if (isNaN(reviewId) || !['like', 'dislike', 'none'].includes(voteType)) {
        res.status(400).json({ error: 'Invalid request parameters.' })
        return
      }

      await ReviewModel.voteReview(reviewId, userId, voteType)

      res
        .status(200)
        .json({ success: true, message: 'Vote recorded successfully' })
    } catch (error) {
      console.error('Error in voteReview:', error)
      res.status(500).json({ error: 'Internal server error while voting.' })
    }
  },

  /**
   * Handles PATCH requests to edit a review's body.
   */
  editReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId
      const reviewId = parseInt(req.params.reviewId as string, 10)
      const { body } = req.body

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized. Please log in.' })
        return
      }

      if (isNaN(reviewId) || !body || body.trim().length < 20) {
        res.status(400).json({ error: 'Invalid review ID or body too short.' })
        return
      }

      const success = await ReviewService.editReviewBody(reviewId, userId, body)

      if (!success) {
        res.status(403).json({ error: 'Not authorized or review not found.' })
        return
      }

      res
        .status(200)
        .json({ success: true, message: 'Review updated successfully.' })
    } catch (error) {
      console.error('Error in editReview:', error)
      res
        .status(500)
        .json({ error: 'Internal server error while editing review.' })
    }
  },

  /**
   * Handles DELETE requests to remove a review.
   */
  deleteReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId
      const reviewId = parseInt(req.params.reviewId as string, 10)

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized. Please log in.' })
        return
      }

      if (isNaN(reviewId)) {
        res.status(400).json({ error: 'Invalid review ID formatting.' })
        return
      }

      await ReviewService.deleteReview(reviewId, userId)

      res
        .status(200)
        .json({ success: true, message: 'Review deleted successfully.' })
    } catch (error: any) {
      console.error('Error in deleteReview:', error)
      res.status(500).json({
        error: error.message || 'Internal server error while deleting.',
      })
    }
  },

  /**
   * Handles POST requests to submit an owner reply to a review.
   */
  replyToReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const ownerId = (req as any).user?.userId
      const reviewId = parseInt(req.params.reviewId as string, 10)
      const { body } = req.body

      if (!ownerId) {
        res.status(401).json({ error: 'Unauthorized. Please log in.' })
        return
      }

      // Update minimum length to 20
      if (isNaN(reviewId) || !body || body.trim().length < 20) {
        res.status(400).json({
          error:
            'Invalid review ID or reply body too short (minimum 20 characters).',
        })
        return
      }

      await ReviewService.createReply(reviewId, ownerId, body)

      res
        .status(201)
        .json({ success: true, message: 'Reply submitted successfully.' })
    } catch (error: any) {
      console.error('Error in replyToReview:', error)

      // Distinguish between Ownership errors and other errors
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({ error: error.message })
        return
      }

      if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message })
        return
      }

      res
        .status(500)
        .json({ error: 'Internal server error while submitting reply.' })
    }
  },

  /**
   * Handles GET requests to fetch all reviews (Admin).
   */
  getAllReviews: async (req: Request, res: Response): Promise<void> => {
    try {
      // Note: You should ideally add an admin role check here
      // e.g., if (req.user.role !== 'admin') return res.status(403)...

      let limitRaw = req.query.limit
      let lastIdRaw = req.query.lastId
      if (Array.isArray(limitRaw)) limitRaw = limitRaw[0]
      if (Array.isArray(lastIdRaw)) lastIdRaw = lastIdRaw[0]

      const limit = typeof limitRaw === 'string' ? parseInt(limitRaw, 10) : 20
      const lastId =
        typeof lastIdRaw === 'string' ? parseInt(lastIdRaw, 10) : undefined

      const reviews = await ReviewModel.getAllReviews(limit, lastId)

      res.status(200).json({
        success: true,
        data: reviews,
        count: reviews.length,
      })
    } catch (error) {
      console.error('Error in getAllReviews:', error)
      res
        .status(500)
        .json({ error: 'Internal server error while fetching all reviews.' })
    }
  },

  /**
   * Handles DELETE requests to remove any review (Admin).
   */
  deleteReviewAsAdmin: async (req: Request, res: Response): Promise<void> => {
    try {
      // Note: Add admin role check here to secure the endpoint!

      const reviewId = parseInt(req.params.reviewId as string, 10)

      if (isNaN(reviewId)) {
        res.status(400).json({ error: 'Invalid review ID formatting.' })
        return
      }

      const success = await ReviewModel.adminDeleteReview(reviewId)

      if (!success) {
        res.status(404).json({ error: 'Review not found.' })
        return
      }

      res
        .status(200)
        .json({
          success: true,
          message: 'Review deleted successfully by Admin.',
        })
    } catch (error: any) {
      console.error('Error in deleteReviewAsAdmin:', error)
      res.status(500).json({
        error: error.message || 'Internal server error while deleting.',
      })
    }
  },
}
