import { faresApi, Airport as RyanairAirport, PassengerType, airportsApi } from "@findmyflight/external-api-ryanair"
import { RyanairIntegration, RyanairTypeMapping } from "../../src/integrations/ryanair"
import { Airport } from "../../src/model/Airport"
import { HourInterval } from "../../src/model/base-types"
import { TravelCompany } from "../../src/model/TravelCompany"
import { AirportFactory } from "../test-factories/AirportFactory"


const departureDate = new Date('2024-08-10T00:00:00.000')
const originAirports = [
    // A -> [C, D]
    AirportFactory.build('A'),
    // B -> []
    AirportFactory.build('B')
]

const destinationAirports = [
    AirportFactory.build('C'),
    AirportFactory.build('D')
]

jest.mock('@findmyflight/external-api-ryanair', () => {
    const originalModule = jest.requireActual<typeof import('@findmyflight/external-api-ryanair')>('@findmyflight/external-api-ryanair');

    return {
        ...originalModule,
        airportsApi: {
            listAirports: jest.fn(),
            listDestinationAirports: jest.fn()
        },
        miscellaneousApi: {
            createSession: jest.fn().mockResolvedValue([])
        },
        faresApi: {
            listAvailableOneWayFlights: jest.fn()
        },

    }
})

const mockedAirportsApi = airportsApi as jest.Mocked<typeof airportsApi>
mockedAirportsApi.listAirports.mockResolvedValue(originAirports.concat(destinationAirports))
// the first airport is connected with both C and D, the second is connected to none
mockedAirportsApi.listDestinationAirports.mockImplementation((originAirport: RyanairAirport) =>
    Promise.resolve(originAirport.code === originAirports[0].code ? destinationAirports : [])
)

const mockedFaresApi = faresApi as jest.Mocked<typeof faresApi>


beforeEach(() => {
    mockedFaresApi.listAvailableOneWayFlights.mockClear()
});


describe('searchOneWayFlights', () => {
    test('given an origin and destination airport, when no route from origin to destination, searchOneWayFlights returns 0 flights', async () => {
        const searchParams = {
            departureDates: [departureDate],
            originCodes: [RyanairTypeMapping.toAirport(originAirports[1]).code],
            destinationCodes: [
                RyanairTypeMapping.toAirport(destinationAirports[0]).code,
                RyanairTypeMapping.toAirport(destinationAirports[1]).code
            ],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 20],
            travelCompanies: [TravelCompany.Ryanair],
            maxFlightDuration: 1000
        }

        const integration = await RyanairIntegration.create()
        const searchResults = await integration.searchOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(0)
    })

    test('given an origin and destination airport, when there is 1 route, searchOneWayFlights returns 1 flights', async () => {
        mockedFaresApi.listAvailableOneWayFlights.mockResolvedValue(new Map([
            ['2024-08-10T00:00:00.000', [
                {
                    flightNumber: '1111',
                    origin: originAirports[0],
                    destination: destinationAirports[0],
                    departureDate: departureDate,
                    arrivalDate: new Date('2024-08-10T01:00:00.000'),
                    seatLeft: 4,
                    priceDetails: {
                        [PassengerType.ADULT]: 40,
                        [PassengerType.CHILD]: 10
                    },
                    duration: 60
                }
            ]]]))
        const searchParams = {
            departureDates: [departureDate],
            originCodes: [RyanairTypeMapping.toAirport(originAirports[0]).code],
            destinationCodes: [RyanairTypeMapping.toAirport(destinationAirports[0]).code],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 10, 20],
            travelCompanies: [TravelCompany.Ryanair],
            maxFlightDuration: 1000
        }

        const integration = await RyanairIntegration.create()
        const searchResults = await integration.searchOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(1)
        const foundFlight = searchResults.at(0)!
        expect(foundFlight.flightNumber).toEqual('1111')
        expect(foundFlight.price).toEqual(60)
    })

    test('given a route from origin to destination airport, when the departure time is not in hour interval, searchOneWayFlights returns 0 flights', async () => {
        mockedFaresApi.listAvailableOneWayFlights.mockResolvedValue(new Map([
            ['2024-08-10T00:00:00.000', [
                {
                    flightNumber: '1111',
                    origin: originAirports[0],
                    destination: destinationAirports[0],
                    departureDate: departureDate,
                    arrivalDate: new Date('2024-08-10T01:00:00.000'),
                    seatLeft: 4,
                    priceDetails: {
                        [PassengerType.ADULT]: 40,
                        [PassengerType.CHILD]: 10
                    },
                    duration: 60
                }
            ]]]))
        const searchParams = {
            departureDates: [departureDate],
            originCodes: [RyanairTypeMapping.toAirport(originAirports[0]).code],
            destinationCodes: [RyanairTypeMapping.toAirport(destinationAirports[0]).code],
            departureTimeInterval: new HourInterval(16, 23),
            passengersAge: [2, 10, 20],
            travelCompanies: [TravelCompany.Ryanair],
            maxFlightDuration: 1000
        }

        const integration = await RyanairIntegration.create()
        const searchResults = await integration.searchOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(0)
    })

    test('given a route from origin to destination airport, when the flight duration is above max, searchOneWayFlights returns 0 flights', async () => {
        mockedFaresApi.listAvailableOneWayFlights.mockResolvedValue(new Map([
            ['2024-08-10T00:00:00.000', [
                {
                    flightNumber: '1111',
                    origin: originAirports[0],
                    destination: destinationAirports[0],
                    departureDate: departureDate,
                    arrivalDate: new Date('2024-08-10T03:00:00.000'),
                    seatLeft: 4,
                    priceDetails: {
                        [PassengerType.ADULT]: 40,
                        [PassengerType.CHILD]: 10
                    },
                    duration: 180
                }
            ]]]))
        const searchParams = {
            departureDates: [departureDate],
            originCodes: [RyanairTypeMapping.toAirport(originAirports[0]).code],
            destinationCodes: [RyanairTypeMapping.toAirport(destinationAirports[0]).code],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 10, 20],
            travelCompanies: [TravelCompany.Ryanair],
            maxFlightDuration: 120
        }

        const integration = await RyanairIntegration.create()

        const searchResults = await integration.searchOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(0)
    })
})

describe('listAirports', () => {
    test('given Ryanair airports, return simple Airport', async () => {
        const integration = await RyanairIntegration.create()

        const airports = await integration.listAirports()

        expect(airports).toHaveLength(4)
        expect(airports[0]).toEqual(RyanairTypeMapping.toAirport(originAirports[0]))
    })
})