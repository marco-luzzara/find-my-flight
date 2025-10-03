import { AsyncUtils, LogUtils } from "@findmyflight/utils"
import { Airport } from "../model/Airport.js"
import { TravelCompanyIntegration } from "../integrations/TravelCompanyIntegration.js"

const logger = LogUtils.getLogger({
    api: listAirports.name
})

export async function listAirports(travelCompanyIntegrations: TravelCompanyIntegration[]): Promise<Airport[]> {
    const listAirportsPromises = travelCompanyIntegrations
        .map(integration => {
            return integration.listAirports()
        })

    const airportsMap = new Map<string, Airport>()
    for await (const response of AsyncUtils.getAsSoonAsSettled(listAirportsPromises)) {
        if (response.isResolved === false)
            logger.error(response.error)
        else {
            for (const airport of response.result) {
                if (!airportsMap.has(airport.code))
                    airportsMap.set(airport.code, airport)
            }
        }
    }

    return Promise.resolve(Array.from(airportsMap.values()))
}