import { ApiUnavailableError } from "@findmyflight/utils"

import ApiEndpointBuilder from "../../src/ApiEndpointBuilder.ts"
import { processListAirports, processListDestinationAirports } from "../../src/apis/airports.js"
import { API_SAVED_RESPONSES } from "../constants.js"
import { MockUtils } from "@findmyflight/test-utils"


describe('listAirports', () => {
    test('listAirports should return list of airports', async () => {
        const endpoint = ApiEndpointBuilder.listAirports('en')
        const response = await MockUtils.mockFetchResponseFromFile(200, `${API_SAVED_RESPONSES}/airports/list-airports/ok.json`)

        const airports = await processListAirports(endpoint, response)

        expect(airports.length).toEqual(3)
        expect(airports[1].code).toEqual('AAR')
    })

    test('when HTTP request fails, then listAirports returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listAirports('en')
        const response = await MockUtils.mockFetchResponse(500)

        return await expect(processListAirports(endpoint, response)).rejects.toEqual(
            new ApiUnavailableError(endpoint)
        )
    })
})

describe('listDestinationAirports', () => {
    test('listDestinationAirports should return list of airports', async () => {
        const endpoint = ApiEndpointBuilder.listDestinationAirports('AAA', 'en')
        const response = await MockUtils.mockFetchResponseFromFile(200, `${API_SAVED_RESPONSES}/airports/list-destination-airports/ok.json`)

        const airports = await processListDestinationAirports(endpoint, response)

        expect(airports.length).toEqual(3)
        expect(airports[1].code).toEqual('AGA')
    })

    test('when HTTP request fails, then listDestinationAirports returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listDestinationAirports('AAA', 'en')
        const response = await MockUtils.mockFetchResponse(500)

        return await expect(processListDestinationAirports(endpoint, response)).rejects.toEqual(
            new ApiUnavailableError(endpoint)
        )
    })
})
