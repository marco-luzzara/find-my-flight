import ApiEndpointBuilder from "../../../src/ryanair-api/ApiEndpointBuilder"
import { listCountries, listCurrencies } from "../../../src/ryanair-api/apis/miscellaneous"
import { ApiUnavailable } from "../../../src/ryanair-api/errors"
import { API_SAVED_RESPONSES } from "../test-utils/constants"
import { MockUtils } from "../test-utils/mock"

describe('listCountries', () => {
    test('listCountries should return list of countries', async () => {
        const endpoint = ApiEndpointBuilder.listCountries('en')
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/miscellaneous/list-countries/ok.json`)

        const countries = await listCountries('en')

        expect(countries.length).toEqual(3)
        expect(countries[1].name).toEqual('United Kingdom')
    })

    test('when HTTP request fails, then listCountries returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listCountries('en')
        await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listCountries('en')).rejects.toEqual(
            new ApiUnavailable(endpoint, { error: new Error(`API failed with 500`) })
        )
    })
})

describe('listCurrencies', () => {
    test('listCurrencies should return list of countries', async () => {
        const endpoint = ApiEndpointBuilder.listCurrencies()
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/miscellaneous/list-currencies/ok.json`)

        const countries = await listCurrencies()

        expect(countries.length).toEqual(3)
        expect(countries[1].name).toEqual('Australian Dollar')
    })

    test('when HTTP request fails, then listCurrencies returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listCurrencies()
        await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listCurrencies()).rejects.toEqual(
            new ApiUnavailable(endpoint, { error: new Error(`API failed with 500`) })
        )
    })
})

