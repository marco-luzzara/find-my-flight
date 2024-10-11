import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import searchFlightRoutes from './apis/search-flight'

export default function buildServer(opts: FastifyServerOptions): FastifyInstance {
    const server = fastify(opts)
    server.register(searchFlightRoutes)

    return server
}