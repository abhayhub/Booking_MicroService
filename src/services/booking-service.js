const axios = require('axios');
const { BookingRepository } = require('../repository/index');
const {FLIGHT_SERVICE_PATH } = require('../config/server-config');
const { ServiceError } = require('../utils/errors');

//${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}
class BookingService{

    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        
        try {
            console.log("inside service layer");
            const flightId = data.flightId;
            const getFlightRequestURL = `http://localhost:3000/api/v1/flights/${flightId}`; 
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('Something wen twrong in the booking process', 'Insufficient seats in the flight')
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            //{...data, totalCost} object destructured and new properties added
            const bookingPayload = {...data, totalCost};


            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `http://localhost:3000/api/v1/flights/`;
            await axios.patch(updateFlightRequestURL, {id : booking.flightId , totalSeats : flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status : "Booked"});
            return finalBooking;
        } catch (error) {
            if(error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;