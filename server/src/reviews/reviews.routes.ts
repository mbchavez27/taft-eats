/**
 * @fileoverview Express routes for review endpoints.
 * @module routes/ReviewRoutes
 */

import { Router } from 'express'
import { ReviewController } from './reviews.controller.js'
import { requireAuth } from '@shared/middleware/auth.middleware.js'
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
 * @route   GET /api/reviews
 * @desc    Get a paginated list of ALL reviews (Admin feature)
 * @access  Private (Admin only)
 */
// IMPORTANT: Place this before parameterized routes or use a dedicated /admin prefix
router.get('/', requireAuth, ReviewController.getAllReviews)

/**
 * @route   DELETE /api/reviews/admin/:reviewId
 * @desc    Delete a review as an admin (bypasses user ownership)
 * @access  Private (Admin only)
 */
router.delete(
  '/admin/:reviewId',
  requireAuth,
  ReviewController.deleteReviewAsAdmin,
)

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

/**
 * @route   PATCH /api/reviews/:reviewId
 * @desc    Edit the body of an existing review
 * @access  Private
 */
router.patch('/:reviewId', requireAuth, ReviewController.editReview)

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review
 * @access  Private
 */
router.delete('/:reviewId', requireAuth, ReviewController.deleteReview)

/**
 * @route   POST /api/reviews/:reviewId/reply
 * @desc    Submit an owner reply to a specific review
 * @access  Private (Owner only)
 */
router.post('/:reviewId/reply', requireAuth, ReviewController.replyToReview)

export default router
