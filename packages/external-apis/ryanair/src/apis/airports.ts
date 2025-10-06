import pino from "pino";

import { ApiUnavailableError, GenericUtils, UnexpectedStatusCodeError } from "@findmyflight/utils";

import ApiEndpointBuilder from "../ApiEndpointBuilder.js";
import { Airport } from "../types.js";


const logger = pino({
    name: 'Ryanair airports API'
})

export async function listAirports(languageLocale: string = 'en'): Promise<Airport[]> {
    const endpoint = ApiEndpointBuilder.listAirports(languageLocale)

    const response = await GenericUtils.fetch([endpoint], logger.debug)
    switch (response.status) {
        case 200:
            const content = await response.json() as any[]
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
            throw new ApiUnavailableError(endpoint)
        default:
            throw new UnexpectedStatusCodeError(endpoint, response.status)
    }
}

export async function listDestinationAirports(originAirportCode: string, languageLocale: string = 'en'): Promise<Airport[]> {
    const endpoint = ApiEndpointBuilder.listDestinationAirports(originAirportCode, languageLocale)

    const response = await GenericUtils.fetch([endpoint], logger.debug)

    switch (response.status) {
        case 200:
            const content = await response.json() as any[]

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
            throw new ApiUnavailableError(endpoint)
        default:
            throw new UnexpectedStatusCodeError(endpoint, response.status)
    }
}