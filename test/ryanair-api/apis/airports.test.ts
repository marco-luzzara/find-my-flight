import { jest } from '@jest/globals';
import ApiEndpointBuilder from "../../../src/ryanair-api/ApiEndpointBuilder.js"
import { listAirports } from "../../../src/ryanair-api/apis/airports.js"
import { ApiUnavailable } from "../../../src/ryanair-api/errors.js"
import { API_SAVED_RESPONSES } from "../test-utils/constants.js"
import { MockUtils } from "../test-utils/mock.js"

jest.mock('axios');

test('listAirports should return list of airports', async () => {
    const endpoint = ApiEndpointBuilder.listAirports('en')
    MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/list-airports/ok.json`)

    const airports = await listAirports('en')

    expect(airports.length).toEqual(3)
    expect(airports[1].code).toEqual('AAR')
})

test('when GET /airports fails, then listAirports returns ApiUnavailable', async () => {
    const endpoint = ApiEndpointBuilder.listAirports('en')
    MockUtils.mockHttpGet(endpoint, '', 500)

    return await expect(listAirports('en')).rejects.toBeInstanceOf(ApiUnavailable)
})