import { LogUtils } from "@findmyflight/utils";
import { travelCompanyIntegrations } from "../integrations/travel-company-integrations";
import { Flight } from "../model/Flight";
import { SearchOneWayParams, SearchRoundTripParams } from "../model/SearchParams";

const logger = LogUtils.getLogger({
    api: searchOneWayFlights.name
})

export async function searchOneWayFlights(
    params: SearchOneWayParams,
): Promise<Flight[]> {
    let searchFlightsPromises = Array.from(travelCompanyIntegrations.values())
        .map(integration => {
            return integration.searchOneWayFlights(params)
        })

    let flights = (await Promise.allSettled(searchFlightsPromises).then(results => {
        results.filter(r => r.status === 'rejected').forEach(r =>
            logger.error(r.reason)
        )
        return results.filter(r => r.status === 'fulfilled').map(r => r.value)
    })).flatMap(f => f)

    return flights
}