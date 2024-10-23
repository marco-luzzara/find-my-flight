import { FastifyInstance, FastifyServerOptions } from "fastify";
import { listAirports } from "../implementation/airports";
import { Airport } from "../model/Airport";

export default async function routes(fastify: FastifyInstance, options: FastifyServerOptions) {
    fastify.get<{
        Reply: Airport[]
    }>('/airports', async (request, reply) => {
        reply.code(200)
        return await listAirports()
    })
}