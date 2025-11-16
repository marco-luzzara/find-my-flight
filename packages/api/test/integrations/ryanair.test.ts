import { apis } from "@findmyflight/external-api-ryanair"
import RyanairIntegration, { RyanairTypeMapping } from "../../src/integrations/travel-companies/ryanair.js"
import { HourInterval } from "../../src/model/base-types.js"
import { RyanairAirportFactory } from "../test-factories/ryanair/RyanairAirportFactory.js"

const departureDate = new Date('2024-08-10T00:00:00.000')
const originAirports = [
    // A -> [C, D]
    RyanairAirportFactory.build('A'),
    // B -> []
    RyanairAirportFactory.build('B')
]

const destinationAirports = [
    RyanairAirportFactory.build('C'),
    RyanairAirportFactory.build('D')
]

const mockedApis = {
    airports: {
        listAirports: jest.fn().mockResolvedValue(
            originAirports.concat(destinationAirports)
        ),
        listDestinationAirports: jest.fn().mockImplementation(
            (originAirportCode: string) => Promise.resolve(
                originAirportCode === originAirports[0].code ? destinationAirports : []
            )
        )
    } as jest.Mocked<typeof apis.airports>,
    miscellaneous: {
        createSession: jest.fn().mockResolvedValue([])
    } as jest.Mocked<typeof apis.miscellaneous>,
    fares: {
        listOneWayFlights: jest.fn(),
        listDatesForFare: jest.fn(),
        listRoundTripFlights: jest.fn()
    } as jest.Mocked<typeof apis.fares>
}

async function buildIntegration(): Promise<RyanairIntegration> {
    const integration = new RyanairIntegration()
    return await integration.initialize(mockedApis)
}


beforeEach(() => {
    mockedApis.fares.listOneWayFlights.mockClear()
});


describe('searchOneWayFlights', () => {
    test('given an origin and destination airport, when no route from origin to destination, searchOneWayFlights returns 0 flights', async () => {
        const integration = await buildIntegration()
        const searchParams = {
            departureDates: [departureDate],
            originCodes: [RyanairTypeMapping.toAirport(originAirports[1]).code],
            destinationCodes: [
                RyanairTypeMapping.toAirport(destinationAirports[0]).code,
                RyanairTypeMapping.toAirport(destinationAirports[1]).code
            ],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 20],
            travelCompanies: [integration.id],
            maxFlightHours: 10
        }

        const searchResults = await integration.searchOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(0)
    })

    test('given an origin and destination airport, when there is 1 route, searchOneWayFlights returns 1 flights', async () => {
        mockedApis.fares.listOneWayFlights.mockResolvedValue(new Map([
            ['2024-08-10T00:00:00.000', [
                {
                    flightNumber: '1111',
                    originCode: originAirports[0].code,
                    destinationCode: destinationAirports[0].code,
                    departureDate: departureDate,
                    arrivalDate: new Date('2024-08-10T01:00:00.000'),
                    seatLeft: 4,
                    priceDetails: {
                        adult: 40,
                        child: 10
                    },
                    duration: 60
                }
            ]]])
        )
        const integration = await buildIntegration()
        const searchParams = {
            departureDates: [departureDate],
            originCodes: [RyanairTypeMapping.toAirport(originAirports[0]).code],
            destinationCodes: [RyanairTypeMapping.toAirport(destinationAirports[0]).code],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 10, 20],
            travelCompanies: [integration.id],
            maxFlightHours: 10
        }

        const searchResults = await integration.searchOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(1)
        const foundFlight = searchResults.at(0)!
        expect(foundFlight.flightNumber).toEqual('1111')
        expect(foundFlight.price).toEqual(60)
    })

    test('given a route from origin to destination airport, when the departure time is not in hour interval, searchOneWayFlights returns 0 flights', async () => {
        mockedApis.fares.listOneWayFlights.mockResolvedValue(new Map([
            ['2024-08-10T00:00:00.000', [
                {
                    flightNumber: '1111',
                    originCode: originAirports[0].code,
                    destinationCode: destinationAirports[0].code,
                    departureDate: departureDate,
                    arrivalDate: new Date('2024-08-10T01:00:00.000'),
                    seatLeft: 4,
                    priceDetails: {
                        adult: 40,
                        child: 10
                    },
                    duration: 60
                }
            ]]])
        )
        const integration = await buildIntegration()
        const searchParams = {
            departureDates: [departureDate],
            originCodes: [RyanairTypeMapping.toAirport(originAirports[0]).code],
            destinationCodes: [RyanairTypeMapping.toAirport(destinationAirports[0]).code],
            departureTimeInterval: new HourInterval(16, 23),
            passengersAge: [2, 10, 20],
            travelCompanies: [integration.id],
            maxFlightHours: 10
        }

        const searchResults = await integration.searchOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(0)
    })

    test('given a route from origin to destination airport, when the flight duration is above max, searchOneWayFlights returns 0 flights', async () => {
        mockedApis.fares.listOneWayFlights.mockResolvedValue(new Map([
            ['2024-08-10T00:00:00.000', [
                {
                    flightNumber: '1111',
                    originCode: originAirports[0].code,
                    destinationCode: destinationAirports[0].code,
                    departureDate: departureDate,
                    arrivalDate: new Date('2024-08-10T03:00:00.000'),
                    seatLeft: 4,
                    priceDetails: {
                        adult: 40,
                        child: 10
                    },
                    duration: 180
                }
            ]]])
        )
        const integration = await buildIntegration()
        const searchParams = {
            departureDates: [departureDate],
            originCodes: [RyanairTypeMapping.toAirport(originAirports[0]).code],
            destinationCodes: [RyanairTypeMapping.toAirport(destinationAirports[0]).code],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 10, 20],
            travelCompanies: [integration.id],
            maxFlightHours: 2
        }

        const searchResults = await integration.searchOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(0)
    })
})

describe('listAirports', () => {
    test('given Ryanair airports, return simple Airport', async () => {
        const integration = await buildIntegration()

        const airports = await integration.listAirports()

        expect(airports).toHaveLength(4)
        expect(airports[0]).toEqual(RyanairTypeMapping.toAirport(originAirports[0]))
    })
})