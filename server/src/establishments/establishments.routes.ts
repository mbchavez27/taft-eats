import { Router } from 'express'
import { EstablishmentController } from './establishments.controller.js'
import { optionalAuth, requireAuth } from 'shared/middleware/auth.middleware.js'
import path from 'path'
import multer from 'multer'

const router = Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
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
 * @route   PATCH /api/establishments/admin/:id
 * @desc    Edit a restaurant as Admin (Bypass ownership)
 */
router.patch(
  '/admin/:id',
  requireAuth,
  EstablishmentController.editRestaurantAsAdmin,
)

/**
 * @route   DELETE /api/establishments/admin/:id
 * @desc    Delete a restaurant as Admin (Bypass ownership)
 */
router.delete(
  '/admin/:id',
  requireAuth,
  EstablishmentController.deleteRestaurantAsAdmin,
)

/**
 * @route   GET /api/establishments
 * @desc    Get a paginated list of all restaurants (accepts ?limit=10&lastId=5)
 * @access  Public (or Private, depending on your auth middleware)
 */
router.get('/', optionalAuth, EstablishmentController.getAllRestaurants)

/**
 * @route   GET /api/establishments/owner/:ownerId
 * @desc    Get a specific restaurant by the owner's user ID
 * @access  Public
 */
router.get(
  '/owner/:ownerId',
  optionalAuth,
  EstablishmentController.getRestaurantByOwnerId,
)

/**
 * @route   GET /api/establishments/search
 * @desc    Search restaurants by name (accepts ?q=keyword&limit=5)
 * @access  Public
 */
router.get('/search', optionalAuth, EstablishmentController.searchRestaurants)

/**
 * @route   GET /api/establishments/tags
 * @desc    Get tags, optionally filtered by category (e.g., ?category=cuisine)
 * @access  Public
 */
router.get('/tags', EstablishmentController.getTagsByCategory)

/**
 * @route   GET /api/establishments/:id
 * @desc    Get a specific restaurant by its ID
 * @access  Public
 * * Note: We place this AFTER the '/owner/:ownerId' route.
 * If it were above it, Express might mistakenly read the word "owner" as an :id!
 */
router.get('/:id', optionalAuth, EstablishmentController.getRestaurantById)

/**
 * @route   GET /api/establishments/:id/tags
 * @desc    Get all tags associated with a specific restaurant
 * @access  Public
 */
router.get('/:id/tags', EstablishmentController.getTagsByRestaurantId)

/**
 * @route   GET /api/establishments/user/bookmarks
 * @desc    Get a paginated list of the logged-in user's bookmarked restaurants
 * @access  Private
 * @param   {number} [req.query.limit] - Optional. Number of restaurants to fetch per page.
 * @param   {number} [req.query.lastId] - Optional. The ID of the last fetched restaurant for cursor pagination.
 */
router.get(
  '/user/bookmarks',
  requireAuth,
  EstablishmentController.getUserBookmarks,
)

/**
 * @route   POST /api/establishments/:id/bookmark
 * @desc    Add a specific restaurant to the logged-in user's bookmarks
 * @access  Private
 * @param   {string} req.params.id - The ID of the restaurant to bookmark.
 */
router.post(
  '/:id/bookmark',
  requireAuth,
  EstablishmentController.bookmarkRestaurant,
)

/**
 * @route   DELETE /api/establishments/:id/bookmark
 * @desc    Remove a specific restaurant from the logged-in user's bookmarks
 * @access  Private
 * @param   {string} req.params.id - The ID of the restaurant to unbookmark.
 */
router.delete(
  '/:id/bookmark',
  requireAuth,
  EstablishmentController.unbookmarkRestaurant,
)

/**
 * @route   PATCH /api/establishments/:id
 * @desc    Edit a restaurant's name, description, or banner (Owner only)
 * @access  Private
 */
router.patch(
  '/:id',
  requireAuth,
  upload.single('restaurantBanner'),
  EstablishmentController.editRestaurant,
)

/**
 * @route   DELETE /api/establishments/:id
 * @desc    Delete a specific restaurant (Owner only)
 * @access  Private
 */
router.delete('/:id', requireAuth, EstablishmentController.deleteRestaurant)

/**
 * @route   PATCH /api/establishments/:id/status
 * @desc    Toggle the temporarily closed status (Owner only)
 * @access  Private
 */
router.patch(
  '/:id/status',
  requireAuth,
  EstablishmentController.toggleTemporarilyClosed,
)

export default router
