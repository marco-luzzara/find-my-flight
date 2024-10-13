import buildServer from '../../src/buildServer'
import { TravelCompany } from '../../src/model/TravelCompany'
import * as travelCompanyModule from '../../src/integrations/travel-company-integrations'
import { AirportFactory } from '../test-factories/AirportFactory'

jest.mock('../../src/integrations/travel-company-integrations', () => {
    return {
        travelCompanyIntegrations: new Map()
    }
})

let mockedTravelCompanyModule = travelCompanyModule as jest.Mocked<typeof travelCompanyModule>
mockedTravelCompanyModule.travelCompanyIntegrations.set(TravelCompany.Ryanair, Promise.resolve({
    listAirports: jest.fn().mockResolvedValue([AirportFactory.build('A'), AirportFactory.build('B')]),
    getOneWayFlights: jest.fn(),
}))

const app = buildServer()

describe('listAirports', () => {
    // TODO: when there are multiple companies
    // test('listAirports returns the merge of two travel companies results', async () => {

    // })

    test('listAirports returns the travel company results', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/airports'
        })

        const airportsList = JSON.parse(response.body)
        expect(airportsList).toHaveLength(2)
    })
})