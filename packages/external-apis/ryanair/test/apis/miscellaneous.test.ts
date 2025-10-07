import { ApiUnavailableError } from "@findmyflight/utils"
import { MockUtils } from "@findmyflight/test-utils"

import ApiEndpointBuilder from "../../src/ApiEndpointBuilder.js"
import { processCreateSession, processListCountries, processListCurrencies } from "../../src/apis/miscellaneous.js"
import { API_SAVED_RESPONSES } from "../constants.js"

let fetchMock: jest.Mock = jest.fn()

beforeEach(() => {
    fetchMock.mockClear();
});

describe('listCountries', () => {
    const endpoint = ApiEndpointBuilder.listCountries('en')

    test('listCountries should return list of countries', async () => {
        const response = await MockUtils.mockFetchResponseFromFile(200,
            `${API_SAVED_RESPONSES}/miscellaneous/list-countries/ok.json`)

        const countries = await processListCountries(endpoint, response)

        expect(countries.length).toEqual(3)
        expect(countries[1].name).toEqual('United Kingdom')
    })

    test('when HTTP request fails, then listCountries returns ApiUnavailable', async () => {
        const response = await MockUtils.mockFetchResponse(500)

        return await expect(processListCountries(endpoint, response)).rejects.toEqual(
            new ApiUnavailableError(endpoint)
        )
    })
})

describe('listCurrencies', () => {
    test('listCurrencies should return list of currencies', async () => {
        const endpoint = ApiEndpointBuilder.listCurrencies()
        const response = await MockUtils.mockFetchResponseFromFile(200,
            `${API_SAVED_RESPONSES}/miscellaneous/list-currencies/ok.json`)

        const currencies = await processListCurrencies(endpoint, response)

        expect(currencies.length).toEqual(3)
        expect(currencies[1].name).toEqual('Australian Dollar')
    })

    test('when HTTP request fails, then listCurrencies returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listCurrencies()
        const response = await MockUtils.mockFetchResponse(500)

        return await expect(processListCurrencies(endpoint, response)).rejects.toEqual(
            new ApiUnavailableError(endpoint)
        )
    })
})

describe('createSession', () => {
    const endpoint = ApiEndpointBuilder.createSession()

    test('createSession should return list of session cookies', async () => {
        const response = await MockUtils.mockFetchResponseWithHeader(200,
            `${API_SAVED_RESPONSES}/miscellaneous/create-session/cookies`)

        const cookies = processCreateSession(endpoint, response)

        expect(cookies.length).toEqual(3)
        expect(cookies[0]).toMatch(/fr-correlation-id=fr-correlation-id-cookie;.*/)
        expect(cookies[1]).toMatch(/rid=rid-cookie;.*/)
        expect(cookies[2]).toMatch(/rid.sig=rid.sig-cookie;.*/)
    })

    test('when HTTP request fails, then createSession returns ApiUnavailable', async () => {
        const response = await MockUtils.mockFetchResponse(500)

        return await expect(processCreateSession(endpoint, response)).rejects.toEqual(
            new ApiUnavailableError(endpoint)
        )
    })
})
