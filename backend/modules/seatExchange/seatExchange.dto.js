class SeatExchangeDTO {
  constructor(data) {
    this.id = data._id;

    this.passengerName = data.passengerName;
    this.age = data.age;
    this.gender = data.gender;

    this.pnr = data.pnr;
    this.trainNumber = data.trainNumber;
    this.trainName = data.trainName;

    this.journeyDate = data.journeyDate;
    this.boardingStation = data.boardingStation;
    this.destinationStation = data.destinationStation;

    this.coach = data.coach;
    this.seatNumber = data.seatNumber;
    this.seatType = data.seatType;

    this.preferredSeat = data.preferredSeat;

    this.matchPercentage = data.matchPercentage;

    this.status = data.status;

    this.user = data.user;

    this.matchedUser = data.matchedUser;

    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

const seatExchangeDTO = (data) => {
  return new SeatExchangeDTO(data);
};

const seatExchangeDTOList = (data = []) => {
  return data.map((item) => new SeatExchangeDTO(item));
};

module.exports = {
  SeatExchangeDTO,
  seatExchangeDTO,
  seatExchangeDTOList,
};