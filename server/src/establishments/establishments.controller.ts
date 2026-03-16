import { Request, Response } from 'express'
import {
  EstablishmentModel,
  GetRestaurantsFilterParams,
} from './establishments.model.js'

export const EstablishmentController = {
  /**
   * Handles GET requests to fetch a paginated list of restaurants.
   * Includes logic to check if the current user has bookmarked the results.
   */
  getAllRestaurants: async (req: Request, res: Response): Promise<void> => {
    try {

      let limitRaw = req.query.limit
      let lastIdRaw = req.query.lastId

      if (Array.isArray(limitRaw)) limitRaw = limitRaw[0]
      if (Array.isArray(lastIdRaw)) lastIdRaw = lastIdRaw[0]

      const limit = typeof limitRaw === 'string' ? parseInt(limitRaw, 10) : 10
      const lastId =
        typeof lastIdRaw === 'string' ? parseInt(lastIdRaw, 10) : undefined

      if (isNaN(limit)) {
        res.status(400).json({ error: 'Invalid limit parameter.' })
        return
      }

      if (lastId !== undefined && isNaN(lastId)) {
        res.status(400).json({ error: 'Invalid lastId parameter.' })
        return
      }

      const parseArrayParam = (param: any): string[] => {
        if (!param) return []
        if (Array.isArray(param)) return param as string[]
        return [param as string]
      }

      const tags = parseArrayParam(req.query.tags)
      const priceRanges = parseArrayParam(req.query.priceRanges)
      
      const ratingRaw = req.query.rating
      const rating = typeof ratingRaw === 'string' ? parseInt(ratingRaw, 10) : undefined

      const currentUserId = (req as any).user?.userId
      let restaurants

      if (tags.length > 0 || priceRanges.length > 0 || (rating && rating > 0)) {
        const filterParams: GetRestaurantsFilterParams = {
          tags,
          priceRanges,
          limit,
          lastId,
          rating,
        }
        restaurants = await EstablishmentModel.getAllRestaurantsByTags(
          filterParams,
          currentUserId,
        )
      } else {
        restaurants = await EstablishmentModel.getAllRestaurants(
          limit,
          lastId,
          currentUserId,
        )
      }

      res.status(200).json({
        success: true,
        data: restaurants,
        count: restaurants.length,
      })
    } catch (error) {
      console.error('Error in getAllRestaurants:', error)
      res.status(500).json({ error: 'Internal server error.' })
    }
  },

  /**
   * Handles GET requests to fetch a single restaurant by its ID.
   * Passes currentUserId to check if this specific restaurant is bookmarked by the user.
   */
  getRestaurantById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10)

      // NEW: Extract userId from optionalAuth middleware
      const currentUserId = (req as any).user?.userId

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid restaurant ID formatting.' })
        return
      }

      // NEW: Pass currentUserId to the model
      const restaurant = await EstablishmentModel.getRestaurantById(
        id,
        currentUserId,
      )

      if (!restaurant) {
        res.status(404).json({ error: 'Restaurant not found.' })
        return
      }

      res.status(200).json({
        success: true,
        data: restaurant,
      })
    } catch (error) {
      console.error('Error in getRestaurantById:', error)
      res.status(500).json({ error: 'Internal server error.' })
    }
  },

  /**
   * Handles GET requests to fetch a restaurant by its owner's user ID.
   */
  getRestaurantByOwnerId: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const ownerId = parseInt(req.params.ownerId as string, 10)
      if (isNaN(ownerId)) {
        res.status(400).json({ error: 'Invalid owner ID.' })
        return
      }

      const restaurant =
        await EstablishmentModel.getRestaurantByOwnerId(ownerId)

      if (!restaurant) {
        res.status(404).json({ error: 'No restaurant found for this owner.' })
        return
      }

      res.status(200).json({ success: true, data: restaurant })
    } catch (error) {
      console.error('Error in getRestaurantByOwnerId:', error)
      res.status(500).json({ error: 'Internal server error.' })
    }
  },

  /**
   * Handles GET requests to fetch all tags for a specific restaurant.
   */
  getTagsByRestaurantId: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10)
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid restaurant ID.' })
        return
      }

      const tags = await EstablishmentModel.getTagsByRestaurantId(id)
      res.status(200).json({ success: true, data: tags })
    } catch (error) {
      console.error('Error in getTagsByRestaurantId:', error)
      res.status(500).json({ error: 'Internal server error.' })
    }
  },

  /**
   * Handles POST requests to bookmark a restaurant.
   */
  bookmarkRestaurant: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId
      const restaurantId = parseInt(req.params.id as string, 10)

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized. Please log in.' })
        return
      }
      if (isNaN(restaurantId)) {
        res.status(400).json({ error: 'Invalid restaurant ID.' })
        return
      }

      await EstablishmentModel.bookmarkRestaurant(userId, restaurantId)
      res
        .status(200)
        .json({ success: true, message: 'Bookmarked successfully.' })
    } catch (error) {
      console.error('Error bookmarking:', error)
      res.status(500).json({ error: 'Internal server error.' })
    }
  },

  /**
   * Handles DELETE requests to unbookmark a restaurant.
   */
  unbookmarkRestaurant: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId
      const restaurantId = parseInt(req.params.id as string, 10)

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized. Please log in.' })
        return
      }
      if (isNaN(restaurantId)) {
        res.status(400).json({ error: 'Invalid restaurant ID.' })
        return
      }

      await EstablishmentModel.unbookmarkRestaurant(userId, restaurantId)
      res
        .status(200)
        .json({ success: true, message: 'Unbookmarked successfully.' })
    } catch (error) {
      console.error('Error unbookmarking:', error)
      res.status(500).json({ error: 'Internal server error.' })
    }
  },

  /**
   * Handles GET requests to fetch a user's bookmarked restaurants.
   */
  getUserBookmarks: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized. Please log in.' })
        return
      }

      let limitRaw = req.query.limit
      let lastIdRaw = req.query.lastId
      if (Array.isArray(limitRaw)) limitRaw = limitRaw[0]
      if (Array.isArray(lastIdRaw)) lastIdRaw = lastIdRaw[0]

      const limit = typeof limitRaw === 'string' ? parseInt(limitRaw, 10) : 10
      const lastId =
        typeof lastIdRaw === 'string' ? parseInt(lastIdRaw, 10) : undefined

      const restaurants = await EstablishmentModel.getUserBookmarks(
        userId,
        limit,
        lastId,
      )

      res.status(200).json({
        success: true,
        data: restaurants,
        count: restaurants.length,
      })
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      res.status(500).json({ error: 'Internal server error.' })
    }
  },
}
