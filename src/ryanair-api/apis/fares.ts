import ApiEndpointBuilder from "../ApiEndpointBuilder";
import { ApiUnavailable } from "../errors";
import { Airport } from "../model/Airport";
import { ListRoundTripFaresParams } from "../model/Fare";

export async function listAvailableDatesForFare(origin: Airport, destination: Airport): Promise<Array<Date>> {
    const endpoint = ApiEndpointBuilder.listAvailableDatesForFare(origin, destination)
    try {
        const response = await fetch(endpoint)
        const content: Array<string> = await response.json()

        return content.map(elem => new Date(elem));
    }
    catch (error) {
        throw new ApiUnavailable(endpoint, { error: error })
    }
}