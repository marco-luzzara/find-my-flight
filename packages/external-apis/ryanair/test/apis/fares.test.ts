import { ApiUnavailableError } from "@findmyflight/utils"
import { MockUtils } from "@findmyflight/test-utils"

import { processListDatesForFare, processListOneWayFlights, processListRoundTripFlights } from '../../src/apis/fares.js'
import ApiEndpointBuilder from "../../src/ApiEndpointBuilder.js"
import { API_SAVED_RESPONSES } from "../constants.js"
import { UninitializedSessionError } from "../../src/errors.js"
import { ListOneWayFlightsParams, ListRoundTripFlightsParams, Session } from "../../src/types.js"

const originAirportCode = 'AAA'
const destinationAirportCode = 'BBB'

describe('listAvailableDatesForFare', () => {
    const originAirportCode = 'AAA'
    const destinationAirportCode = 'BBB'

    test('listDatesForFare should return list of Dates', async () => {
        const endpoint = ApiEndpointBuilder.listDatesForFare(originAirportCode, destinationAirportCode)
        const response = await MockUtils.mockFetchResponseFromFile(200,
            `${API_SAVED_RESPONSES}/fares/list-available-dates-for-fare/ok.json`)

        const dates = await processListDatesForFare(endpoint, response)

        expect(dates.length).toEqual(3)
        expect(dates[1]).toEqual(new Date('2024-07-23'))
    })

    test('when HTTP request fails, then listDatesForFare returns ApiUnavailableError', async () => {
        const endpoint = ApiEndpointBuilder.listDatesForFare(originAirportCode, destinationAirportCode)
        const response = await MockUtils.mockFetchResponse(500)

        return await expect(processListDatesForFare(endpoint, response)).rejects.toEqual(
            new ApiUnavailableError(endpoint)
        )
    })
})

describe('listFlights', () => {
    let dateOut = new Date()
    dateOut.setDate(dateOut.getDate() + 1)
    const session: Session = [
        "cookie1=test_val"
    ]
    const oneWayParams: ListOneWayFlightsParams = {
        adults: 1,
        dateOut,
        originCode: originAirportCode,
        destinationCode: destinationAirportCode,
        flexDaysBeforeOut: 1,
        flexDaysOut: 1,
        includeConnectingFlights: false,
        roundTrip: false
    }
    const dateIn = new Date()
    dateIn.setDate(dateIn.getDate() + 2)
    const roundTripParams: ListRoundTripFlightsParams = {
        adults: 1,
        dateOut,
        originCode: originAirportCode,
        destinationCode: destinationAirportCode,
        flexDaysBeforeOut: 1,
        flexDaysOut: 1,
        includeConnectingFlights: false,
        roundTrip: true,
        dateIn,
        flexDaysBeforeIn: 1,
        flexDaysIn: 1
    }


    test('when one way trip, listFlights should return a valid FlightSchedule', async () => {
        const endpoint = ApiEndpointBuilder.listFlights(oneWayParams)
        const response = await MockUtils.mockFetchResponseFromFile(200,
            `${API_SAVED_RESPONSES}/fares/list-available-flights/one-way-ok.json`)

        const flightSchedule = await processListOneWayFlights(endpoint, response, oneWayParams)

        expect(flightSchedule.size).toEqual(3)
        expect(flightSchedule.get('2024-07-29T00:00:00.000')!.length).toEqual(0)
        expect(flightSchedule.get('2024-07-30T00:00:00.000')!.length).toEqual(1)
        expect(flightSchedule.get('2024-07-31T00:00:00.000')!.length).toEqual(2)
    })

    test('when one way trip has not any seat available, listFlights should return nothing', async () => {
        const endpoint = ApiEndpointBuilder.listFlights(oneWayParams)
        const response = await MockUtils.mockFetchResponseFromFile(200,
            `${API_SAVED_RESPONSES}/fares/list-available-flights/fare-with-no-left-seat.json`)

        const flightSchedule = await processListOneWayFlights(endpoint, response, oneWayParams)

        expect(flightSchedule.size).toEqual(1)
        expect(flightSchedule.get('2024-11-01T00:00:00.000')!.length).toEqual(0)
    })

    test('when round trip, listFlights should return 2 FlightSchedules', async () => {
        const endpoint = ApiEndpointBuilder.listFlights(roundTripParams)
        const response = await MockUtils.mockFetchResponseFromFile(200,
            `${API_SAVED_RESPONSES}/fares/list-available-flights/round-trip-ok.json`)

        const flightSchedules = await processListRoundTripFlights(endpoint, response, roundTripParams)

        expect(flightSchedules.fromOrigin.size).toEqual(3)
        expect(flightSchedules.fromOrigin.get('2024-07-30T00:00:00.000')!.length).toEqual(1)
        expect(flightSchedules.fromDestination.size).toEqual(3)
        expect(flightSchedules.fromDestination.get('2024-08-20T00:00:00.000')!.length).toEqual(2)
    })

    test('when HTTP request fails, then listFlights returns ApiUnavailableError', async () => {
        const endpoint = ApiEndpointBuilder.listFlights(oneWayParams)
        const response = await MockUtils.mockFetchResponse(500)

        return await expect(processListOneWayFlights(endpoint, response, oneWayParams)).rejects.toEqual(
            new ApiUnavailableError(endpoint)
        )
    })

    test('when Session is not provided, then listFlights returns UninitializedSession', async () => {
        const endpoint = ApiEndpointBuilder.listFlights(oneWayParams)
        const response = await MockUtils.mockFetchResponse(409)

        return await expect(processListOneWayFlights(endpoint, response, oneWayParams)).rejects.toEqual(
            new UninitializedSessionError(endpoint)
        )
    })
})