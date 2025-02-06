import dotenv from "dotenv"
dotenv.config()

import buildServer from './buildServer.js'
import { TravelCompanyIntegration } from "./integrations/TravelCompanyIntegration.js"
import RyanairIntegration from "./integrations/travel-companies/ryanair.js"
const API_SERVER_PORT = parseInt(process.env.API_SERVER_PORT) ?? 9678

const travelCompanyIntegrations = await (async function getTravelCompanyIntegrations(): Promise<TravelCompanyIntegration[]> {
    const ryanairIntegration = await (new RyanairIntegration()).initialize()
    return [ryanairIntegration]
})()

const server = buildServer({
    logger: {
        level: 'info'
    }
}, travelCompanyIntegrations)

server.listen({ port: API_SERVER_PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
})
