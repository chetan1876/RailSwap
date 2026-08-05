"use strict";

const aiRepository = require("./aiRecommendation.repository");
const ApiError = require("../../shared/apiError");

const SYSTEM_PROMPT = `
You are the RailSwap AI Recommendation Engine.
Your goal is to recommend the best train journeys, coach layouts, seat configurations, and travel insights based on passenger preferences.

You MUST respond in JSON format ONLY. Do not write any explanations before or after the JSON block.

The JSON response MUST conform to the following schema:
{
  "recommendations": [
    {
      "trainNumber": "String (e.g., 12951)",
      "trainName": "String (e.g., Mumbai Rajdhani Express)",
      "source": "String (Source Station with code, e.g., Mumbai Central (MMCT))",
      "destination": "String (Destination Station with code, e.g., New Delhi (NDLS))",
      "departureTime": "String (HH:MM)",
      "arrivalTime": "String (HH:MM)",
      "duration": "String (e.g., 15h 30m)",
      "comfortScore": "Number (0-100)",
      "recommendationScore": "Number (0-100)",
      "confidencePercentage": "Number (0-100)",
      "category": "String (e.g., Premium | Luxury | Value | Budget)",
      "price": "Number (INR cost per passenger)",
      "crowdPrediction": {
        "expectedCrowd": "String (Low | Medium | High | Very High)",
        "peakHoursNote": "String explanation",
        "rushFactor": "String (Weekend prediction, holiday rush, or festival impact explanation)",
        "leastCrowdedCoach": "String (e.g., A1, B3)"
      },
      "coachRecommendation": {
        "coach": "String (e.g., A1, B2)",
        "reason": "String explaining safety, exits, and quiet environment",
        "walkingDistance": "String (approximate distance from entry gate, e.g., 60m)",
        "safetyScore": "Number (0-100)",
        "nearExit": "Boolean",
        "nearWashroom": "Boolean"
      },
      "seatRecommendation": {
        "preferredBerth": "String (Lower | Middle | Upper | Window | Aisle | Side Lower | Side Upper)",
        "reason": "String reasoning based on age, gender, duration, night travel, senior citizen status, and medical needs",
        "safetyRating": "Number (1-5)",
        "comfortRating": "Number (1-5)"
      },
      "delayPrediction": {
        "probability": "String (Low | Medium | High)",
        "estimatedDelayMinutes": "Number",
        "reasoning": "String explaining historical delays or weather impact"
      },
      "reasonsToChoose": "String explaining why this train matches preferences",
      "advantages": ["String array (at least 2 items)"],
      "disadvantages": ["String array (at least 1 item)"],
      "travelTips": ["String array of hidden travel tips (at least 2 items)"],
      "advancedMetrics": {
        "womenSafetyScore": "Number (0-100)",
        "familyScore": "Number (0-100)",
        "nightSafetyScore": "Number (0-100)",
        "weatherImpact": "String description",
        "festivalImpact": "String description",
        "seatAvailabilityProbability": "Number (0-100)",
        "confirmationChance": "String (High | Medium | Low)",
        "waitingListAdvice": "String advice"
      }
    }
  ],
  "alternatives": [
    {
      "trainNumber": "String",
      "trainName": "String",
      "source": "String",
      "destination": "String",
      "departureTime": "String",
      "arrivalTime": "String",
      "duration": "String",
      "price": "Number",
      "comparisonReason": "String explaining why this is a suitable fallback route"
    }
  ],
  "journeyInsights": {
    "weatherReminder": "String description of weather at destination and packing tips",
    "packingTips": ["String array (at least 3 items)"],
    "safetyTips": ["String array (at least 2 items)"],
    "platformSuggestions": "String detailing expected boarding platform and station navigation",
    "foodRecommendations": ["String e-catering and local pantry options"],
    "journeyChecklist": ["String checklist items"],
    "emergencySuggestions": "String emergency contact and safety guidelines"
  }
}
`;

/**
 * Safely parses JSON response from Gemini, removing markdown blocks.
 */
const cleanAndParseJSON = (text) => {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    return JSON.parse(cleaned.trim());
  } catch (error) {
    console.error("Gemini response is not valid JSON. Response body:", text);
    throw new Error(
      "AI Recommendation generated an invalid format. Please try again.",
    );
  }
};

/**
 * Generate AI recommendation and store it in Firestore.
 */
const generateRecommendation = async (userEmail, data) => {
  const {
    source,
    destination,
    travelDate,
    travelClass,
    passengers,
    budget,
    preferences,
  } = data;

  const prompt = `
User Trip Details:
- Source: ${source}
- Destination: ${destination}
- Date: ${travelDate}
- Travel Class Preference: ${travelClass || "ALL"}
- Passengers Count: ${passengers || 1}
- Target Budget: ${budget ? "INR " + budget : "Not specified"}

Passenger & Travel Preferences:
- Seat Preference: ${preferences.seatPreference || "No Preference"}
- Class Preference: ${preferences.classPreference || "No Preference"}
- Must be Fastest: ${preferences.fastest ? "Yes" : "No"}
- Must be Cheapest: ${preferences.cheapest ? "Yes" : "No"}
- Least Crowded Coach Preferred: ${preferences.leastCrowded ? "Yes" : "No"}
- Family Friendly Journey: ${preferences.familyFriendly ? "Yes" : "No"}
- Student Friendly: ${preferences.studentFriendly ? "Yes" : "No"}
- Senior Citizen Priority: ${preferences.seniorFriendly ? "Yes" : "No"}
- Women Safety Priority: ${preferences.womenFriendly ? "Yes" : "No"}
- Overnight Travel: ${preferences.overnightTravel ? "Yes" : "No"}
- Day Travel: ${preferences.dayTravel ? "Yes" : "No"}

Based on these details, generate the recommendations following the system instructions. Ensure they are extremely detailed, realistic, and formatted in valid JSON.
`;

  try {
    const rawResponse = await aiRepository.askGemini(prompt, SYSTEM_PROMPT);
    const parsedData = cleanAndParseJSON(rawResponse);

    // Save to Firestore history
    const recordToSave = {
      userEmail,
      parameters: {
        source,
        destination,
        travelDate,
        travelClass: travelClass || "ALL",
        passengers: passengers || 1,
        budget: budget || null,
        preferences,
      },
      recommendations: parsedData.recommendations || [],
      alternatives: parsedData.alternatives || [],
      journeyInsights: parsedData.journeyInsights || {},
    };

    const savedRecord = await aiRepository.saveRecommendation(recordToSave);
    return savedRecord;
  } catch (error) {
    console.error("Service failed to generate recommendation:", error.message);

    // Classify known Gemini / network errors into clear user-facing messages
    const msg = error.message || "";

    if (msg.includes("GEMINI_API_KEY is not configured") || msg.includes("GEMINI_API_KEY")) {
      throw ApiError.internal("Gemini API key is missing. Add GEMINI_API_KEY to your .env file. Get a free key at https://aistudio.google.com/apikey");
    }
    if (msg.includes("API_KEY_INVALID") || msg.includes("invalid api key") || msg.includes("API key not valid")) {
      throw ApiError.internal("Invalid Gemini API key. Please check your GEMINI_API_KEY in .env.");
    }
    if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota") || msg.includes("429")) {
      throw ApiError.internal("Gemini API quota exceeded. Please wait or upgrade your plan.");
    }
    if (msg.includes("models/") && (msg.includes("not found") || msg.includes("404"))) {
      throw ApiError.internal(`Gemini model not found. The configured model may be unsupported. Please check your GEMINI_API_KEY and ensure the model is available in your region.`);
    }
    if (msg.includes("not found") && msg.includes("404")) {
      throw ApiError.internal(`Gemini API returned 404. The model may be unavailable or your API key may not have access. Check your GEMINI_API_KEY.`);
    }
    if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND") || msg.includes("ETIMEDOUT") || msg.includes("network")) {
      throw ApiError.internal("Network error: Unable to reach the Gemini AI service. Check your internet connection.");
    }
    if (msg.includes("invalid format") || msg.includes("not valid JSON")) {
      throw ApiError.internal("AI returned an unreadable response. Please try again.");
    }
    if (msg.includes("SERVICE_UNAVAILABLE") || msg.includes("503")) {
      throw ApiError.internal("Gemini AI service is temporarily unavailable. Please try again shortly.");
    }

    // Re-throw the real error message for any other case
    throw ApiError.internal(error.message || "Failed to generate AI recommendations.");
  }
};

/**
 * Fetch recommendation history for user.
 */
const getHistory = async (userEmail) => {
  return await aiRepository.getHistory(userEmail);
};

/**
 * Fetch recent recommendations for user.
 */
const getRecent = async (userEmail, limit = 5) => {
  return await aiRepository.getRecent(userEmail, limit);
};

/**
 * Get details of a single recommendation by ID.
 */
const getById = async (id, userEmail) => {
  const recommendation = await aiRepository.getById(id);
  if (!recommendation) {
    throw ApiError.notFound("Recommendation not found.");
  }

  if (recommendation.userEmail !== userEmail) {
    throw ApiError.unauthorized("Access denied.");
  }

  return recommendation;
};

/**
 * Toggles the bookmark status.
 */
const toggleBookmark = async (id, userEmail) => {
  const recommendation = await aiRepository.getById(id);
  if (!recommendation) {
    throw ApiError.notFound("Recommendation not found.");
  }

  if (recommendation.userEmail !== userEmail) {
    throw ApiError.unauthorized("Access denied.");
  }

  const nextState = !recommendation.isBookmarked;
  await aiRepository.updateBookmark(id, nextState);

  return {
    id,
    isBookmarked: nextState,
  };
};

/**
 * Delete a specific recommendation record.
 */
const deleteRecommendation = async (id, userEmail) => {
  const recommendation = await aiRepository.getById(id);
  if (!recommendation) {
    throw ApiError.notFound("Recommendation not found.");
  }

  if (recommendation.userEmail !== userEmail) {
    throw ApiError.unauthorized("Access denied.");
  }

  await aiRepository.deleteById(id);
  return { id, deleted: true };
};

/**
 * Clear history for a user.
 */
const clearHistory = async (userEmail) => {
  await aiRepository.clearHistory(userEmail);
  return { success: true };
};

/**
 * Search recommendations case-insensitively by source/destination.
 */
const searchRecommendations = async (userEmail, query) => {
  const history = await aiRepository.getHistory(userEmail);
  const normalizedQuery = query.toLowerCase().trim();

  return history.filter((item) => {
    const src = item.parameters?.source?.toLowerCase() || "";
    const dest = item.parameters?.destination?.toLowerCase() || "";
    return src.includes(normalizedQuery) || dest.includes(normalizedQuery);
  });
};

module.exports = {
  generateRecommendation,
  getHistory,
  getRecent,
  getById,
  toggleBookmark,
  deleteRecommendation,
  clearHistory,
  searchRecommendations,
};
