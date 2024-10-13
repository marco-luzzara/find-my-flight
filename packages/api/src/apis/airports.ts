import { FastifyInstance, FastifyServerOptions } from "fastify";
import { listAirports } from "../implementation/airports";

export default async function routes(fastify: FastifyInstance, options: FastifyServerOptions) {
    fastify.get('/airports', async (request, reply) => {
        return await listAirports()
    })
}