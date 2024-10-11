import { travelCompanyIntegrations } from "../integrations/travel-company-integrations"
import { AsyncUtils } from "@findmyflight/utils"
import { Airport } from "../model/Airport"

export async function listAirports(): Promise<Airport[]> {
    const listAirportsPromises = Array.from(travelCompanyIntegrations.values()).map(integration => {
        const integrationBuilder = integration
        return (async () => {
            const integration = await integrationBuilder;
            return await integration.listAirports()
        })()
    })

    const airportsMap = new Map()
    for await (let airports of AsyncUtils.getAsSoonAsReady(listAirportsPromises)) {
        for (let airport of airports) {
            if (!airportsMap.has(airport.code))
                airportsMap.set(airport.code, airport)
        }
    }

    return Promise.resolve(Array.from(airportsMap.values()))
}