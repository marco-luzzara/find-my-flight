import ApiEndpointBuilder from "../ApiEndpointBuilder.js";
import { ApiUnavailable } from "../errors.js";
import { Airport } from "../model/Airport.js";
import axios, { AxiosResponse } from "axios";

export async function listAirports(languageLocale: string = 'en'): Promise<Array<Airport>> {
    const endpoint = ApiEndpointBuilder.listAirports(languageLocale)
    try {
        const response: AxiosResponse<Array<Airport>> = await axios.get(endpoint)
        // TODO: use worker threads to convert json to Airport model (almost 7000 json objects)
        // See example here: https://nodejs.org/api/worker_threads.html
        const content = response.data
        return content.map(elem => ({
            code: elem.code,
            name: elem.name,
            city: elem.city,
            region: elem.region,
            country: {
                code: elem.country.code,
                currency: elem.country.currency,
                defaultAirportCode: elem.country.defaultAirportCode,
                iso3code: elem.country.iso3code,
                name: elem.country.name
            },
            coordinates: {
                latitude: elem.coordinates.latitude,
                longitude: elem.coordinates.longitude
            },
            timeZone: elem.timeZone
        }));
    }
    catch (error) {
        throw new ApiUnavailable(endpoint, { error: error })
    }
}