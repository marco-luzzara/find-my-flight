import { FastifyInstance, FastifyServerOptions } from "fastify";
import { Flight } from "../model/Flight.js";
import { FromSchema } from "json-schema-to-ts";
import { HourInterval } from "../model/base-types.js";
import { searchOneWayFlights } from "../implementation/search-flight.js";

async function routes(fastify: FastifyInstance, options: FastifyServerOptions) {
    const searchOneWayQuerystringSchema = {
        $id: 'SearchOneWayQuerystring',
        type: 'object',
        required: [
            'originCodes', 'destinationCodes',
            'passengersAge', 'departureDates',
            'departureTimeStart', 'departureTimeEnd',
            'maxFlightHours', 'travelCompanies'
        ],
        properties: {
            originCodes: {
                type: 'array',
                items: { type: 'string' }
            },
            destinationCodes: {
                type: 'array',
                items: { type: 'string' }
            },
            passengersAge: {
                type: 'array',
                items: { type: 'number' }
            },
            departureDates: {
                type: 'array',
                items: { type: 'string', format: 'date' }
            },
            departureTimeStart: {
                type: 'number',
                minimum: 0,
                maximum: 23
            },
            departureTimeEnd: {
                type: 'number',
                minimum: 1,
                maximum: 24
            },
            maxFlightHours: {
                type: 'number',
                minimum: 1,
                maximum: Number.MAX_SAFE_INTEGER
            },
            travelCompanies:
            {
                type: 'array',
                items: {
                    type: 'string'
                    // TODO: enum or strings?
                    // enum: ['ryanair']
                }
            }
        }
    } as const;

    fastify.get<{
        Querystring: FromSchema<typeof searchOneWayQuerystringSchema>,
        Reply: Flight[]
    }>('/flights/search/oneway', {
        schema: {
            querystring: searchOneWayQuerystringSchema
        }
    }, async (request, reply) => {
        const travelCompanyIntegrations = fastify.travelCompanyIntegrations

        const queryParams = request.query
        const searchOneWayParams = {
            originCodes: queryParams.originCodes,
            destinationCodes: queryParams.destinationCodes,
            departureDates: queryParams.departureDates.map(d => new Date(d)),
            departureTimeInterval: new HourInterval(queryParams.departureTimeStart, queryParams.departureTimeEnd),
            maxFlightHours: queryParams.maxFlightHours,
            passengersAge: queryParams.passengersAge,
            travelCompanies: queryParams.travelCompanies
        }

        return await searchOneWayFlights(travelCompanyIntegrations, searchOneWayParams)
    })
}

export default routes;


// export async function searchRoundTripFlight(
//     params: SearchRoundTripParams,
//     sort: ResultsSort
// ): Promise<{
//     fromOrigin: Flight[],
//     fromDestination: Flight[]
// }> {


// }