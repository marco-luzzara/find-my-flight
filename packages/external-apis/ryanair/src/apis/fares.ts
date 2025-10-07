import pino from "pino";

import ApiEndpointBuilder from "../ApiEndpointBuilder.js";
import { ApiUnavailableError, GenericUtils, InvalidInputError, UnexpectedStatusCodeError } from "@findmyflight/utils";
import { PassengerType, PriceDetails, Session, FlightSchedule, ListOneWayFlightsParams, ListRoundTripFlightsParams } from "../types.js";
import { UninitializedSessionError } from "../errors.js";


const logger = pino({
    name: 'Ryanair fares API'
})

/**
 * List the dates for the flights from origin to destination. In the returned dates,
 * Ryanair has the schedule ready.
 * @param origin 
 * @param destination 
 * @returns The dates for the scheduled flights
 */
export async function listDatesForFare(originCode: string, destinationCode: string): Promise<Date[]> {
    const endpoint = ApiEndpointBuilder.listDatesForFare(originCode, destinationCode)
    const response = await GenericUtils.fetch([endpoint], logger.debug)

    return await processListDatesForFare(endpoint, response)
}


export async function processListDatesForFare(endpoint: string, response: Response) {
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
 * List the one-way flights (from origin to destination)
 * @param params 
 * @param session The `Session` retrieved after calling `createSession()` 
 */
export async function listOneWayFlights(
    params: ListOneWayFlightsParams,
    session: Session
): Promise<FlightSchedule> {
    validateListFlightsParams(params)

    const endpoint = ApiEndpointBuilder.listFlights(params)
    const headers = createHeaders(session)

    const response = await GenericUtils.fetch([endpoint, { headers }], logger.debug)
    
    return await processListOneWayFlights(endpoint, response, params)
}


export async function processListOneWayFlights(
    endpoint: string, 
    response: Response,
    params: ListOneWayFlightsParams
) {
    switch (response.status) {
        case 200:
            return await processListOneWayFlightsContent(response, params)
        case 409:
            throw new UninitializedSessionError(endpoint)
        case 500:
            throw new ApiUnavailableError(endpoint)
        default:
            throw new UnexpectedStatusCodeError(endpoint, response.status)
    }
}


/**
 * List the round-trip flights (from origin to destination and vice-versa)
 * @param params 
 * @param session The `Session` retrieved after calling `createSession()` 
 */
export async function listRoundTripFlights(
    params: ListRoundTripFlightsParams,
    session: Session
): Promise<{
    fromOrigin: FlightSchedule,
    fromDestination: FlightSchedule
}> {
    validateListFlightsParams(params)

    const endpoint = ApiEndpointBuilder.listFlights(params)
    const headers = createHeaders(session)

    const response = await GenericUtils.fetch([endpoint, { headers }], logger.debug)
    
    return await processListRoundTripFlights(endpoint, response, params)
}


export async function processListRoundTripFlights(
    endpoint: string, 
    response: Response,
    params: ListRoundTripFlightsParams
) {
    switch (response.status) {
        case 200:
            return await processListRoundTripFlightsContent(response, params)
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


async function processListOneWayFlightsContent(
    response: Response,
    params: ListOneWayFlightsParams
): Promise<FlightSchedule> {
    const content = await response.json() as any[]
    const responseTripDates = content['trips'][0]['dates']

    return processTripDates(responseTripDates, params.originCode, params.destinationCode)
}


async function processListRoundTripFlightsContent(
    response: Response,
    params: ListRoundTripFlightsParams
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
function validateListFlightsParams(
    params: ListOneWayFlightsParams | ListRoundTripFlightsParams
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