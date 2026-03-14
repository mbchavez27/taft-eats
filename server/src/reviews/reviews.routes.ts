/**
 * @fileoverview Express routes for review endpoints.
 * @module routes/ReviewRoutes
 */

import { Router } from 'express'
import { ReviewController } from './reviews.controller.js'
import { requireAuth } from 'shared/middleware/auth.middleware.js'
// import { authenticateToken } from '../middlewares/auth.js';

const router = Router()

/**
 * @route   POST /api/reviews
 * @desc    Create a new review, optionally adding tags and updating restaurant stats
 * @access  Private
 */
router.post('/', requireAuth, ReviewController.createReview)

/**
 * @route   GET /api/reviews/restaurant/:restaurantId
 * @desc    Get a paginated list of reviews for a specific restaurant
 * @access  Public
 */
router.get(
  '/restaurant/:restaurantId',
  ReviewController.getReviewsByRestaurantId,
)

/**
 * @route   GET /api/reviews/user/:userId
 * @desc    Get a paginated list of reviews created by a specific user
 * @access  Public
 * @param   {number} req.params.userId - The ID of the user whose reviews are being fetched.
 * @param   {number} [req.query.limit] - Optional. Number of reviews to fetch per page.
 * @param   {number} [req.query.lastId] - Optional. The ID of the last fetched review for cursor pagination.
 */
router.get('/user/:userId', ReviewController.getReviewsByUserId)

/**
 * @route   POST /api/reviews/:reviewId/vote
 * @desc    Submit, update, or remove a user's vote (like/dislike) on a specific review.
 * @access  Private
 * @param   {number} req.params.reviewId - The ID of the review being voted on.
 * @param   {Object} req.body - The request body.
 * @param   {'like'|'dislike'|'none'} req.body.voteType - The type of vote being cast ('none' removes the vote).
 * @returns {Object} JSON response indicating success or failure.
 */
router.post('/:reviewId/vote', requireAuth, ReviewController.voteReview)

export default router
