import ApiEndpointBuilder from "../../src/ApiEndpointBuilder"
import { listAirports, listDestinationAirports } from "../../src/apis/airports"
import { ApiUnavailable } from "../../src/errors"
import { Airport } from "../../src/model/Airport"
import { AirportFactory } from "../test-factories/AirportFactory"
import { API_SAVED_RESPONSES } from "../test-utils/constants"
import { MockUtils } from "../test-utils/mock"

describe('listAirports', () => {
    test('listAirports should return list of airports', async () => {
        const endpoint = ApiEndpointBuilder.listAirports('en')
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/airports/list-airports/ok.json`)

        const airports = await listAirports('en')

        expect(airports.length).toEqual(3)
        expect(airports[1].code).toEqual('AAR')
    })

    test('when HTTP request fails, then listAirports returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listAirports('en')
        await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listAirports('en')).rejects.toEqual(
            new ApiUnavailable(endpoint)
        )
    })
})

describe('listDestinationAirports', () => {
    const originAirport: Airport = AirportFactory.build('A')

    test('listDestinationAirports should return list of airports', async () => {
        const endpoint = ApiEndpointBuilder.listDestinationAirports(originAirport, 'en')
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/airports/list-destination-airports/ok.json`)

        const airports = await listDestinationAirports(originAirport, 'en')

        expect(airports.length).toEqual(3)
        expect(airports[1].code).toEqual('AGA')
    })

    test('when HTTP request fails, then listDestinationAirports returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listDestinationAirports(originAirport, 'en')
        await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listDestinationAirports(originAirport, 'en')).rejects.toEqual(
            new ApiUnavailable(endpoint)
        )
    })
})
