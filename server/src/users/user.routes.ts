/**
 * @fileoverview Express router for user authentication and management.
 * @module routes/userRoutes
 */

import { Router } from 'express'
import { UserController } from './user.controller.js'
import { requireAuth } from 'shared/middleware/auth.middleware.js'

const router = Router()

/**
 * Route serving user registration.
 * @name post/register
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/register', UserController.register)

/**
 * Route serving user login.
 * @name post/login
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/login', UserController.login)

/**
 * Route serving user logout.
 * @name post/logout
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/logout', UserController.logout)

/**
 * Route to verify current user authentication status.
 * Requires a valid authentication token.
 * @name get/verify
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Authentication middleware (requireAuth).
 * @param {callback} middleware - Express middleware.
 */
router.get('/verify', requireAuth, UserController.verify)

/**
 * Route to get the number of reviews created by a specific user.
 * Requires a valid authentication token.
 * @name get/:id/reviews
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {string} path - Express path including user ID.
 * @param {callback} middleware - Authentication middleware (requireAuth).
 * @param {callback} middleware - Controller method returning CreatedReviewsDTO.
 */
router.get('/:id/reviews', requireAuth, UserController.getNumberOfReviews)

/**
 * Route to get the number of saved/bookmarked establishments for a specific user.
 * Requires a valid authentication token.
 * @name get/:id/saved-establishments
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {string} path - Express path including user ID.
 * @param {callback} middleware - Authentication middleware (requireAuth).
 * @param {callback} middleware - Controller method returning SavedEstablishmentsDTO.
 */
router.get(
  '/:id/saved-establishments',
  requireAuth,
  UserController.getNumberOfSavedEstablishments,
)

export default router
