import { Airport } from "./Airport";
import { DayInterval, HourInterval } from "./base-types";
import { TravelCompany } from "./TravelCompany";

export type SearchOneWayParams = {
    /**
     * The possible airports where the flight starts
     */
    origins: Airport[]
    /**
     * The possible airports where the flight ends
     */
    destinations: Airport[]
    /**
     * age of the people traveling
     */
    passengersAge: number[]
    /**
     * The available dates you can fly from an origin airport 
     */
    departureDates: Date[]
    /**
     * The hours in a day you want your flight to depart
     */
    departureTimeInterval: HourInterval
    /**
     * Maximum duration of the flight in minutes
     */
    maxFlightDuration?: number
    /**
     * search results can come from these travel companies exclusively
     */
    travelCompanies: TravelCompany[]
}

export type SearchRoundTripParams = SearchOneWayParams & {
    roundTrip: true
    /**
     * The available dates of the return flight 
     */
    endDates: Date[]
    /**
     * The hours in a day of the return flight
     */
    endTimeInterval: HourInterval
    /**
     * The starting airport and the destination airport of the return trip must be the same 
     */
    sameOriginAirport: boolean
    /**
     * The range of days from the start flight to the end flight. `IntegerInterval(4, 7)` means 
     * that the number of days from the start flight to the return flight can range between 4 and 7
     */
    daysRange: DayInterval
    /**
     * Maximum duration of the return flight in minutes
     */
    maxEndFlightDuration?: number
}