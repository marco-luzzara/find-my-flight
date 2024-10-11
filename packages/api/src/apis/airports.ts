async function routes(fastify, options) {
    fastify.get('/flights/oneway', async (request, reply) => {
        return { hello: 'world' }
    })
}

export default routes;