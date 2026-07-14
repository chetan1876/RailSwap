<<<<<<< Updated upstream
const { pnrResponseDTO } = require("./pnr.dto");

const mapPNRResponse = (pnrData) => {
  return pnrResponseDTO(pnrData);
};

const mapPNRHistory = (pnrList) => {
  return pnrList.map((pnr) => pnrResponseDTO(pnr));
};

module.exports = {
  mapPNRResponse,
  mapPNRHistory,
};
=======
class SeatExchangeMapper {
    static toClientResponse(data) {
        if (!data) return null;
        return {
            id: data._id,
            userId: data.userId,
            trainNumber: data.trainNumber,
            currentSeatNumber: data.currentSeatNumber,
            currentBerthType: data.currentBerthType,
            desiredBerthType: data.desiredBerthType,
            status: data.status,
            createdAt: data.createdAt
        };
    }

    static toClientResponseList(list) {
        return list.map(item => SeatExchangeMapper.toClientResponse(item));
    }
}

module.exports = SeatExchangeMapper;
>>>>>>> Stashed changes
