import buildServer from '../../src/buildServer'
import * as travelCompanyModule from '../../src/integrations/travel-company-integrations'
import { TravelCompanyIntegration } from '../../src/integrations/TravelCompanyIntegration'
import { SearchOneWayParams } from '../../src/model/SearchParams'
import { HourInterval } from '../../src/model/base-types'
import { Flight } from '../../src/model/Flight'
import { AirportFactory } from '../test-factories/AirportFactory'

jest.mock('../../src/integrations/travel-company-integrations', () => {
    return {
        travelCompanyIntegrations: new Map()
    }
})
const TEST_COMPANY_ID = 'test-company'

const app = buildServer()

const builtinAirports = [AirportFactory.build('A'), AirportFactory.build('B'), AirportFactory.build('C')]

async function mockTravelCompanyIntegrations(...mockedIntegrations: {
    travelCompanyId: string,
    mockFns: {
        listAirportsMock?: jest.Mocked<TravelCompanyIntegration['listAirports']>,
        searchOneWayFlightsMock?: jest.Mocked<TravelCompanyIntegration['searchOneWayFlights']>
    }
}[]) {
    const mockedMap = travelCompanyModule.travelCompanyIntegrations
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
                travelCompany: TEST_COMPANY_ID
            })
        await mockTravelCompanyIntegrations({
            travelCompanyId: TEST_COMPANY_ID,
            mockFns: {
                searchOneWayFlightsMock: searchOneWayFlightsFn
            }
        })
        const urlParams = new URLSearchParams({
            originCodes: builtinAirports[0].code,
            destinationCodes: builtinAirports[1].code,
            passengersAge: '20',
            departureDates: '2024-10-25',
            departureTimeStart: '0',
            departureTimeEnd: '24',
            maxFlightHours: '2',
            travelCompanies: TEST_COMPANY_ID
        })

        const response = await app.inject({
            method: 'GET',
            url: '/flights/search/oneway?' + urlParams.toString()
        })

        expect(response.statusCode).toBe(200)
        const flights: Flight[] = JSON.parse(response.body)
        expect(flights).toHaveLength(1)
        expect(flights[0].flightNumber).toEqual('FN0001')
        expect(searchOneWayFlightsFn).toHaveBeenCalledWith(expect.objectContaining({
            originCodes: [builtinAirports[0].code],
            destinationCodes: [builtinAirports[1].code],
            departureTimeInterval: new HourInterval(0, 24),
            maxFlightHours: 2,
            passengersAge: [20],
            departureDates: [new Date('2024-10-25')],
            travelCompanies: [TEST_COMPANY_ID]
        } as SearchOneWayParams))
    })

    test('when searchOneWayFlights with multiple dates and origin airports, then return flights', async () => {
        const searchOneWayFlightsFn =
            jest.fn().mockResolvedValue({
                flightNumber: 'FN0001',
                origin: builtinAirports[0],
                destination: builtinAirports[1],
                departureDate: new Date('2024-10-24T09:00:00.000Z'),
                arrivalDate: new Date('2024-10-24T11:00:00.000Z'),
                price: 100,
                travelCompany: TEST_COMPANY_ID
            })
        await mockTravelCompanyIntegrations({
            travelCompanyId: TEST_COMPANY_ID,
            mockFns: {
                searchOneWayFlightsMock: searchOneWayFlightsFn
            }
        })
        const urlParams = new URLSearchParams({
            originCodes: builtinAirports[0].code,
            destinationCodes: builtinAirports[1].code,
            passengersAge: '20',
            departureDates: '2024-10-24',
            departureTimeStart: '0',
            departureTimeEnd: '24',
            maxFlightHours: '2',
            travelCompanies: TEST_COMPANY_ID
        })
        urlParams.append('passengersAge', '31')
        urlParams.append('destinationCodes', builtinAirports[2].code)
        urlParams.append('departureDates', '2024-10-29')

        const response = await app.inject({
            method: 'GET',
            url: '/flights/search/oneway?' + urlParams.toString()
        })

        expect(response.statusCode).toBe(200)
        const flights: Flight[] = JSON.parse(response.body)
        expect(flights).toHaveLength(1)
        expect(flights[0].flightNumber).toEqual('FN0001')
        expect(searchOneWayFlightsFn).toHaveBeenCalledWith(expect.objectContaining({
            originCodes: [builtinAirports[0].code],
            destinationCodes: [builtinAirports[1].code, builtinAirports[2].code],
            departureTimeInterval: new HourInterval(0, 24),
            maxFlightHours: 2,
            passengersAge: [20, 31],
            departureDates: [new Date('2024-10-24'), new Date('2024-10-29')],
            travelCompanies: [TEST_COMPANY_ID]
        } as SearchOneWayParams))
    })

    test('searchOneWayFlights with missing param returns a validation error', async () => {
        const searchOneWayFlightsFn = jest.fn()
        await mockTravelCompanyIntegrations({
            travelCompanyId: TEST_COMPANY_ID,
            mockFns: {
                searchOneWayFlightsMock: searchOneWayFlightsFn
            }
        })
        const urlParams = new URLSearchParams({
            // Missing value: originCodes: builtinAirports[0].code,
            destinationCodes: 'TPS',
            passengersAge: '20',
            departureDates: '2024-10-25',
            departureTimeStart: '0',
            departureTimeEnd: '24',
            maxFlightHours: '2',
            travelCompanies: TEST_COMPANY_ID
        })

        const response = await app.inject({
            method: 'GET',
            url: '/flights/search/oneway?' + urlParams.toString()
        })

        expect(response.statusCode).toBe(400)
        expect(response.json().message).toBe("querystring must have required property 'originCodes'")
        expect(searchOneWayFlightsFn).toHaveBeenCalledTimes(0)
    })

    test('searchOneWayFlights with invalid param returns a validation error', async () => {
        const searchOneWayFlightsFn = jest.fn()
        await mockTravelCompanyIntegrations({
            travelCompanyId: TEST_COMPANY_ID,
            mockFns: {
                searchOneWayFlightsMock: searchOneWayFlightsFn
            }
        })
        const urlParams = new URLSearchParams({
            originCodes: builtinAirports[0].code,
            destinationCodes: 'TPS',
            passengersAge: 'shouldBeANumber', // validation error
            departureDates: '2024-10-25',
            departureTimeStart: '0',
            departureTimeEnd: '24',
            maxFlightHours: '2',
            travelCompanies: TEST_COMPANY_ID
        })

        const response = await app.inject({
            method: 'GET',
            url: '/flights/search/oneway?' + urlParams.toString()
        })

        expect(response.statusCode).toBe(400)
        expect(response.json().message).toBe("querystring/passengersAge/0 must be number")
        expect(searchOneWayFlightsFn).toHaveBeenCalledTimes(0)
    })
})