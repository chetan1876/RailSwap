const Joi = require("joi");

const mongoId = Joi.string().hex().length(24);

const getDashboardValidation = {
  params: Joi.object({
    userId: mongoId.required(),
  }),
};

const getSafetyScoreValidation = {
  params: Joi.object({
    userId: mongoId.required(),
  }),
};

const getSafeSeatsValidation = {
  params: Joi.object({
    userId: mongoId.required(),
  }),
};

const getCompanionsValidation = {
  params: Joi.object({
    userId: mongoId.required(),
  }),
};

const connectCompanionValidation = {
  body: Joi.object({
    userId: mongoId.required(),

    companionId: mongoId.required(),

    message: Joi.string()
      .trim()
      .max(300)
      .allow("")
      .optional(),
  }),
};

const emergencySOSValidation = {
  body: Joi.object({
    userId: mongoId.required(),

    coach: Joi.string()
      .trim()
      .required(),

    seatNumber: Joi.string()
      .trim()
      .required(),

    latitude: Joi.number().optional(),

    longitude: Joi.number().optional(),

    emergencyMessage: Joi.string()
      .trim()
      .max(500)
      .optional(),
  }),
};

const contactRPFValidation = {
  body: Joi.object({
    userId: mongoId.required(),

    coach: Joi.string()
      .trim()
      .required(),

    seatNumber: Joi.string()
      .trim()
      .required(),

    reason: Joi.string()
      .trim()
      .required(),
  }),
};

const helplineValidation = {
  body: Joi.object({
    userId: mongoId.required(),

    issue: Joi.string()
      .trim()
      .required(),

    phoneNumber: Joi.string()
      .trim()
      .min(10)
      .max(15)
      .required(),
  }),
};

const insightValidation = {
  params: Joi.object({
    userId: mongoId.required(),
  }),
};

module.exports = {
  getDashboardValidation,
  getSafetyScoreValidation,
  getSafeSeatsValidation,
  getCompanionsValidation,
  connectCompanionValidation,
  emergencySOSValidation,
  contactRPFValidation,
  helplineValidation,
  insightValidation,
};