import configurationManager from "@/ConfigurationManager";
import { OneWayFlightsSearchFilters } from "@/types/search";
import { Flight } from "@findmyflight/api";
import { DateUtils } from "@findmyflight/utils";

export class FlightsRepository {
    public async searchOneWayFlights(filters: OneWayFlightsSearchFilters): Promise<Flight[]> {
        const urlParams = new URLSearchParams()
        for (let v of filters.originAirports)
            urlParams.append('originCodes', v)

        for (let v of filters.destinationAirports)
            urlParams.append('destinationCodes', v)

        for (let v of filters.passengersAge)
            urlParams.append('passengersAge', v.toString())

        for (let v of filters.departureDates)
            urlParams.append('departureDates', DateUtils.formatDateAsISO(v))

        urlParams.append('departureTimeStart', filters.departureTimeStart.toString())
        urlParams.append('departureTimeEnd', filters.departureTimeEnd.toString())
        urlParams.append('maxFlightHours', filters.maxFlightHours.toString())

        for (let v of filters.travelCompanies)
            urlParams.append('travelCompanies', v)

        const response = await fetch(`${configurationManager.apiEndpoint}/flights/search/oneway?${urlParams}`)
        return await response.json()
    }
}