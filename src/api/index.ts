import Fastify from 'fastify'
const fastify = Fastify({
    logger: true
})
import searchFlightRoutes from './apis/search-flight'

import dotenv from "dotenv"
dotenv.config()

fastify.register(searchFlightRoutes)

fastify.listen({ port: parseInt(process.env.SERVER_PORT) }, (err, address) => {
    if (err) throw err
    // Server is now listening on ${address}
})