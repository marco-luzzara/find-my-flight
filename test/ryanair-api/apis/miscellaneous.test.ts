import ApiEndpointBuilder from "../../../src/ryanair-api/ApiEndpointBuilder"
import { listCountries } from "../../../src/ryanair-api/apis/miscellaneous"
import { ApiUnavailable } from "../../../src/ryanair-api/errors"
import { API_SAVED_RESPONSES } from "../test-utils/constants"
import { MockUtils } from "../test-utils/mock"

describe('listCountries', () => {
    test('listCountries should return list of countries', async () => {
        const endpoint = ApiEndpointBuilder.listCountries('en')
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/list-countries/ok.json`)

        const countries = await listCountries('en')

        expect(countries.length).toEqual(3)
        expect(countries[1].name).toEqual('United Kingdom')
    })

    test('when HTTP request fails, then listCountries returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listCountries('en')
        await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listCountries('en')).rejects.toBeInstanceOf(ApiUnavailable)
    })
})
