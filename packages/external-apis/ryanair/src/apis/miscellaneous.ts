import { LogUtils } from "@findmyflight/utils";
import ApiEndpointBuilder from "../ApiEndpointBuilder";
import { ApiUnavailable, UnexpectedStatusCode } from "../errors";
import { Session } from "../model/base-types";
import { Country } from "../model/Country";
import Currency from "../model/Currency";

const logger = LogUtils.getLogger({
    api: 'Ryanair miscellaneous API'
})

export async function listCountries(languageLocale: string = 'en'): Promise<Array<Country>> {
    const endpoint = ApiEndpointBuilder.listCountries(languageLocale)
    const response = await fetch(endpoint)

    switch (response.status) {
        case 200:
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
        case 500:
            throw new ApiUnavailable(endpoint)
        default:
            throw new UnexpectedStatusCode(endpoint, response)
    }
}

export async function listCurrencies(): Promise<Currency[]> {
    const endpoint = ApiEndpointBuilder.listCurrencies()
    const response = await fetch(endpoint)

    switch (response.status) {
        case 200:
            const content: { [k: string]: any } = await response.json()

            return Object.values(content).map(elem => ({
                code: elem.code,
                name: elem.name,
                symbol: elem.symbol
            }));
        case 500:
            throw new ApiUnavailable(endpoint)
        default:
            throw new UnexpectedStatusCode(endpoint, response)
    }
}

export async function createSession(): Promise<Session> {
    const endpoint = ApiEndpointBuilder.createSession()
    const response = await fetch(endpoint)

    switch (response.status) {
        case 200:
            const cookies = response.headers.getSetCookie()
            return cookies
        case 500:
            throw new ApiUnavailable(endpoint)
        default:
            throw new UnexpectedStatusCode(endpoint, response)
    }
}