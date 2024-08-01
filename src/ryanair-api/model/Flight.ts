import { Airport } from "./Airport";
import { FlightDuration, PriceDetails } from "./base-types";

export type FlightSchedule = Map<string, Flight[]>

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