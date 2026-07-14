<<<<<<< Updated upstream
const Joi = require("joi");

const verifyPNRSchema = Joi.object({
  pnr: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "PNR number is required.",
      "string.length": "PNR must be exactly 10 digits.",
      "string.pattern.base": "PNR must contain only numbers.",
      "any.required": "PNR number is required.",
    }),
});

module.exports = {
  verifyPNRSchema,
};
=======
const { MESSAGES } = require('./pnr.constants'); // 👈 Yahan pnr.constants hona chahiye, seatExchange nahi!

class PnrValidator {
    validateVerifyRequest(pnrDto) {
        if (!pnrDto.pnrNumber) {
            return { isValid: false, message: MESSAGES.REQUIRED };
        }
        
        const pnrRegex = /^\d{10}$/;
        if (!pnrRegex.test(pnrDto.pnrNumber)) {
            return { isValid: false, message: MESSAGES.INVALID_FORMAT };
        }
        
        return { isValid: true };
    }
}

module.exports = new PnrValidator();
>>>>>>> Stashed changes
