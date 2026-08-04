"use strict";

const aiService = require("./aiRecommendation.service");
const bookingService = require("./booking.service");
const ApiResponse = require("../../shared/apiResponse");
const { logger } = require("../../shared/logger");

/**
 * POST /
 * Generate a personalized train and travel recommendation.
 */
const getRecommendation = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return ApiResponse.error(res, "User authentication required.", 401);
    }

    logger.info("Generating AI Recommendation", { userEmail, body: req.body });

    const result = await aiService.generateRecommendation(userEmail, req.body);

    return ApiResponse.success(
      res,
      "AI Recommendation generated successfully.",
      result,
      201,
    );
  } catch (error) {
    logger.error("Error in getRecommendation controller", {
      error: error.message,
    });
    next(error);
  }
};

/**
 * GET /history
 * Fetch recommendation history for the logged in user.
 */
const getHistory = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return ApiResponse.error(res, "User authentication required.", 401);
    }

    logger.info("Fetching recommendation history", { userEmail });

    const history = await aiService.getHistory(userEmail);

    return ApiResponse.success(
      res,
      "Recommendation history retrieved successfully.",
      history,
      200,
    );
  } catch (error) {
    logger.error("Error in getHistory controller", { error: error.message });
    next(error);
  }
};

/**
 * GET /recent
 * Fetch recent recommendations for the logged in user.
 */
const getRecentRecommendations = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return ApiResponse.error(res, "User authentication required.", 401);
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    logger.info("Fetching recent recommendations", { userEmail, limit });

    const recent = await aiService.getRecent(userEmail, limit);

    return ApiResponse.success(
      res,
      "Recent recommendations retrieved successfully.",
      recent,
      200,
    );
  } catch (error) {
    logger.error("Error in getRecentRecommendations controller", {
      error: error.message,
    });
    next(error);
  }
};

/**
 * GET /search
 * Search recommendation history by source or destination name.
 */
const searchRecommendations = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return ApiResponse.error(res, "User authentication required.", 401);
    }

    const query = req.query.q;
    if (!query) {
      return ApiResponse.error(
        res,
        "Search query parameter 'q' is required.",
        400,
      );
    }

    logger.info("Searching recommendations", { userEmail, query });

    const results = await aiService.searchRecommendations(userEmail, query);

    return ApiResponse.success(
      res,
      "Recommendations search completed successfully.",
      results,
      200,
    );
  } catch (error) {
    logger.error("Error in searchRecommendations controller", {
      error: error.message,
    });
    next(error);
  }
};

/**
 * GET /:id
 * Fetch detailed view of a single recommendation by ID.
 */
const getRecommendationDetails = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const { id } = req.params;

    if (!userEmail) {
      return ApiResponse.error(res, "User authentication required.", 401);
    }

    logger.info("Fetching recommendation details", { userEmail, id });

    const details = await aiService.getById(id, userEmail);

    return ApiResponse.success(
      res,
      "Recommendation details retrieved successfully.",
      details,
      200,
    );
  } catch (error) {
    logger.error("Error in getRecommendationDetails controller", {
      error: error.message,
    });
    next(error);
  }
};

/**
 * POST /:id/bookmark
 * Toggle bookmark status.
 */
const bookmarkRecommendation = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const { id } = req.params;

    if (!userEmail) {
      return ApiResponse.error(res, "User authentication required.", 401);
    }

    logger.info("Bookmarking recommendation", { userEmail, id });

    const result = await aiService.toggleBookmark(id, userEmail);

    return ApiResponse.success(
      res,
      result.isBookmarked
        ? "Recommendation bookmarked successfully."
        : "Recommendation unbookmarked successfully.",
      result,
      200,
    );
  } catch (error) {
    logger.error("Error in bookmarkRecommendation controller", {
      error: error.message,
    });
    next(error);
  }
};

/**
 * DELETE /history
 * Clear all recommendation logs.
 */
const clearHistory = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return ApiResponse.error(res, "User authentication required.", 401);
    }

    logger.info("Clearing all recommendation history", { userEmail });

    const result = await aiService.clearHistory(userEmail);

    return ApiResponse.success(
      res,
      "All recommendation history cleared successfully.",
      result,
      200,
    );
  } catch (error) {
    logger.error("Error in clearHistory controller", { error: error.message });
    next(error);
  }
};

/**
 * DELETE /:id
 * Delete a specific recommendation log.
 */
const deleteRecommendation = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const { id } = req.params;

    if (!userEmail) {
      return ApiResponse.error(res, "User authentication required.", 401);
    }

    logger.info("Deleting recommendation log", { userEmail, id });

    const result = await aiService.deleteRecommendation(id, userEmail);

    return ApiResponse.success(
      res,
      "Recommendation log deleted successfully.",
      result,
      200,
    );
  } catch (error) {
    logger.error("Error in deleteRecommendation controller", {
      error: error.message,
    });
    next(error);
  }
};

/**
 * GET /booking/providers
 * Returns supported booking partner configurations.
 */
const getBookingProviders = async (req, res, next) => {
  try {
    const providers = bookingService.getProviders();
    return ApiResponse.success(
      res,
      "Booking providers retrieved successfully.",
      providers,
      200,
    );
  } catch (error) {
    logger.error("Error in getBookingProviders controller", {
      error: error.message,
    });
    next(error);
  }
};

/**
 * POST /booking/prepare
 * Prepares booking payload and provider redirect URL.
 */
const prepareBooking = async (req, res, next) => {
  try {
    logger.info("Preparing booking redirect URL", { body: req.body });
    const result = bookingService.prepareBooking(req.body);
    return ApiResponse.success(
      res,
      "Booking details prepared successfully.",
      result,
      200,
    );
  } catch (error) {
    logger.error("Error in prepareBooking controller", {
      error: error.message,
    });
    next(error);
  }
};

module.exports = {
  getRecommendation,
  getHistory,
  getRecentRecommendations,
  getRecommendationDetails,
  bookmarkRecommendation,
  deleteRecommendation,
  clearHistory,
  searchRecommendations,
  getBookingProviders,
  prepareBooking,
};
