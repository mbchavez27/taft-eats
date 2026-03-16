import { Router } from 'express'
import { EstablishmentController } from './establishments.controller.js'
import { optionalAuth, requireAuth } from 'shared/middleware/auth.middleware.js'

const router = Router()

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
