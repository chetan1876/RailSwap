const seatExchangeService = require('./seatExchange.service');
const seatExchangeValidator = require('./seatExchange.validation');
const SeatExchangeDTO = require('./seatExchange.dto');
const SeatExchangeMapper = require('./seatExchange.mapper');
const { MESSAGES } = require('./seatExchange.constants');

class SeatExchangeController {
    // 👇 Is function ka naam routes se strict match hona chahiye
    async createRequest(req, res, next) {
        try {
            const dto = SeatExchangeDTO.fromRequest(req);
            const validation = seatExchangeValidator.validateCreateRequest(dto);
            if (!validation.isValid) {
                return res.status(400).json({ success: false, message: validation.message });
            }

            const userId = req.user ? req.user.id : "65cb1234567890abcdef1234"; // Default testing ID if auth middleware is absent
            const result = await seatExchangeService.createExchangeRequest(userId, dto);
            
            return res.status(201).json({
                success: true,
                message: MESSAGES.CREATED,
                data: {
                    request: SeatExchangeMapper.toClientResponse(result.request),
                    potentialMatches: SeatExchangeMapper.toClientResponseList(result.potentialMatches)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async acceptRequest(req, res, next) {
        try {
            const { requestId } = req.body;
            const updated = await seatExchangeService.acceptExchange(requestId);
            return res.status(200).json({
                success: true,
                message: MESSAGES.ACCEPTED,
                data: SeatExchangeMapper.toClientResponse(updated)
            });
        } catch (error) {
            next(error);
        }
    }

    async rejectRequest(req, res, next) {
        try {
            const { requestId } = req.body;
            const updated = await seatExchangeService.rejectExchange(requestId);
            return res.status(200).json({
                success: true,
                message: MESSAGES.REJECTED,
                data: SeatExchangeMapper.toClientResponse(updated)
            });
        } catch (error) {
            next(error);
        }
    }

    async getHistory(req, res, next) {
        try {
            const userId = req.user ? req.user.id : "65cb1234567890abcdef1234";
            const history = await seatExchangeService.getHistory(userId);
            return res.status(200).json({
                success: true,
                data: SeatExchangeMapper.toClientResponseList(history)
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SeatExchangeController(); // 👈 Express routes ko link dene ke liye export initialization
