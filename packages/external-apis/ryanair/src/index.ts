import { listAirports, listDestinationAirports } from "./apis/airports";
import { listAvailableDatesForFare, listAvailableOneWayFlights, listAvailableRoundTripFlights } from "./apis/fares";
import { createSession } from "./apis/miscellaneous";
import { ApiUnavailable, UnexpectedStatusCode, UninitializedSession, ValidationError } from "./errors";
import { Airport } from "./model/Airport";
import { Cookie, PassengerType, PriceDetails, Session } from "./model/base-types";
import { Flight } from "./model/Flight";

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
    ApiUnavailable, UninitializedSession, UnexpectedStatusCode, ValidationError
}

export { PassengerType }

export type {
    Airport, Flight, PriceDetails, Cookie, Session
}