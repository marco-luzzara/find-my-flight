import pino from "pino";

import ApiEndpointBuilder from "../ApiEndpointBuilder.js";
import { ApiUnavailableError, GenericUtils, InvalidInputError, UnexpectedStatusCodeError } from "@findmyflight/utils";
import { PassengerType, PriceDetails, Session, FlightSchedule, ListAvailableOneWayFlightsParams, ListAvailableRoundTripFlightsParams } from "../types.js";
import { UninitializedSessionError } from "../errors.js";


const logger = pino({
    name: 'Ryanair fares API'
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
    const response = await GenericUtils.fetch([endpoint], logger.debug)

    switch (response.status) {
        case 200:
            const content = await response.json() as string[]
            return content.map(elem => new Date(elem))
        case 500:
            throw new ApiUnavailableError(endpoint)
        default:
            throw new UnexpectedStatusCodeError(endpoint, response.status)
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
    const headers = createHeaders(session)

    const response = await GenericUtils.fetch([endpoint, { headers }], logger.debug)
    switch (response.status) {
        case 200:
            return processListAvailableOneWayFlightsResponse(response, params)
        case 409:
            throw new UninitializedSessionError(endpoint)
        case 500:
            throw new ApiUnavailableError(endpoint)
        default:
            throw new UnexpectedStatusCodeError(endpoint, response.status)
    }
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
    const headers = createHeaders(session)

    const response = await GenericUtils.fetch([endpoint, { headers }], logger.debug)
    switch (response.status) {
        case 200:
            return processListAvailableRoundTripFlightsResponse(response, params)
        case 409:
            throw new UninitializedSessionError(endpoint)
        case 500:
            throw new ApiUnavailableError(endpoint)
        default:
            throw new UnexpectedStatusCodeError(endpoint, response.status)
    }
}


function createHeaders(session: Session): Headers {
    const headers = new Headers()
    headers.append('client', 'desktop')
    headers.append('Cookie',
        session.map(cookie => cookie.substring(0, cookie.indexOf(';'))).join('; '))

    return headers
}


async function processListAvailableOneWayFlightsResponse(
    response: Response,
    params: ListAvailableOneWayFlightsParams
): Promise<FlightSchedule> {
    const content = await response.json() as any[]
    const responseTripDates = content['trips'][0]['dates']

    return processTripDates(responseTripDates, params.originCode, params.destinationCode)
}


async function processListAvailableRoundTripFlightsResponse(
    response: Response,
    params: ListAvailableRoundTripFlightsParams
): Promise<{
    fromOrigin: FlightSchedule,
    fromDestination: FlightSchedule
}> {
    const content = await response.json() as any[]

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
        x.flights.filter(f => f.faresLeft != 0).map(f => ({
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
            return 'adult'
        case 'TEEN':
            return 'teenager'
        case 'CHD':
            return 'child'
        case 'INF':
            return 'infant'
        default:
            throw new Error(`Cannot handle passenger type ${fareType}`)
    }
}


// TODO: tests?
function validateListAvailableFlightsParams(
    params: ListAvailableOneWayFlightsParams | ListAvailableRoundTripFlightsParams
) {
    if (params.adults <= 0)
        throw new InvalidInputError('adults >= 1', params.adults)
    if (params.children && params.children < 0)
        throw new InvalidInputError('children >= 0', params.children)
    if (params.teenagers && params.teenagers < 0)
        throw new InvalidInputError('teenagers >= 0', params.teenagers)
    if (params.infants && params.infants < 0)
        throw new InvalidInputError('infants >= 0', params.infants)

    if (params.dateOut <= new Date())
        throw new InvalidInputError(`dateOut > ${new Date().toLocaleDateString()}`, params.dateOut)

    if (params.flexDaysBeforeOut < 0 || params.flexDaysBeforeOut > 6)
        throw new InvalidInputError('0 <= flexDaysBeforeOut <= 6', params.flexDaysBeforeOut)

    if (params.flexDaysOut < 0 || params.flexDaysOut > 6)
        throw new InvalidInputError('0 <= flexDaysOut <= 6', params.flexDaysOut)

    if (params.flexDaysBeforeOut + params.flexDaysOut > 6)
        throw new InvalidInputError('0 <= flexDaysBeforeOut + flexDaysOut <= 6', params.flexDaysBeforeOut + params.flexDaysOut)

    if (params.roundTrip) {
        if (params.dateIn < params.dateOut)
            throw new InvalidInputError('dateOut <= dateIn', `DateOut(${params.dateOut}) > DateIn(${params.dateIn})`)

        if (params.flexDaysBeforeIn < 0 || params.flexDaysBeforeIn > 6)
            throw new InvalidInputError('0 <= flexDaysBeforeIn <= 6', params.flexDaysBeforeIn)

        if (params.flexDaysIn < 0 || params.flexDaysIn > 6)
            throw new InvalidInputError('0 <= flexDaysIn <= 6', params.flexDaysIn)

        if (params.flexDaysBeforeIn + params.flexDaysIn > 6)
            throw new InvalidInputError('0 <= flexDaysBeforeIn + flexDaysIn <= 6', params.flexDaysBeforeIn + params.flexDaysIn)
    }
}