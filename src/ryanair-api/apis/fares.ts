import ApiEndpointBuilder from "../ApiEndpointBuilder";
import { ApiUnavailable, UnexpectedStatusCode, UninitializedSession } from "../errors";
import { Airport } from "../model/Airport";
import { FlightDuration, PassengerType, PriceDetails, Session } from "../model/base-types";
import { ListAvailableOneWayFlightsParams, ListAvailableRoundTripFlightsParams } from "../model/Fare";
import { Flight, FlightSchedule } from "../model/Flight";

export async function listAvailableDatesForFare(origin: Airport, destination: Airport): Promise<Array<Date>> {
    const endpoint = ApiEndpointBuilder.listAvailableDatesForFare(origin, destination)
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

export async function listAvailableFlights(
    params: ListAvailableOneWayFlightsParams,
    session: Session
): Promise<FlightSchedule>;

export async function listAvailableFlights(
    params: ListAvailableRoundTripFlightsParams,
    session: Session
): Promise<{
    fromOrigin: FlightSchedule,
    fromDestination: FlightSchedule
}>;

// TODO: find out why it does not work with conditional types instead of function overloading
// export async function listAvailableFlights<T extends ListAvailableOneWayFlightsParams | ListAvailableRoundTripFlightsParams>(
//     params: T
// ): Promise<T extends ListAvailableOneWayFlightsParams ?
//     FlightSchedule :
//     (T extends ListAvailableRoundTripFlightsParams ? {
//         fromOrigin: FlightSchedule,
//         fromDestination: FlightSchedule
//     } : never)> {}

export async function listAvailableFlights(
    params: ListAvailableOneWayFlightsParams | ListAvailableRoundTripFlightsParams,
    session: Session
): Promise<FlightSchedule | {
    fromOrigin: FlightSchedule,
    fromDestination: FlightSchedule
}> {
    const endpoint = ApiEndpointBuilder.listAvailableFlights(params)
    const headers = new Headers()
    headers.append('Cookie', session.join('; '))

    const response = await fetch(endpoint, { headers })
    switch (response.status) {
        case 200:
            return processListAvailableFlightsResponse(response, params)
        case 409:
            throw new UninitializedSession(endpoint)
        case 500:
            throw new ApiUnavailable(endpoint)
        default:
            throw new UnexpectedStatusCode(endpoint, response)
    }
}

async function processListAvailableFlightsResponse(
    response: Response,
    params: ListAvailableOneWayFlightsParams | ListAvailableRoundTripFlightsParams
): Promise<FlightSchedule | {
    fromOrigin: FlightSchedule,
    fromDestination: FlightSchedule
}> {
    const content: Array<any> = await response.json()

    if (params.roundTrip === false) {
        const responseTripDates = content['trips'][0]['dates']
        return processTripDates(responseTripDates, params.origin, params.destination)
    }
    else {
        const originToDestTrip = content['trips'][0]['origin'] === params.origin.code ?
            content['trips'][0] :
            content['trips'][1]

        const destToOriginTrip = content['trips'][0]['origin'] === params.destination.code ?
            content['trips'][0] :
            content['trips'][1]

        return {
            fromOrigin: processTripDates(originToDestTrip['dates'], params.origin, params.destination),
            fromDestination: processTripDates(destToOriginTrip['dates'], params.destination, params.origin)
        }
    }
}

function processTripDates(responseTripDates: [{
    dateOut: string,
    flights: any
}], origin: Airport, destination: Airport): FlightSchedule {
    return new Map(responseTripDates.map(x => [
        new Date(x.dateOut).toISOString(),
        x.flights.map(f => ({
            flightNumber: f.flightNumber as string,
            origin: origin,
            destination: destination,
            departureDate: new Date(f.time[0]),
            arrivalDate: new Date(f.time[1]),
            seatLeft: (f.faresLeft === -1 ? undefined : f.faresLeft) as number,
            infantsLeft: (f.infantsLeft === -1 ? undefined : f.infantsLeft) as number,
            prices: f.regularFare.fares.map(fare => ({
                passengerType: fare.type as PassengerType,
                price: fare.amount as number
            })) as PriceDetails[],
            duration: new FlightDuration(f.duration as string)
        }))
    ]))
}