import buildServer from '../../src/buildServer'
import { TravelCompany } from '../../src/model/TravelCompany'
import * as travelCompanyModule from '../../src/integrations/travel-company-integrations'
import { TravelCompanyIntegration } from '../../src/integrations/TravelCompanyIntegration'
import { AirportFactory } from '../test-factories/AirportFactory'

// Mock the module because loading the actual integrations is not necessary
jest.mock('../../src/integrations/travel-company-integrations', () => {
    return {
        travelCompanyIntegrationsFn: Promise.resolve(new Map())
    }
})
const TEST_COMPANY_ID = 'test-company'

const app = buildServer()

const builtinAirports = [AirportFactory.build('A'), AirportFactory.build('B')]

async function mockTravelCompanyIntegrations(...mockedIntegrations: {
    travelCompanyId: string,
    mockFns: {
        listAirportsMock?: jest.Mocked<TravelCompanyIntegration['listAirports']>,
        searchOneWayFlightsMock?: jest.Mocked<TravelCompanyIntegration['searchOneWayFlights']>
    }
}[]) {
    const mockedMap = await travelCompanyModule.travelCompanyIntegrationsFn
    mockedMap.clear()

    mockedIntegrations.forEach(integration =>
        mockedMap.set(
            integration.travelCompanyId,
            {
                listAirports: integration.mockFns.listAirportsMock ?? jest.fn(),
                searchOneWayFlights: integration.mockFns.searchOneWayFlightsMock ?? jest.fn()
            } as TravelCompanyIntegration
        )
    )
}

beforeEach(() => {
    // mockedTravelCompanyIntegrationsFn.mockReset()
    // mockTravelCompanyIntegrations({
    //     travelCompanyId: 'test-company', mockFns: {}
    // })
})

describe('listAirports', () => {
    // TODO: when there are multiple companies
    // test('listAirports returns the merge of two travel companies results', async () => {

    // })

    test('listAirports returns the travel company results', async () => {
        await mockTravelCompanyIntegrations({
            travelCompanyId: TEST_COMPANY_ID,
            mockFns: {
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
        await mockTravelCompanyIntegrations({
            travelCompanyId: TEST_COMPANY_ID,
            mockFns: {
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