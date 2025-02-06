import { FastifyInstance } from 'fastify'
import buildServer from '../../src/buildServer.js'
import { TravelCompanyIntegration } from '../../src/integrations/TravelCompanyIntegration.js'
import { AirportFactory } from '../test-factories/AirportFactory.js'

const TEST_COMPANY_ID = 'test-company'

const builtinAirports = [AirportFactory.build('A'), AirportFactory.build('B')]

function buildMockedServer(...mockedIntegrations: {
    listAirportsMock?: jest.Mocked<TravelCompanyIntegration['listAirports']>
}[]): FastifyInstance {
    const app = buildServer({}, mockedIntegrations.map(integration => ({
        id: TEST_COMPANY_ID,
        listAirports: integration.listAirportsMock ?? jest.fn()
    } as TravelCompanyIntegration)))

    return app
}

describe('listAirports', () => {
    // TODO: when there are multiple companies
    // test('listAirports returns the merge of two travel companies results', async () => {

    // })

    test('listAirports returns the travel company results', async () => {
        const app = buildMockedServer({
            listAirportsMock: jest.fn().mockResolvedValue(builtinAirports)
        })

        const response = await app.inject({
            method: 'GET',
            url: '/airports'
        })

        const airportsList = JSON.parse(response.body)
        expect(airportsList).toHaveLength(2)
    })

    test('listAirports returns 0 airport if the external api fails', async () => {
        const app = buildMockedServer({
            listAirportsMock: jest.fn().mockRejectedValue(new Error('api fails'))
        })

        const response = await app.inject({
            method: 'GET',
            url: '/airports'
        })

        const airportsList = JSON.parse(response.body)
        expect(airportsList).toHaveLength(0)
    })
})