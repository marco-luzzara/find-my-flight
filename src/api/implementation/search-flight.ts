import { RyanairIntegration } from "../integrations/ryanair";
import { TravelCompanyIntegration } from "../integrations/TravelCompanyIntegration";
import { Flight } from "../model/Flight";
import { SearchOneWayParams, SearchRoundTripParams } from "../model/SearchParams";
import { TravelCompany } from "../model/TravelCompany";

const travelCompanyIntegrations: Map<TravelCompany, Promise<TravelCompanyIntegration>> = new Map([
    [TravelCompany.Ryanair, RyanairIntegration.create()]
])


export async function searchOneWayFlight(
    params: SearchOneWayParams,
): Promise<Flight[]> {
    let searchResultPromises: Promise<Flight[]>[] = []

    for (let travelCompany of params.travelCompanies) {
        searchResultPromises.push((async () => {
            const integration = await travelCompanyIntegrations.get(travelCompany)
            return await integration.getOneWayFlights(params)
        })())
    }

    let flights = (await Promise.all(searchResultPromises)).flatMap(f => f)

    return flights
}