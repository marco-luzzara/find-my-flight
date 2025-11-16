import { listAirports, listDestinationAirports } from "./apis/airports.js";
import { listDatesForFare, listOneWayFlights, listRoundTripFlights } from "./apis/fares.js";
import { createSession } from "./apis/miscellaneous.js";
import { UninitializedSessionError } from "./errors.js";
import { Cookie, PassengerType, PriceDetails, Session, Airport, Flight } from "./types.js";

const airportsApi = {
    listAirports, listDestinationAirports
}

const faresApi = {
    listDatesForFare, listOneWayFlights, listRoundTripFlights
}

const miscellaneousApi = {
    createSession
}

export const apis = {
    airports: airportsApi,
    fares: faresApi,
    miscellaneous: miscellaneousApi
}

export const apiErrors = {
    UninitializedSessionError
}

export { PassengerType }

export type {
    Airport, Flight, PriceDetails, Cookie, Session
}