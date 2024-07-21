import ApiEndpointBuilder from "../../../src/ryanair-api/ApiEndpointBuilder"
import { listAirports } from "../../../src/ryanair-api/apis/airports"
import { ApiUnavailable } from "../../../src/ryanair-api/errors"
import { API_SAVED_RESPONSES } from "../test-utils/constants"
import { MockUtils } from "../test-utils/mock"

describe('listAirports', () => {
    test('listAirports should return list of airports', async () => {
        const endpoint = ApiEndpointBuilder.listAirports('en')
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/list-airports/ok.json`)

        const airports = await listAirports('en')

        expect(airports.length).toEqual(3)
        expect(airports[1].code).toEqual('AAR')
    })

    test('when HTTP request fails, then listAirports returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listAirports('en')
        await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listAirports('en')).rejects.toBeInstanceOf(ApiUnavailable)
    })
})
