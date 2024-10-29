import { TravelCompany } from "@findmyflight/api"

export type OneWayFlightsSearchFilters = {
    originAirports: string[]
    destinationAirports: string[]
    passengersAge: number[]
    departureDates: Date[]
    departureTimeStart: number
    departureTimeEnd: number
    maxFlightHours: number
    travelCompanies: TravelCompany[]
}