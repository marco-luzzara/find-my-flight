import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import searchFlightRoutes from './apis/search-flight'
import airportsRoute from './apis/airports'

export default function buildServer(opts: FastifyServerOptions = {}): FastifyInstance {
    const server = fastify(opts)
    server.register(searchFlightRoutes)
    server.register(airportsRoute)

    return server
}