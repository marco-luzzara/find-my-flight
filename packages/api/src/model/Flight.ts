import { Airport } from "./Airport"
import { TravelCompany } from "./TravelCompany"

export type Flight = {
    flightNumber: string
    origin: Airport
    destination: Airport
    departureDate: Date
    arrivalDate: Date
    price: number
    travelCompany: TravelCompany
}

/**
 * returns the duration of a flight in minutes
 * @param flight 
 */
export function getFlightDuration(flight: Flight): number {
    return (flight.arrivalDate.valueOf() - flight.departureDate.valueOf()) / (60 * 1000)
}