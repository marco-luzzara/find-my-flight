import buildServer from '../../src/buildServer'
import { TravelCompany } from '../../src/model/TravelCompany'
import * as travelCompanyModule from '../../src/integrations/travel-company-integrations'
import { TravelCompanyIntegration } from '../../src/integrations/travel-company-integrations'
import { SearchOneWayParams } from '../../src/model/SearchParams'
import { HourInterval } from '../../src/model/base-types'
import { Flight } from '../../src/model/Flight'
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

describe('searchOneWayFlights', () => {
    test('searchOneWayFlights with valid params returns the flights', async () => {
        const searchOneWayFlightsFn =
            jest.fn().mockResolvedValue({
                flightNumber: 'FN0001',
                origin: builtinAirports[0],
                destination: builtinAirports[1],
                departureDate: new Date('2024-10-24T09:00:00.000Z'),
                arrivalDate: new Date('2024-10-24T11:00:00.000Z'),
                price: 100,
                travelCompany: TravelCompany.Ryanair
            })
        mockTravelCompanyIntegrations({
            travelCompany: TravelCompany.Ryanair, mockFns: {
                searchOneWayFlightsMock: searchOneWayFlightsFn
            }
        })
        const urlParams = new URLSearchParams({
            originCodes: builtinAirports[0].code,
            destinationCodes: 'TPS',
            passengersAge: '20',
            departureDates: '2024-10-25',
            departureTimeStart: '0',
            departureTimeEnd: '24',
            maxFlightDuration: '100',
            travelCompanies: 'Ryanair'
        })

        const response = await app.inject({
            method: 'GET',
            url: '/flights/search/oneway?' + urlParams.toString()
        })

        const flights: Flight[] = JSON.parse(response.body)
        expect(flights).toHaveLength(1)
        //expect(flights[0].flightNumber).toEqual()
        expect(searchOneWayFlightsFn).toHaveBeenCalledWith(expect.objectContaining({
            originCodes: [builtinAirports[0].code],
            destinationCodes: ['TPS'],
            departureTimeInterval: new HourInterval(0, 24),
            maxFlightDuration: 100,
            passengersAge: [20],
            departureDates: [new Date('2024-10-25')],
            travelCompanies: [TravelCompany.Ryanair]
        } as SearchOneWayParams))
    })
})