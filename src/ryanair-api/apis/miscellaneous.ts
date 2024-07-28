import ApiEndpointBuilder from "../ApiEndpointBuilder";
import { ApiUnavailable } from "../errors";
import { Session } from "../model/base-types";
import { Country } from "../model/Country";
import Currency from "../model/Currency";
import * as cookie from 'cookie'

export async function listCountries(languageLocale: string = 'en'): Promise<Array<Country>> {
    const endpoint = ApiEndpointBuilder.listCountries(languageLocale)
    try {
        const response = await fetch(endpoint)
        const content: Array<Country> = await response.json()

        // TODO: use worker threads to convert json to Country model
        // See example here: https://nodejs.org/api/worker_threads.html
        return content.map(elem => ({
            code: elem.code,
            iso3code: elem.iso3code,
            name: elem.name,
            currency: elem.currency,
            defaultAirportCode: elem.defaultAirportCode
        }));
    }
    catch (error) {
        throw new ApiUnavailable(endpoint, { error: error })
    }
}

export async function listCurrencies(): Promise<Array<Currency>> {
    const endpoint = ApiEndpointBuilder.listCurrencies()
    try {
        const response = await fetch(endpoint)
        const content: Map<string, any> = await response.json()

        return Object.values(content).map(elem => ({
            code: elem.code,
            name: elem.name,
            symbol: elem.symbol
        }));
    }
    catch (error) {
        throw new ApiUnavailable(endpoint, { error: error })
    }
}

export async function createSession(): Promise<Session> {
    const endpoint = ApiEndpointBuilder.createSession()
    try {
        const response = await fetch(endpoint)
        const cookies = response.headers.getSetCookie().map(elem => cookie.parse(elem))

        return cookies
    }
    catch (error) {
        throw new ApiUnavailable(endpoint, { error: error })
    }
}