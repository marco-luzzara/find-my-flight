import { Airport } from "../model/Airport"
import { Flight } from "../model/Flight"
import { SearchOneWayParams } from "../model/SearchParams"

export interface TravelCompanyIntegration {
    id: string
    label: string

    initialize(): Promise<TravelCompanyIntegration>

    searchOneWayFlights(params: SearchOneWayParams): Promise<Flight[]>
    listAirports(): Promise<Airport[]>
}