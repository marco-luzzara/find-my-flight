import { Airport } from "./Airport";
import { FlightDate, FlightDuration, PriceDetails } from "./base-types";

export type FlightSchedule = {
    [date: string]: Flight[]
}

export type Flight = {
    flightNumber: string
    origin: Airport
    destination: Airport
    departureDate: Date
    arrivalDate: Date
    seatLeft?: number
    infantsLeft?: number
    prices: Array<PriceDetails>
    duration: FlightDuration
}