import ApiEndpointBuilder from "../ApiEndpointBuilder";
import { ApiUnavailable } from "../errors";
import { Country } from "../model/Country";

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