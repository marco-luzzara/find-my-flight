import { FastifyInstance, FastifyServerOptions } from "fastify";
import { listAirports } from "../implementation/airports.js";
import { Airport } from "../model/Airport.js";

/* eslint-disable-next-line @typescript-eslint/require-await */
export default async function routes(
    fastify: FastifyInstance,
    _options: FastifyServerOptions
) {
    fastify.get<{
        Reply: Airport[]
    }>('/airports', async (request, reply) => {
        const travelCompanyIntegrations = fastify.travelCompanyIntegrations
        reply.code(200)
        return await listAirports(travelCompanyIntegrations)
    })
}