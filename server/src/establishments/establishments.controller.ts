import { Request, Response } from 'express'
import { EstablishmentModel, GetRestaurantsFilterParams } from './establishments.model.js'

export const EstablishmentController = {
  /**
   * Handles GET requests to fetch a paginated list of restaurants.
   * Expects optional 'limit' and 'lastId' in the query string.
   */
  getAllRestaurants: async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Strict Type Narrowing for Query Parameters
      let limitRaw = req.query.limit
      let lastIdRaw = req.query.lastId

      // If it's an array, grab the first element
      if (Array.isArray(limitRaw)) limitRaw = limitRaw[0]
      if (Array.isArray(lastIdRaw)) lastIdRaw = lastIdRaw[0]

      // Now TypeScript knows these are strictly strings (or undefined)
      const limit = typeof limitRaw === 'string' ? parseInt(limitRaw, 10) : 10
      const lastId =
        typeof lastIdRaw === 'string' ? parseInt(lastIdRaw, 10) : undefined

      // Validate the parsed numbers
      if (isNaN(limit)) {
        res
          .status(400)
          .json({ error: 'Invalid limit parameter. Must be a number.' })
        return
      }

      if (lastId !== undefined && isNaN(lastId)) {
        res
          .status(400)
          .json({ error: 'Invalid lastId parameter. Must be a number.' })
        return
      }

      // 2. Helper to parse tags and priceRanges (handles undefined, string, or array of strings)
      const parseArrayParam = (param: any): string[] => {
        if (!param) return []
        if (Array.isArray(param)) return param as string[]
        return [param as string]
      }

      const tags = parseArrayParam(req.query.tags)
      const priceRanges = parseArrayParam(req.query.priceRanges)

      let restaurants

      // 3. Decide which model method to call
      if (tags.length > 0 || priceRanges.length > 0) {
        const filterParams: GetRestaurantsFilterParams = {
          tags,
          priceRanges,
          limit,
          lastId,
        }
        restaurants = await EstablishmentModel.getAllRestaurantsByTags(filterParams)
      } else {
        restaurants = await EstablishmentModel.getAllRestaurants(limit, lastId)
      }

      // 4. Send response
      res.status(200).json({
        success: true,
        data: restaurants,
        count: restaurants.length,
      })
    } catch (error) {
      console.error('Error in getAllRestaurants:', error)
      res
        .status(500)
        .json({ error: 'Internal server error while fetching restaurants.' })
    }
  },

  /**
   * Handles GET requests to fetch a single restaurant by its ID.
   * Expects 'id' in the route parameters.
   */
  getRestaurantById: async (req: Request, res: Response): Promise<void> => {
    try {
      // Safely cast route params to string
      const id = parseInt(req.params.id as string, 10)

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid restaurant ID formatting.' })
        return
      }

      const restaurant = await EstablishmentModel.getRestaurantById(id)

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
      res
        .status(500)
        .json({ error: 'Internal server error while fetching the restaurant.' })
    }
  },

  /**
   * Handles GET requests to fetch a restaurant by its owner's user ID.
   * Expects 'ownerId' in the route parameters.
   */
  getRestaurantByOwnerId: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      // Safely cast route params to string
      const ownerId = parseInt(req.params.ownerId as string, 10)

      if (isNaN(ownerId)) {
        res.status(400).json({ error: 'Invalid owner ID formatting.' })
        return
      }

      const restaurant =
        await EstablishmentModel.getRestaurantByOwnerId(ownerId)

      if (!restaurant) {
        res.status(404).json({ error: 'No restaurant found for this owner.' })
        return
      }

      res.status(200).json({
        success: true,
        data: restaurant,
      })
    } catch (error) {
      console.error('Error in getRestaurantByOwnerId:', error)
      res.status(500).json({
        error: "Internal server error while fetching the owner's restaurant.",
      })
    }
  },

  /**
   * Handles GET requests to fetch all tags for a specific restaurant.
   * Expects 'id' (restaurant_id) in the route parameters.
   */
  getTagsByRestaurantId: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10)

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid restaurant ID formatting.' })
        return
      }

      // Call the model we just created
      const tags = await EstablishmentModel.getTagsByRestaurantId(id)

      res.status(200).json({
        success: true,
        data: tags,
      })
    } catch (error) {
      console.error('Error in getTagsByRestaurantId:', error)
      res.status(500).json({
        error: 'Internal server error while fetching restaurant tags.',
      })
    }
  },
}
