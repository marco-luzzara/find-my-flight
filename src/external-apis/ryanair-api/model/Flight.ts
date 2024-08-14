import { Airport } from "./Airport";
import { PriceDetails } from "./base-types";

/**
 * a map where the key is a stringed date and the value is an array
 * containing all the flights for the corresponding date
 */
export type FlightSchedule = Map<string, Flight[]>

export type Flight = {
    flightNumber: string
    origin: Airport
    destination: Airport
    departureDate: Date
    arrivalDate: Date
    seatLeft?: number
    infantsLeft?: number
    priceDetails: PriceDetails
    duration: number
}