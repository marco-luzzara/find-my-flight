import ApiEndpointBuilder from "../ApiEndpointBuilder";
import { ApiUnavailable, UnexpectedStatusCode } from "../errors";
import { Airport } from "../model/Airport";

export async function listAirports(languageLocale: string = 'en'): Promise<Airport[]> {
    const endpoint = ApiEndpointBuilder.listAirports(languageLocale)
    const response = await fetch(endpoint)
    switch (response.status) {
        case 200:
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
                timeZone: elem.timeZone
            }));
        case 500:
            throw new ApiUnavailable(endpoint)
        default:
            throw new UnexpectedStatusCode(endpoint, response)
    }
}

export async function listDestinationAirports(originAirport: Airport, languageLocale: string = 'en'): Promise<Airport[]> {
    const endpoint = ApiEndpointBuilder.listDestinationAirports(originAirport, languageLocale)
    const response = await fetch(endpoint)

    switch (response.status) {
        case 200:
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
                timeZone: elem.arrivalAirport.timeZone
            }));
        case 500:
            throw new ApiUnavailable(endpoint)
        default:
            throw new UnexpectedStatusCode(endpoint, response)
    }
}