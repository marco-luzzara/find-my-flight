import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import cors from '@fastify/cors'
import searchFlightRoutes from './apis/search-flight'
import airportsRoute from './apis/airports'

export default function buildServer(opts: FastifyServerOptions = {}): FastifyInstance {
    const server = fastify(opts)
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