import { Airport } from "../model/Airport.js"
import { TravelCompanyId } from "../model/base-types.js"
import { Flight } from "../model/Flight.js"
import { SearchOneWayParams } from "../model/SearchParams.js"

export interface TravelCompanyIntegration {
    id: TravelCompanyId
    label: string

    initialize(): Promise<TravelCompanyIntegration>

    searchOneWayFlights(params: SearchOneWayParams): Promise<Flight[]>
    listAirports(): Promise<Airport[]>
}