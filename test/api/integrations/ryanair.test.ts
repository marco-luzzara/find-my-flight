import * as airportsApi from "../../../src/external-apis/ryanair-api/apis/airports"
import * as faresApi from "../../../src/external-apis/ryanair-api/apis/fares"
import { Airport as RyanairAirport } from "../../../src/external-apis/ryanair-api/model/Airport"
import { PassengerType } from "../../../src/external-apis/ryanair-api/model/base-types"
import { RyanairIntegration } from "../../../src/api/integrations/ryanair"
import { Airport } from "../../../src/api/model/Airport"
import { HourInterval } from "../../../src/api/model/base-types"
import { TravelCompany } from "../../../src/api/model/TravelCompany"
import { AirportFactory } from "../../external-apis/ryanair-api/test-factories/AirportFactory"

function mapToSearchAirport(airport: RyanairAirport): Airport {
    return {
        code: airport.code,
        name: airport.name
    }
}

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

jest.mock('../../../src/external-apis/ryanair-api/apis/miscellaneous', () => {
    return {
        createSession: jest.fn().mockResolvedValue([])
    }
})
jest.mock('../../../src/external-apis/ryanair-api/apis/airports')
jest.mock('../../../src/external-apis/ryanair-api/apis/fares')

const mockedAirportsApi = airportsApi as jest.Mocked<typeof airportsApi>
mockedAirportsApi.listAirports.mockResolvedValue(originAirports.concat(destinationAirports))
mockedAirportsApi.listDestinationAirports.mockImplementation((originAirport: RyanairAirport) =>
    Promise.resolve(originAirport.code === originAirports[0].code ? destinationAirports : [])
)

const mockedFaresApi = faresApi as jest.Mocked<typeof faresApi>


beforeEach(() => {
    mockedFaresApi.listAvailableOneWayFlights.mockClear()
});


describe('getOneWayFlights', () => {
    test('given an origin and destination airport, when no route from origin to destination, getOneWayFlights returns 0 flights', async () => {
        const searchParams = {
            departureDates: [departureDate],
            origins: [mapToSearchAirport(originAirports[1])],
            destinations: [mapToSearchAirport(destinationAirports[0]), mapToSearchAirport(destinationAirports[1])],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 20],
            travelCompanies: [TravelCompany.Ryanair],
            maxFlightDuration: 1000
        }

        const integration = await RyanairIntegration.create()
        const searchResults = await integration.getOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(0)
    })

    test('given an origin and destination airport, when there is 1 route, getOneWayFlights returns 1 flights', async () => {
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
            origins: [mapToSearchAirport(originAirports[0])],
            destinations: [mapToSearchAirport(destinationAirports[0])],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 10, 20],
            travelCompanies: [TravelCompany.Ryanair],
            maxFlightDuration: 1000
        }

        const integration = await RyanairIntegration.create()
        const searchResults = await integration.getOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(1)
        const foundFlight = searchResults.at(0)
        expect(foundFlight.flightNumber).toEqual('1111')
        expect(foundFlight.price).toEqual(60)
    })

    test('given a route from origin to destination airport, when the departure time is not in hour interval, getOneWayFlights returns 0 flights', async () => {
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
            origins: [mapToSearchAirport(originAirports[0])],
            destinations: [mapToSearchAirport(destinationAirports[0])],
            departureTimeInterval: new HourInterval(16, 23),
            passengersAge: [2, 10, 20],
            travelCompanies: [TravelCompany.Ryanair],
            maxFlightDuration: 1000
        }

        const integration = await RyanairIntegration.create()
        const searchResults = await integration.getOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(0)
    })

    test('given a route from origin to destination airport, when the flight duration is above max, getOneWayFlights returns 0 flights', async () => {
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
            origins: [mapToSearchAirport(originAirports[0])],
            destinations: [mapToSearchAirport(destinationAirports[0])],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 10, 20],
            travelCompanies: [TravelCompany.Ryanair],
            maxFlightDuration: 120
        }

        const integration = await RyanairIntegration.create()

        const searchResults = await integration.getOneWayFlights(searchParams)

        expect(searchResults).toHaveLength(0)
    })
})