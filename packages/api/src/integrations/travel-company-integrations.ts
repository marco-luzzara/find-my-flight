import { TravelCompanyIntegration } from "./TravelCompanyIntegration";

import { readdir } from 'node:fs/promises'
import * as path from 'path'

const TRAVEL_COMPANIES_IMPL_DIR = 'travel-companies'

export const travelCompanyIntegrationsFn = (async function travelCompanyIntegrationsBuilder() {
    const modulePaths = await readdir(path.resolve(__dirname, TRAVEL_COMPANIES_IMPL_DIR));
    const integrations = await Promise.all(modulePaths.map(mp =>
        import(mp).then(async m => {
            const integrationClass = m.default
            const integration = (new integrationClass()) as TravelCompanyIntegration
            return await integration.initialize()
        })
    ))
    return new Map(integrations.map(int => [int.id, int]))
})()