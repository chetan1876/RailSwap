import api from "./api";

/* =====================================================
        TRAIN DELAY — FRONTEND SERVICE
===================================================== */

/**
 * Check train delay status by PNR or Train Number.
 *
 * @param {"pnr"|"train"} searchType
 * @param {string} value
 * @returns {Promise<object>}
 */
export const checkTrainDelay = async (searchType, value) => {
  const response = await api.post("/train-delay/check", {
    searchType,
    value: String(value).trim(),
  });
  return response.data;
};
