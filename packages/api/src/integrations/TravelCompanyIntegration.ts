import { Airport } from "../model/Airport"
import { TravelCompanyId } from "../model/base-types"
import { Flight } from "../model/Flight"
import { SearchOneWayParams } from "../model/SearchParams"

export interface TravelCompanyIntegration {
    id: TravelCompanyId
    label: string

    initialize(): Promise<TravelCompanyIntegration>

    searchOneWayFlights(params: SearchOneWayParams): Promise<Flight[]>
    listAirports(): Promise<Airport[]>
}