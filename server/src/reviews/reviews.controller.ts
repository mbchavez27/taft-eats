/**
 * @fileoverview Controller for handling review-related HTTP requests.
 * @module controllers/ReviewController
 */

import { Request, Response } from "express";
import { ReviewService } from "./reviews.service.js";
import { CreateReviewDTO } from "./dto/reviews-dto.js";
import { ReviewModel } from "./reviews.model.js";

/**
 * Controller object for managing reviews.
 * @namespace ReviewController
 */
export const ReviewController = {
  /**
   * Handles POST requests to create a new review.
   * @async
   * @memberof ReviewController
   * @param {Request} req - The Express request object containing the review payload.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  createReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized. Please log in." });
        return;
      }

      const reviewData: CreateReviewDTO = req.body;

      const reviewId = await ReviewService.createReviewWithTags(
        userId,
        reviewData,
      );

      res.status(201).json({
        success: true,
        message: "Review created successfully",
        reviewId,
      });
    } catch (error) {
      console.error("Error in createReview:", error);
      res
        .status(500)
        .json({ error: "Internal server error while creating review." });
    }
  },

  /**
   * Handles GET requests to fetch a paginated list of reviews for a restaurant.
   * Expects 'restaurantId' in the route params, and optional 'limit' and 'lastId' in query.
   * @async   * @memberof ReviewController
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>}
   */
  getReviewsByRestaurantId: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const restaurantId = parseInt(req.params.restaurantId as string, 10);

      // Extract userId if the user is logged in (even on a public route)
      const currentUserId = (req as any).user?.userId;

      if (isNaN(restaurantId)) {
        res.status(400).json({ error: "Invalid restaurant ID formatting." });
        return;
      }

      let limitRaw = req.query.limit;
      let lastIdRaw = req.query.lastId;
      if (Array.isArray(limitRaw)) limitRaw = limitRaw[0];
      if (Array.isArray(lastIdRaw)) lastIdRaw = lastIdRaw[0];

      const limit = typeof limitRaw === "string" ? parseInt(limitRaw, 10) : 10;
      const lastId =
        typeof lastIdRaw === "string" ? parseInt(lastIdRaw, 10) : undefined;

      const reviews = await ReviewModel.getReviewsByRestaurantId(
        restaurantId,
        limit,
        lastId,
        currentUserId,
      );

      res.status(200).json({
        success: true,
        data: reviews,
        count: reviews.length,
      });
    } catch (error) {
      console.error("Error in getReviewsByRestaurantId:", error);
      res
        .status(500)
        .json({ error: "Internal server error while fetching reviews." });
    }
  },

  /**
   * Handles POST requests to add/change/remove a vote.
   */
  voteReview: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized. Please log in to vote." });
        return;
      }

      const reviewId = parseInt(req.params.reviewId as string, 10);
      const { voteType } = req.body;

      if (isNaN(reviewId) || !["like", "dislike", "none"].includes(voteType)) {
        res.status(400).json({ error: "Invalid request parameters." });
        return;
      }

      await ReviewModel.voteReview(reviewId, userId, voteType);

      res
        .status(200)
        .json({ success: true, message: "Vote recorded successfully" });
    } catch (error) {
      console.error("Error in voteReview:", error);
      res.status(500).json({ error: "Internal server error while voting." });
    }
  },
};
