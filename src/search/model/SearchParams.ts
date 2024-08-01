import { Airport } from "../../ryanair-api/model/Airport"
import { FlightDuration } from "../../ryanair-api/model/base-types";
import { IntegerInterval } from "./base-types";

export type SearchOneWayParams = {
    languageLocale: string
    /**
     * The possible airports where the flight starts
     */
    origins: Airport[]
    /**
     * The possible airports where the flight ends
     */
    destinations: Airport[]
    /**
     * Number of adults
     */
    adults: number
    /**
     * Number of teenagers (between 12 and 16 years old)
     */
    teenagers: number
    /**
     * Number of children (between 2 and 12 years old)
     */
    children: number
    /**
     * Number of infants (<2 years old)
     */
    infants: number
    /**
     * The available dates you can fly from an origin airport 
     */
    startDates: Date[]
    /**
     * The hours in a day of the start flight
     */
    startTimeInterval: IntegerInterval
    /**
     * Maximum duration of the flight
     */
    maxFlightDuration: FlightDuration
}

export type SearchRoundTripParams = SearchOneWayParams & {
    /**
     * The available dates of the return flight 
     */
    endDates: Date[]
    /**
     * The hours in a day of the return flight
     */
    endTimeInterval: IntegerInterval
    /**
     * The starting airport and the destination airport of the return trip must be the same 
     */
    sameOriginAirport: boolean
    /**
     * The range of days from the start flight to the end flight. `IntegerInterval(4, 7)` means 
     * that the number of days from the start flight to the return flight can range between 4 and 7
     */
    daysRange: IntegerInterval
}