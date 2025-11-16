import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import cors from '@fastify/cors'
import fastifyPlugin from 'fastify-plugin'
import searchFlightRoutes from './apis/search-flight.js'
import airportsRoute from './apis/airports.js'
import { TravelCompanyIntegration } from './integrations/TravelCompanyIntegration.js'


export default async function buildServer(
    opts: FastifyServerOptions = {},
    travelCompanyIntegrations: TravelCompanyIntegration[]
) {
    const server = fastify(opts)

    await server.register(fastifyPlugin(
        /* eslint-disable-next-line @typescript-eslint/require-await */
        async function (
            fastify: FastifyInstance,
            _opts: FastifyServerOptions
        ) {
            fastify.decorate("travelCompanyIntegrations", travelCompanyIntegrations)
        }
    ))
    await server.register(cors, {
        origin: '*',
        methods: ['GET']
    })

    // server.register(fp(importIntegrations))
    await server.register(searchFlightRoutes)
    await server.register(airportsRoute)

    return server
}
