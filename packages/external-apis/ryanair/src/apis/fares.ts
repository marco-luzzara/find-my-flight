import ApiEndpointBuilder from "../ApiEndpointBuilder";
import { ApiUnavailable, UnexpectedStatusCode, UninitializedSession, ValidationError } from "../errors";
import { PassengerType, PriceDetails, Session } from "../model/base-types";
import { ListAvailableOneWayFlightsParams, ListAvailableRoundTripFlightsParams } from "../model/ListAvailableFlightParams";
import { FlightSchedule } from "../model/Flight";

import winston from "winston";

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    defaultMeta: {
        api: 'Ryanair fares API'
    }
})

/**
 * List the available dates for the flights from origin to destination. In the returned dates,
 * Ryanair has the schedule ready.
 * @param origin 
 * @param destination 
 * @returns The dates for the scheduled flights
 */
export async function listAvailableDatesForFare(originCode: string, destinationCode: string): Promise<Date[]> {
    const endpoint = ApiEndpointBuilder.listAvailableDatesForFare(originCode, destinationCode)
    const response = await fetch(endpoint)
    switch (response.status) {
        case 200:
            const content: Array<string> = await response.json()
            return content.map(elem => new Date(elem))
        case 500:
            throw new ApiUnavailable(endpoint)
        default:
            throw new UnexpectedStatusCode(endpoint, response)
    }
}


/**
 * List the available one-way flights (from origin to destination)
 * @param params 
 * @param session The `Session` retrieved after calling `createSession()` 
 */
export async function listAvailableOneWayFlights(
    params: ListAvailableOneWayFlightsParams,
    session: Session
): Promise<FlightSchedule> {
    validateListAvailableFlightsParams(params)

    const endpoint = ApiEndpointBuilder.listAvailableFlights(params)
    const headers = new Headers()
    headers.append('Cookie', session.map(cookie => cookie.substring(0, cookie.indexOf(';'))).join('; '))

    const response = await fetch(endpoint, { headers })
    switch (response.status) {
        case 200:
            return processListAvailableOneWayFlightsResponse(response, params)
        case 409:
            throw new UninitializedSession(endpoint)
        case 500:
            throw new ApiUnavailable(endpoint)
        default:
            throw new UnexpectedStatusCode(endpoint, response)
    }
}


async function processListAvailableOneWayFlightsResponse(
    response: Response,
    params: ListAvailableOneWayFlightsParams
): Promise<FlightSchedule> {
    const content: Array<any> = await response.json()
    const responseTripDates = content['trips'][0]['dates']

    return processTripDates(responseTripDates, params.originCode, params.destinationCode)
}


/**
 * List the available round-trip flights (from origin to destination and vice-versa)
 * @param params 
 * @param session The `Session` retrieved after calling `createSession()` 
 */
export async function listAvailableRoundTripFlights(
    params: ListAvailableRoundTripFlightsParams,
    session: Session
): Promise<{
    fromOrigin: FlightSchedule,
    fromDestination: FlightSchedule
}> {
    validateListAvailableFlightsParams(params)

    const endpoint = ApiEndpointBuilder.listAvailableFlights(params)
    const headers = new Headers()
    headers.append('Cookie', session.join('; '))

    const response = await fetch(endpoint, { headers })
    switch (response.status) {
        case 200:
            return processListAvailableRoundTripFlightsResponse(response, params)
        case 409:
            throw new UninitializedSession(endpoint)
        case 500:
            throw new ApiUnavailable(endpoint)
        default:
            throw new UnexpectedStatusCode(endpoint, response)
    }
}


async function processListAvailableRoundTripFlightsResponse(
    response: Response,
    params: ListAvailableRoundTripFlightsParams
): Promise<{
    fromOrigin: FlightSchedule,
    fromDestination: FlightSchedule
}> {
    const content: Array<any> = await response.json()

    const originToDestTrip = content['trips'][0]['origin'] === params.originCode ?
        content['trips'][0] :
        content['trips'][1]

    const destToOriginTrip = content['trips'][0]['origin'] === params.destinationCode ?
        content['trips'][0] :
        content['trips'][1]

    return {
        fromOrigin: processTripDates(originToDestTrip['dates'], params.originCode, params.destinationCode),
        fromDestination: processTripDates(destToOriginTrip['dates'], params.destinationCode, params.originCode)
    }
}


function processTripDates(responseTripDates: [{
    dateOut: string,
    flights: any
}], originCode: string, destinationCode: string): FlightSchedule {
    return new Map(responseTripDates.map(x => [
        x.dateOut,
        x.flights.map(f => ({
            flightNumber: f.flightNumber as string,
            origin: originCode,
            destination: destinationCode,
            departureDate: new Date(f.time[0]),
            arrivalDate: new Date(f.time[1]),
            seatLeft: (f.faresLeft === -1 ? undefined : f.faresLeft) as number,
            infantsLeft: (f.infantsLeft === -1 ? undefined : f.infantsLeft) as number,
            priceDetails: processPrices(f.regularFare.fares),
            duration: convertFlightDurationToMinutes(f.duration as string)
        }))
    ]))
}


function processPrices(fares: any[]): PriceDetails {
    let result: PriceDetails = {}

    for (let fare of fares) {
        result[convertFareTypeToPassengerType(fare.type)] = fare.amount as number
    }

    return result
}


function convertFlightDurationToMinutes(flightDuration: string): number {
    const durationSegments = flightDuration.split(':')
    const hours = parseInt(durationSegments[0])
    const minutes = parseInt(durationSegments[1])

    return hours * 60 + minutes
}


function convertFareTypeToPassengerType(fareType: string): PassengerType {
    switch (fareType) {
        case 'ADT':
            return PassengerType.ADULT
        case 'TEEN':
            return PassengerType.TEENAGER
        case 'CHD':
            return PassengerType.CHILD
        case 'INF':
            return PassengerType.INFANT
        default:
            throw new Error(`Cannot handle passenger type ${fareType}`)
    }
}


// TODO: tests?
function validateListAvailableFlightsParams(
    params: ListAvailableOneWayFlightsParams | ListAvailableRoundTripFlightsParams
) {
    if (params.adults <= 0)
        throw new ValidationError('adults', params.adults, '>= 1')
    if (params.children && params.children < 0)
        throw new ValidationError('children', params.children, '>= 0')
    if (params.teenagers && params.teenagers < 0)
        throw new ValidationError('teenagers', params.teenagers, '>= 0')
    if (params.infants && params.infants < 0)
        throw new ValidationError('infants', params.infants, '>= 0')

    if (params.dateOut <= new Date())
        throw new ValidationError('dateOut', params.dateOut, `> ${new Date().toLocaleDateString()}`)

    if (params.flexDaysBeforeOut < 0 || params.flexDaysBeforeOut > 6)
        throw new ValidationError('flexDaysBeforeOut', params.flexDaysBeforeOut, '[0, 6]')

    if (params.flexDaysOut < 0 || params.flexDaysOut > 6)
        throw new ValidationError('flexDaysOut', params.flexDaysOut, '[0, 6]')

    if (params.flexDaysBeforeOut + params.flexDaysOut > 6)
        throw new ValidationError('flexDaysBeforeOut + flexDaysOut', params.flexDaysBeforeOut + params.flexDaysOut, '[0, 6]')

    if (params.roundTrip) {
        if (params.dateIn <= params.dateOut)
            throw new ValidationError('dateIn', params.dateIn, `> dateOut`)

        if (params.flexDaysBeforeIn < 0 || params.flexDaysBeforeIn > 6)
            throw new ValidationError('flexDaysBeforeIn', params.flexDaysBeforeIn, '[0, 6]')

        if (params.flexDaysIn < 0 || params.flexDaysIn > 6)
            throw new ValidationError('flexDaysIn', params.flexDaysIn, '[0, 6]')

        if (params.flexDaysBeforeIn + params.flexDaysIn > 6)
            throw new ValidationError('flexDaysBeforeIn + flexDaysIn', params.flexDaysBeforeIn + params.flexDaysIn, '[0, 6]')
    }
}