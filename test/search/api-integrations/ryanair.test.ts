import * as airportsApi from "../../../src/ryanair-api/apis/airports"
import * as faresApi from "../../../src/ryanair-api/apis/fares"
import { Airport as RyanairAirport } from "../../../src/ryanair-api/model/Airport"
import { RyanairIntegration } from "../../../src/search/api-integrations/ryanair"
import { Airport } from "../../../src/search/model/Airport"
import { HourInterval } from "../../../src/search/model/base-types"
import { TravelCompany } from "../../../src/search/model/TravelCompany"
import { AirportFactory } from "../../ryanair-api/test-factories/AirportFactory"

function mapToSearchAirport(airport: RyanairAirport): Airport {
    return {
        code: airport.code,
        name: airport.name
    }
}

const originAirports = [
    AirportFactory.build('A'),
    AirportFactory.build('B')
]

const destinationAirports = [
    AirportFactory.build('C'),
    AirportFactory.build('D')
]

jest.mock('../../../src/ryanair-api/apis/miscellaneous', () => {
    return {
        createSession: jest.fn().mockResolvedValue([])
    }
})
jest.mock('../../../src/ryanair-api/apis/airports')
jest.mock('../../../src/ryanair-api/apis/fares')

const mockedAirportsApi = airportsApi as jest.Mocked<typeof airportsApi>
mockedAirportsApi.listAirports.mockResolvedValue(originAirports.concat(destinationAirports))
mockedAirportsApi.listDestinationAirports.mockImplementation((originAirport: RyanairAirport) =>
    Promise.resolve(originAirport.code === originAirports[0].code ? destinationAirports : [])
)

// const mockedFaresApi = faresApi as jest.Mocked<typeof faresApi>
// mockedFaresApi.listAvailableFlights.mockImplementation()

beforeEach(() => {
    //mockListAvailableFlights.mockClear()
});


describe('getOneWayFlights', () => {
    test('given an origin and destination airport, when no route from origin to destination, getOneWayFlights returns 0 flights', async () => {
        const departureDate = new Date('2024-08-10')

        const integration = await RyanairIntegration.create()

        const searchResults = await integration.getOneWayFlights({
            departureDates: [departureDate],
            origins: [mapToSearchAirport(originAirports[1])],
            destinations: [mapToSearchAirport(destinationAirports[0]), mapToSearchAirport(destinationAirports[1])],
            departureTimeInterval: new HourInterval(0, 23),
            passengersAge: [2, 20],
            travelCompanies: [TravelCompany.Ryanair],
            maxFlightDuration: 10
        })

        expect(searchResults).toHaveLength(0)
    })
})