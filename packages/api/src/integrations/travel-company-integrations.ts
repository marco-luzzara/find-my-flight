// import { awaitSync } from "@kaciras/deasync";
// import { TravelCompanyIntegration } from "./TravelCompanyIntegration";
// import { readdir } from 'node:fs/promises'
// import * as path from 'path'
import RyanairIntegration from "./travel-companies/ryanair";
import { TravelCompanyIntegration } from "./TravelCompanyIntegration";
import { AsyncUtils } from "@findmyflight/utils";

// TODO: load integrations dynamically from directory
// const TRAVEL_COMPANIES_IMPL_DIR = 'travel-companies'

// async function getTravelCompanyIntegrations() {
//     const modulePaths = await readdir(path.resolve(__dirname, TRAVEL_COMPANIES_IMPL_DIR));
//     const integrations = await Promise.all(modulePaths.map(async mp => {
//         const module = await import(mp,)
//         const integrationClass = module.default
//         const integration = (new integrationClass()) as TravelCompanyIntegration
//         return await integration.initialize()
//     }))
//     return new Map(integrations.map(int => [int.id, int]))
// }

async function getTravelCompanyIntegrations(): Promise<Map<string, TravelCompanyIntegration>> {
    const ryanairIntegration = await (new RyanairIntegration()).initialize()
    return new Map([
        [ryanairIntegration.id, ryanairIntegration]
    ])
}



/**
 * travelCompanyIntegrations must implement TravelCompanyIntegration.
 * Note: the event loop is temporarily blocked while initializing this object.
 * Although this is an antipattern, top-level await is not yet supported in
 * CommonJS modules and `awaitSync` is run only once during the module
 * initialization. 
 */
export const travelCompanyIntegrations = AsyncUtils.awaitSync(getTravelCompanyIntegrations())