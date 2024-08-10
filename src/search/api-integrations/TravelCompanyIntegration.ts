import { Flight } from "../model/Flight";
import { SearchOneWayParams } from "../model/SearchParams";

export interface TravelCompanyIntegration {
    getOneWayFlights(params: SearchOneWayParams): Promise<Flight[]>
}