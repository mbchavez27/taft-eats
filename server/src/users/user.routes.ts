/**
 * @fileoverview Express router for user authentication and management.
 * @module routes/userRoutes
 */

import { Router } from 'express'
import { UserController } from './user.controller.js'
import { requireAuth } from 'shared/middleware/auth.middleware.js'
import path from 'path'
import multer from 'multer'

const router = Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Make sure you create an 'uploads' folder in your backend root!
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    )
  },
})

const upload = multer({ storage })

/**
 * Route serving user registration.
 * @name post/register
 * @function
 * @memberof module:routes/userRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post(
  '/register',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'restaurantBanner', maxCount: 1 },
  ]),
  UserController.register,
)

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
 * @route   GET /api/users
 * @desc    Get a paginated list of all users
 * @access  Private (Admin only)
 */
router.get('/', requireAuth, UserController.getAllUsers)

/**
 * @route   DELETE /api/users/admin/:id
 * @desc    Delete a user
 * @access  Private (Admin only)
 */
router.delete('/admin/:id', requireAuth, UserController.deleteUserAsAdmin)

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
 * @route   PATCH /api/users/profile
 * @desc    Update the authenticated user's profile information (name, username, bio, etc.)
 * @access  Private
 */
router.patch('/profile', requireAuth, UserController.updateProfile)

/**
 * @route   GET /api/users/check-username
 * @desc    Check if a username is available
 * @access  Public
 */
router.get('/check-username', UserController.checkUsername)

export default router
