import buildServer from '../../src/buildServer'
import { TravelCompany } from '../../src/model/TravelCompany'
import * as travelCompanyModule from '../../src/integrations/travel-company-integrations'
import { TravelCompanyIntegration } from '../../src/integrations/travel-company-integrations'
import { AirportFactory } from '../test-factories/AirportFactory'

jest.mock('../../src/integrations/travel-company-integrations', () => {
    return {
        travelCompanyIntegrations: new Map()
    }
})

let mockedTravelCompanyModule = travelCompanyModule as jest.Mocked<typeof travelCompanyModule>

const app = buildServer()

const builtinAirports = [AirportFactory.build('A'), AirportFactory.build('B')]

function mockTravelCompanyIntegrations(...mockedIntegrations: {
    travelCompany: TravelCompany,
    mockFns: {
        listAirportsMock?: jest.Mocked<TravelCompanyIntegration['listAirports']>,
        searchOneWayFlightsMock?: jest.Mocked<TravelCompanyIntegration['searchOneWayFlights']>
    }
}[]) {
    for (let integration of mockedIntegrations) {
        mockedTravelCompanyModule.travelCompanyIntegrations.set(integration.travelCompany, Promise.resolve({
            listAirports: integration.mockFns.listAirportsMock ?? jest.fn(),
            searchOneWayFlights: integration.mockFns.searchOneWayFlightsMock ?? jest.fn()
        }))
    }
}

beforeEach(() => {
    mockedTravelCompanyModule.travelCompanyIntegrations.clear()
    mockTravelCompanyIntegrations({
        travelCompany: TravelCompany.Ryanair, mockFns: {}
    })
})

describe('listAirports', () => {
    // TODO: when there are multiple companies
    // test('listAirports returns the merge of two travel companies results', async () => {

    // })

    test('listAirports returns the travel company results', async () => {
        mockTravelCompanyIntegrations({
            travelCompany: TravelCompany.Ryanair, mockFns: {
                listAirportsMock: jest.fn().mockResolvedValue(builtinAirports)
            }
        })

        const response = await app.inject({
            method: 'GET',
            url: '/airports'
        })

        const airportsList = JSON.parse(response.body)
        expect(airportsList).toHaveLength(2)
    })

    test('listAirports returns 0 airport if the external api fails', async () => {
        mockTravelCompanyIntegrations({
            travelCompany: TravelCompany.Ryanair, mockFns: {
                listAirportsMock: jest.fn().mockRejectedValue(new Error('api fails'))
            }
        })

        const response = await app.inject({
            method: 'GET',
            url: '/airports'
        })

        const airportsList = JSON.parse(response.body)
        expect(airportsList).toHaveLength(0)
    })
})