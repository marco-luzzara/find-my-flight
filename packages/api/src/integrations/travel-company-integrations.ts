import { Airport } from "../model/Airport";
import { Flight } from "../model/Flight";
import { SearchOneWayParams } from "../model/SearchParams";
import { TravelCompany } from "../model/TravelCompany";
import { RyanairIntegration } from "./ryanair";

export interface TravelCompanyIntegration {
    searchOneWayFlights(params: SearchOneWayParams): Promise<Flight[]>
    listAirports(): Promise<Airport[]>
}

export const travelCompanyIntegrations: Map<TravelCompany, Promise<TravelCompanyIntegration>> = new Map([
    [TravelCompany.Ryanair, RyanairIntegration.create()]
])