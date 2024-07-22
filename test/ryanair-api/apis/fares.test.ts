import ApiEndpointBuilder from "../../../src/ryanair-api/ApiEndpointBuilder"
import { listAvailableDatesForFare } from "../../../src/ryanair-api/apis/fares"
import { ApiUnavailable } from "../../../src/ryanair-api/errors"
import { Airport } from "../../../src/ryanair-api/model/Airport"
import { AirportFactory } from "../test-factories/AirportFactory"
import { API_SAVED_RESPONSES } from "../test-utils/constants"
import { MockUtils } from "../test-utils/mock"

describe('listAvailableDatesForFare', () => {
    const originAirport: Airport = AirportFactory.buildAirport('AAA')
    const destinationAirport: Airport = AirportFactory.buildAirport('BBB')

    test('listAvailableDatesForFare should return list of Dates', async () => {
        const endpoint = ApiEndpointBuilder.listAvailableDatesForFare(originAirport, destinationAirport)
        await MockUtils.mockHttpGet(endpoint, `${API_SAVED_RESPONSES}/fares/list-available-dates-for-fare/ok.json`)

        const dates = await listAvailableDatesForFare(originAirport, destinationAirport)

        expect(dates.length).toEqual(3)
        expect(dates[1]).toEqual(new Date('2024-07-23'))
    })

    test('when HTTP request fails, then listAvailableDatesForFare returns ApiUnavailable', async () => {
        const endpoint = ApiEndpointBuilder.listAvailableDatesForFare(originAirport, destinationAirport)
        await MockUtils.mockHttpGet(endpoint, '', 500)

        return await expect(listAvailableDatesForFare(originAirport, destinationAirport)).rejects.toEqual(
            new ApiUnavailable(endpoint, { error: new Error(`API failed with 500`) })
        )
    })
})