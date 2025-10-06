import { listAirports, listDestinationAirports } from "./apis/airports.js";
import { listAvailableDatesForFare, listAvailableOneWayFlights, listAvailableRoundTripFlights } from "./apis/fares.js";
import { createSession } from "./apis/miscellaneous.js";
import { UninitializedSessionError } from "./errors.js";
import { Cookie, PassengerType, PriceDetails, Session, Airport, Flight } from "./types.js";

export const airportsApi = {
    listAirports, listDestinationAirports
}

export const faresApi = {
    listAvailableDatesForFare, listAvailableOneWayFlights, listAvailableRoundTripFlights
}

export const miscellaneousApi = {
    createSession
}

export const apiErrors = {
    UninitializedSessionError
}

export { PassengerType }

export type {
    Airport, Flight, PriceDetails, Cookie, Session
}