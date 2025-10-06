import pino from "pino";

import { LogUtils, ApiUnavailableError, UnexpectedStatusCodeError, GenericUtils } from "@findmyflight/utils";
import ApiEndpointBuilder from "../ApiEndpointBuilder.js";
import { Country, Currency, Session } from "../types.js";

const logger = pino({
    name: 'Ryanair miscellaneous API'
})

export async function listCountries(languageLocale: string = 'en'): Promise<Array<Country>> {
    const endpoint = ApiEndpointBuilder.listCountries(languageLocale)
    const response = await GenericUtils.fetch([endpoint], logger.debug)

    switch (response.status) {
        case 200:
            const content = await response.json() as Country[]
            // TODO: use worker threads to convert json to Country model
            // See example here: https://nodejs.org/api/worker_threads.html
            return content.map(elem => ({
                code: elem.code,
                iso3code: elem.iso3code,
                name: elem.name,
                currency: elem.currency,
                defaultAirportCode: elem.defaultAirportCode
            }));
        case 500:
            throw new ApiUnavailableError(endpoint)
        default:
            throw new UnexpectedStatusCodeError(endpoint, response.status)
    }
}


export async function listCurrencies(): Promise<Currency[]> {
    const endpoint = ApiEndpointBuilder.listCurrencies()
    const response = await GenericUtils.fetch([endpoint], logger.debug)

    switch (response.status) {
        case 200:
            const content = await response.json() as { [k: string]: Currency }

            return Object.values(content).map(elem => ({
                code: elem.code,
                name: elem.name,
                symbol: elem.symbol
            }));
        case 500:
            throw new ApiUnavailableError(endpoint)
        default:
            throw new UnexpectedStatusCodeError(endpoint, response.status)
    }
}


export async function createSession(): Promise<Session> {
    const endpoint = ApiEndpointBuilder.createSession()
    const response = await GenericUtils.fetch([endpoint], logger.debug)

    switch (response.status) {
        case 200:
            const cookies = response.headers.getSetCookie()
            return cookies
        case 500:
            throw new ApiUnavailableError(endpoint)
        default:
            throw new UnexpectedStatusCodeError(endpoint, response.status)
    }
}