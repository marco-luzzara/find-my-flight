import { TravelCompanyIntegration } from "./TravelCompanyIntegration";

import { awaitSync } from "@kaciras/deasync";
import { readdir } from 'node:fs/promises'
import * as path from 'path'

const TRAVEL_COMPANIES_IMPL_DIR = 'travel-companies'

async function getTravelCompanyIntegrations() {
    const modulePaths = await readdir(path.resolve(__dirname, TRAVEL_COMPANIES_IMPL_DIR));
    const integrations = await Promise.all(modulePaths.map(mp =>
        import(mp).then(async m => {
            const integrationClass = m.default
            const integration = (new integrationClass()) as TravelCompanyIntegration
            return await integration.initialize()
        })
    ))
    return new Map(integrations.map(int => [int.id, int]))
}

/**
 * travelCompanyIntegrations is filled dynamically with the modules found in
 * `TRAVEL_COMPANIES_IMPL_DIR`. These modules must implement TravelCompanyIntegration.
 * Note: the event loop is temporarily blocked while initializing this object.
 * Although this is an antipattern, top-level await is not yet supported in
 * CommonJS modules and `awaitSync` is run only once during the module
 * initialization. 
 */
export const travelCompanyIntegrations = awaitSync(getTravelCompanyIntegrations())