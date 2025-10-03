import { FastifyInstance, FastifyServerOptions } from "fastify";
import { listAirports } from "../implementation/airports.js";
import { Airport } from "../model/Airport.js";

export default function routes(fastify: FastifyInstance, _options: FastifyServerOptions) {
    fastify.get<{
        Reply: Airport[]
    }>('/airports', async (request, reply) => {
        const travelCompanyIntegrations = fastify.travelCompanyIntegrations
        reply.code(200)
        return await listAirports(travelCompanyIntegrations)
    })
}