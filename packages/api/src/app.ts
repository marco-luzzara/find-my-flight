import buildServer from './buildServer.js'
import { TravelCompanyIntegration } from "./integrations/TravelCompanyIntegration.js"
import RyanairIntegration from "./integrations/travel-companies/ryanair.js"

const travelCompanyIntegrations = await (async function getTravelCompanyIntegrations(): Promise<TravelCompanyIntegration[]> {
    const ryanairIntegration = await (new RyanairIntegration()).initialize()
    return [ryanairIntegration]
})()

const server = await buildServer({
    logger: {
        level: 'info'
    }
}, travelCompanyIntegrations)

server.listen({ port: 80, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
})
