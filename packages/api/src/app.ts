import dotenv from "dotenv"
dotenv.config()

import buildServer from './buildServer'
import { TravelCompanyIntegration } from "./integrations/TravelCompanyIntegration"
import RyanairIntegration from "./integrations/travel-companies/ryanair"
const API_SERVER_PORT = parseInt(process.env.API_SERVER_PORT) ?? 9678

const getTravelCompanyIntegrations = (async function getTravelCompanyIntegrations(): Promise<TravelCompanyIntegration[]> {
    const ryanairIntegration = await (new RyanairIntegration()).initialize()
    return [ryanairIntegration]
})()

getTravelCompanyIntegrations.then(integrations => {
    const server = buildServer({
        logger: {
            level: 'info'
        }
    }, integrations)

    server.listen({ port: API_SERVER_PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) throw err
        console.log(`Server is now listening on ${address}`)
    })
})