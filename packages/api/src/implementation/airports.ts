import { AsyncUtils, LogUtils } from "@findmyflight/utils"
import { travelCompanyIntegrations } from "../integrations/travel-company-integrations"
import { Airport } from "../model/Airport"

const logger = LogUtils.getLogger({
    api: listAirports.name
})

export async function listAirports(): Promise<Airport[]> {
    const listAirportsPromises = Array.from(travelCompanyIntegrations.values())
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