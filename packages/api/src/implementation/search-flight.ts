import { LogUtils } from "@findmyflight/utils";
import { Flight } from "../model/Flight.js";
import { SearchOneWayParams } from "../model/SearchParams.js";
import { TravelCompanyIntegration } from "../integrations/TravelCompanyIntegration.js";

const logger = LogUtils.getLogger({
    api: searchOneWayFlights.name
})

export async function searchOneWayFlights(
    travelCompanyIntegrations: TravelCompanyIntegration[],
    params: SearchOneWayParams,
): Promise<Flight[]> {
    const searchFlightsPromises = travelCompanyIntegrations
        .map(integration => {
            return integration.searchOneWayFlights(params)
        })

    const flights = (await Promise.allSettled(searchFlightsPromises).then(results => {
        results.filter(r => r.status === 'rejected').forEach(r =>
            logger.error(r.reason)
        )
        return results.filter(r => r.status === 'fulfilled').map(r => r.value)
    })).flatMap(f => f)

    return flights
}