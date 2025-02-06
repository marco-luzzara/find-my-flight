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

    const airportsMap = new Map()
    for await (let response of AsyncUtils.getAsSoonAsSettled(listAirportsPromises)) {
        if (response.isResolved === false)
            logger.error(response.error)
        else {
            for (let airport of response.result) {
                if (!airportsMap.has(airport.code))
                    airportsMap.set(airport.code, airport)
            }
        }
    }

    return Promise.resolve(Array.from(airportsMap.values()))
}