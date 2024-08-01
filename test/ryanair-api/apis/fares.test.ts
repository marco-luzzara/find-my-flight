import ApiEndpointBuilder from "../../../src/ryanair-api/ApiEndpointBuilder"
import { listAvailableDatesForFare, listAvailableFlights } from "../../../src/ryanair-api/apis/fares"
import { ApiUnavailable, UninitializedSession } from "../../../src/ryanair-api/errors"
import { Airport } from "../../../src/ryanair-api/model/Airport"
import { Session } from "../../../src/ryanair-api/model/base-types"
import { ListAvailableOneWayFlightsParams, ListAvailableRoundTripFlightsParams } from "../../../src/ryanair-api/model/Fare"
import { AirportFactory } from "../test-factories/AirportFactory"
import { API_SAVED_RESPONSES } from "../test-utils/constants"
import { MockUtils } from "../test-utils/mock"

describe('listAvailableDatesForFare', () => {
    const originAirport: Airport = AirportFactory.buildAirport('AAA')
    const destinationAirport: Airport = AirportFactory.buildAirport('BBB')

    test('listAvailableDatesForFare should return list of Dates', async () => {
        const endpoint = ApiEndpointBuilder.listAvailableDatesForFare(originAirport, destinationAirport)
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/fares/list-available-dates-for-fare/ok.json`)

        const dates = await listAvailableDatesForFare(originAirport, destinationAirport)

        expect(dates.length).toEqual(3)
        expect(dates[1]).toEqual(new Date('2024-07-23'))
    })

    test('when HTTP request fails, then listAvailableDatesForFare returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listAvailableDatesForFare(originAirport, destinationAirport)
        await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listAvailableDatesForFare(originAirport, destinationAirport)).rejects.toEqual(
            new ApiUnavailable(endpoint)
        )
    })
})

describe('listAvailableFlights', () => {
    const originAirport: Airport = AirportFactory.buildAirport('AAA')
    const destinationAirport: Airport = AirportFactory.buildAirport('BBB')
    const dateOut = new Date('2024-07-29T00:00:00.000')
    const session: Session = [
        {
            cookie1: 'test_val'
        }
    ]
    const oneWayParams: ListAvailableOneWayFlightsParams = {
        adults: 1,
        dateOut,
        origin: originAirport,
        destination: destinationAirport,
        flexDaysBeforeOut: 1,
        flexDaysOut: 1,
        includeConnectingFlights: false,
        roundTrip: false
    }


    test('when one way trip, listAvailableFlights should return a valid FlightSchedule', async () => {
        const endpoint = ApiEndpointBuilder.listAvailableFlights(oneWayParams)
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/fares/list-available-flights/one-way-ok.json`)

        const flightSchedule = await listAvailableFlights(oneWayParams, session)

        expect(flightSchedule.size).toEqual(3)
        expect(flightSchedule.get(dateOut.toISOString()).length).toEqual(0)
        expect(flightSchedule.get(new Date('2024-07-30T00:00:00.000').toISOString()).length).toEqual(1)
        expect(flightSchedule.get(new Date('2024-07-31T00:00:00.000').toISOString()).length).toEqual(2)
    })

    test('when round trip, listAvailableFlights should return 2 FlightSchedules', async () => {
        const dateIn = new Date('2024-08-20T00:00:00.000')
        const roundTripParams: ListAvailableRoundTripFlightsParams = {
            adults: 1,
            dateOut,
            origin: originAirport,
            destination: destinationAirport,
            flexDaysBeforeOut: 1,
            flexDaysOut: 1,
            includeConnectingFlights: false,
            roundTrip: true,
            dateIn,
            flexDaysBeforeIn: 1,
            flexDaysIn: 1
        }
        const endpoint = ApiEndpointBuilder.listAvailableFlights(roundTripParams)
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/fares/list-available-flights/round-trip-ok.json`)

        const flightSchedules = await listAvailableFlights(roundTripParams, session)

        expect(flightSchedules.fromOrigin.size).toEqual(3)
        expect(flightSchedules.fromOrigin.get(new Date('2024-07-30T00:00:00.000').toISOString()).length).toEqual(1)
        expect(flightSchedules.fromDestination.size).toEqual(3)
        expect(flightSchedules.fromDestination.get(new Date('2024-08-20T00:00:00.000').toISOString()).length).toEqual(2)
    })

    test('when HTTP request fails, then listAvailableFlights returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listAvailableFlights(oneWayParams)
        await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listAvailableFlights(oneWayParams, session)).rejects.toEqual(
            new ApiUnavailable(endpoint)
        )
    })

    test('when Session is not provided, then listAvailableFlights returns UninitializedSession', async () => {
        const endpoint = ApiEndpointBuilder.listAvailableFlights(oneWayParams)
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/fares/list-available-flights/missing-session-409.json`, 409)

        return await expect(listAvailableFlights(oneWayParams, session)).rejects.toEqual(
            new UninitializedSession(endpoint)
        )
    })
})