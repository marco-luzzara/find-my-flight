import { jest, test, expect, describe } from '@jest/globals';
import { FastifyInstance } from 'fastify'
import buildServer from '../../src/buildServer.js'
import { TravelCompanyIntegration } from '../../src/integrations/TravelCompanyIntegration.js'
import { AirportFactory } from '../test-factories/AirportFactory.js'
import { Airport } from '../../src/model/Airport.js'
import { TCIntegrationFactory } from '../test-factories/TCIntegrationFactory.js';

const builtinAirports = [AirportFactory.build('A'), AirportFactory.build('B')]

async function buildMockedServer(...mockedIntegrations: {
    listAirportsMock?: jest.Mocked<TravelCompanyIntegration['listAirports']>
}[]): Promise<FastifyInstance> {
    const app = await buildServer({}, mockedIntegrations.map((integration, i) =>
        TCIntegrationFactory.buildMock(i, {
            listAirports: integration.listAirportsMock
        }))
    )

    return app
}

describe('listAirports', () => {
    // TODO: when there are multiple companies
    // test('listAirports returns the merge of two travel companies results', async () => {

    // })

    test('listAirports returns the travel company results', async () => {
        const app = await buildMockedServer({
            listAirportsMock: jest.fn<TravelCompanyIntegration['listAirports']>()
                .mockResolvedValue(builtinAirports)
        })

        const response = await app.inject({
            method: 'GET',
            url: '/airports'
        })

        const airportsList = JSON.parse(response.body) as Airport[]
        expect(airportsList).toHaveLength(2)
    })

    test('listAirports returns 0 airport if the external api fails', async () => {
        const app = await buildMockedServer({
            listAirportsMock: jest.fn<TravelCompanyIntegration['listAirports']>()
                .mockRejectedValue(new Error('api fails'))
        })

        const response = await app.inject({
            method: 'GET',
            url: '/airports'
        })

        const airportsList = JSON.parse(response.body) as Airport[]
        expect(airportsList).toHaveLength(0)
    })
})
