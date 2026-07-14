<<<<<<< Updated upstream
const pnrResponseDTO = (pnr) => {
  return {
    id: pnr._id,
    pnr: pnr.pnr,
    passengerName: pnr.passengerName,
    trainNumber: pnr.trainNumber,
    trainName: pnr.trainName,
    from: pnr.from,
    to: pnr.to,
    journeyDate: pnr.journeyDate,
    coach: pnr.coach,
    seat: pnr.seat,
    status: pnr.status,
  };
};

module.exports = {
  pnrResponseDTO,
};
=======
class SeatExchangeDTO {
    constructor(data) {
        this.trainNumber = data.trainNumber ? data.trainNumber.trim() : null;
        this.currentSeatNumber = data.currentSeatNumber ? data.currentSeatNumber.trim() : null;
        this.currentBerthType = data.currentBerthType ? data.currentBerthType.toUpperCase() : null;
        this.desiredBerthType = data.desiredBerthType ? data.desiredBerthType.toUpperCase() : null;
    }

    static fromRequest(req) {
        return new SeatExchangeDTO(req.body);
    }
}

module.exports = SeatExchangeDTO;
>>>>>>> Stashed changes
