import fastify, { FastifyServerOptions } from 'fastify'
import cors from '@fastify/cors'
import searchFlightRoutes from './apis/search-flight.js'
import airportsRoute from './apis/airports.js'
// import fp from 'fastify-plugin'
import { TravelCompanyIntegration } from './integrations/TravelCompanyIntegration.js'

export default async function buildServer(opts: FastifyServerOptions = {}, travelCompanyIntegrations: TravelCompanyIntegration[]) {
    const server = fastify(opts)

    server.decorate("travelCompanyIntegrations", travelCompanyIntegrations)
    await server.register(cors, {
        origin: '*',
        methods: ['GET']
    })

    // server.register(fp(importIntegrations))
    await server.register(searchFlightRoutes)
    await server.register(airportsRoute)

    return server
}