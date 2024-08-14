async function routes(fastify, options) {
    fastify.get('/flights/oneway', async (request, reply) => {
        return { hello: 'world' }
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