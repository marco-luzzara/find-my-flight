import dotenv from "dotenv"
dotenv.config()

import buildServer from './buildServer'

const server = buildServer({
    logger: {
        level: 'info'
    }
})

const API_SERVER_PORT = parseInt(process.env.API_SERVER_PORT) ?? 9678

server.listen({ port: API_SERVER_PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
})