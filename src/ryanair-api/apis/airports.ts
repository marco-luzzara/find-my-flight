import ApiEndpointBuilder from "../ApiEndpointBuilder";
import { ApiUnavailable } from "../errors";
import { Airport } from "../model/Airport";

export async function listAirports(languageLocale: string = 'en'): Promise<Array<Airport>> {
    const endpoint = ApiEndpointBuilder.listAirports(languageLocale)
    try {
        const response = await fetch(endpoint)
        const content: Array<any> = await response.json()

        // TODO: use worker threads to convert json to Airport model (almost 7000 json objects)
        // See example here: https://nodejs.org/api/worker_threads.html
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

export async function listDestinationAirports(originAirport: Airport, languageLocale: string = 'en'): Promise<Array<Airport>> {
    const endpoint = ApiEndpointBuilder.listDestinationAirports(originAirport.code, languageLocale)
    try {
        const response = await fetch(endpoint)
        const content: Array<any> = await response.json()

        return content.map(elem => ({
            code: elem.arrivalAirport.code,
            name: elem.arrivalAirport.name,
            city: elem.arrivalAirport.city,
            region: elem.arrivalAirport.region,
            country: {
                code: elem.arrivalAirport.country.code,
                currency: elem.arrivalAirport.country.currency,
                defaultAirportCode: elem.arrivalAirport.country.defaultAirportCode,
                iso3code: elem.arrivalAirport.country.iso3code,
                name: elem.arrivalAirport.country.name
            },
            coordinates: {
                latitude: elem.arrivalAirport.coordinates.latitude,
                longitude: elem.arrivalAirport.coordinates.longitude
            },
            timeZone: elem.arrivalAirport.timeZone
        }));
    }
    catch (error) {
        throw new ApiUnavailable(endpoint, { error: error })
    }
}