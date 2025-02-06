import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import cors from '@fastify/cors'
import searchFlightRoutes from './apis/search-flight.js'
import airportsRoute from './apis/airports.js'
// import fp from 'fastify-plugin'
import { TravelCompanyIntegration } from './integrations/TravelCompanyIntegration.js'

export default function buildServer(opts: FastifyServerOptions = {}, travelCompanyIntegrations: TravelCompanyIntegration[]): FastifyInstance {
    const server = fastify(opts)
    server.decorate("travelCompanyIntegrations", travelCompanyIntegrations)
    // server.register(fp(importIntegrations))
    server.register(searchFlightRoutes)
    server.register(airportsRoute)
    // https://github.com/fastify/fastify-cors?tab=readme-ov-file#configuring-cors-asynchronously
    server.register(cors, (instance) => {
        return (req, callback) => {
            const corsOptions = {
                origin: '*'
            }

            callback(null, corsOptions)
        }
    })

    return server
}