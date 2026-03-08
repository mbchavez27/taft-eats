import { Router } from 'express'
import { EstablishmentController } from './establishments.controller.js'

const router = Router()

/**
 * @route   GET /api/establishments
 * @desc    Get a paginated list of all restaurants (accepts ?limit=10&lastId=5)
 * @access  Public (or Private, depending on your auth middleware)
 */
router.get('/', EstablishmentController.getAllRestaurants)

/**
 * @route   GET /api/establishments/owner/:ownerId
 * @desc    Get a specific restaurant by the owner's user ID
 * @access  Public
 */
router.get('/owner/:ownerId', EstablishmentController.getRestaurantByOwnerId)

/**
 * @route   GET /api/establishments/:id
 * @desc    Get a specific restaurant by its ID
 * @access  Public
 * * Note: We place this AFTER the '/owner/:ownerId' route.
 * If it were above it, Express might mistakenly read the word "owner" as an :id!
 */
router.get('/:id', EstablishmentController.getRestaurantById)

export default router
