import { jest } from '@jest/globals';
import buildServer from '../../src/buildServer.js'
import { TravelCompanyIntegration } from '../../src/integrations/TravelCompanyIntegration.js'
import { SearchOneWayParams } from '../../src/model/SearchParams.js'
import { HourInterval } from '../../src/model/base-types.js'
import { Flight } from '../../src/model/Flight.js'
import { AirportFactory } from '../test-factories/AirportFactory.js'
import { FastifyInstance } from 'fastify'
import { TCIntegrationFactory } from '../test-factories/TCIntegrationFactory.js'

const TEST_COMPANY_ID = '0'

const builtinAirports = [AirportFactory.build('A'), AirportFactory.build('B'), AirportFactory.build('C')]

async function buildMockedServer(...mockedIntegrations: {
    searchOneWayFlightsMock?: jest.Mocked<TravelCompanyIntegration['searchOneWayFlights']>
}[]): Promise<FastifyInstance> {
    const app = await buildServer({}, mockedIntegrations.map((integration, i) =>
        TCIntegrationFactory.buildMock(i, {
            searchOneWayFlights: integration.searchOneWayFlightsMock
        }))
    )

    return app
}

describe('searchOneWayFlights', () => {
    test('searchOneWayFlights with valid params returns the flights', async () => {
        const searchOneWayFlightsFn = jest
            .fn<TravelCompanyIntegration['searchOneWayFlights']>().mockResolvedValue([{
                flightNumber: 'FN0001',
                origin: builtinAirports[0],
                destination: builtinAirports[1],
                departureDate: new Date('2024-10-24T09:00:00.000Z'),
                arrivalDate: new Date('2024-10-24T11:00:00.000Z'),
                price: 100,
                travelCompany: TEST_COMPANY_ID
            }])
        const app = await buildMockedServer({
            searchOneWayFlightsMock: searchOneWayFlightsFn
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
        const flights = JSON.parse(response.body) as Flight[]
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
        const searchOneWayFlightsFn = jest
            .fn<TravelCompanyIntegration['searchOneWayFlights']>().mockResolvedValue([{
                flightNumber: 'FN0001',
                origin: builtinAirports[0],
                destination: builtinAirports[1],
                departureDate: new Date('2024-10-24T09:00:00.000Z'),
                arrivalDate: new Date('2024-10-24T11:00:00.000Z'),
                price: 100,
                travelCompany: TEST_COMPANY_ID
            }])
        const app = await buildMockedServer({
            searchOneWayFlightsMock: searchOneWayFlightsFn
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
        const flights = JSON.parse(response.body) as Flight[]
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
        const searchOneWayFlightsFn = jest
            .fn<TravelCompanyIntegration['searchOneWayFlights']>()
        const app = await buildMockedServer({
            searchOneWayFlightsMock: searchOneWayFlightsFn
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
        const responseContent = response.json<{ message: string }>()

        expect(response.statusCode).toBe(400)
        expect(responseContent.message).toBe("querystring must have required property 'originCodes'")
        expect(searchOneWayFlightsFn).toHaveBeenCalledTimes(0)
    })

    test('searchOneWayFlights with invalid param returns a validation error', async () => {
        const searchOneWayFlightsFn = jest
            .fn<TravelCompanyIntegration['searchOneWayFlights']>()
        const app = await buildMockedServer({
            searchOneWayFlightsMock: searchOneWayFlightsFn
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
        const responseContent = response.json<{ message: string }>()

        expect(response.statusCode).toBe(400)
        expect(responseContent.message).toBe("querystring/passengersAge/0 must be number")
        expect(searchOneWayFlightsFn).toHaveBeenCalledTimes(0)
    })
})