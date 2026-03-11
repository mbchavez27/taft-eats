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

export default router
