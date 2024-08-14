import ApiEndpointBuilder from "../../../../src/external-apis/ryanair-api/ApiEndpointBuilder"
import { createSession, listCountries, listCurrencies } from "../../../../src/external-apis/ryanair-api/apis/miscellaneous"
import { ApiUnavailable, UnexpectedStatusCode } from "../../../../src/external-apis/ryanair-api/errors"
import { API_SAVED_RESPONSES } from "../test-utils/constants"
import { MockUtils } from "../test-utils/mock"
import * as fs from 'node:fs'

let fetchMock: jest.Mock = jest.fn()

beforeEach(() => {
    fetchMock.mockClear();
});

describe('listCountries', () => {
    const endpoint = ApiEndpointBuilder.listCountries('en')

    test('listCountries should return list of countries', async () => {
        fetchMock = await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/miscellaneous/list-countries/ok.json`)

        const countries = await listCountries('en')

        expect(countries.length).toEqual(3)
        expect(countries[1].name).toEqual('United Kingdom')
    })

    test('when HTTP request fails, then listCountries returns ApiUnavailable', async () => {
        fetchMock = await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listCountries('en')).rejects.toEqual(
            new ApiUnavailable(endpoint)
        )
    })
})

describe('listCurrencies', () => {
    test('listCurrencies should return list of currencies', async () => {
        const endpoint = ApiEndpointBuilder.listCurrencies()
        fetchMock = await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/miscellaneous/list-currencies/ok.json`)

        const currencies = await listCurrencies()

        expect(currencies.length).toEqual(3)
        expect(currencies[1].name).toEqual('Australian Dollar')
    })

    test('when HTTP request fails, then listCurrencies returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listCurrencies()
        fetchMock = await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listCurrencies()).rejects.toEqual(
            new ApiUnavailable(endpoint)
        )
    })
})

describe('createSession', () => {
    const endpoint = ApiEndpointBuilder.createSession()

    test('createSession should return list of session cookies', async () => {
        global.fetch = fetchMock
        fetchMock.mockImplementationOnce(url => {
            if (url !== endpoint)
                return Promise.reject(`Mocked \`fetch\` expects an endpoint (${endpoint}) that has not been called`)

            return Promise.resolve({
                status: 200,
                headers: {
                    getSetCookie: () =>
                        fs.readFileSync(`${API_SAVED_RESPONSES}/miscellaneous/create-session/cookies`)
                            .toString().split('\n')
                }
            } as Response)
        })

        const cookies = await createSession()

        expect(cookies.length).toEqual(3)
        expect(cookies[0]['fr-correlation-id']).toEqual('fr-correlation-id-cookie')
        expect(cookies[1]['rid']).toEqual('rid-cookie')
        expect(cookies[2]['rid.sig']).toEqual('rid.sig-cookie')
    })

    test('when HTTP request fails, then createSession returns ApiUnavailable', async () => {
        fetchMock = await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(createSession()).rejects.toEqual(
            new ApiUnavailable(endpoint)
        )
    })
})
