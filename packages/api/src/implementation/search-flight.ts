import { travelCompanyIntegrations } from "../integrations/travel-company-integrations";
import { Flight } from "../model/Flight";
import { SearchOneWayParams, SearchRoundTripParams } from "../model/SearchParams";


export async function searchOneWayFlights(
    params: SearchOneWayParams,
): Promise<Flight[]> {
    let searchFlightsPromises = Array.from(travelCompanyIntegrations.values()).map(int => {
        const integrationBuilder = int
        return (async () => {
            const integration = await integrationBuilder
            return await integration.searchOneWayFlights(params)
        })()
    })

    let flights = (await Promise.all(searchFlightsPromises)).flatMap(f => f)

    return flights
}