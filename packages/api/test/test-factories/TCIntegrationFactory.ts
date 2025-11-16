import { jest } from '@jest/globals';

import { TravelCompanyIntegration } from "../../src/integrations/TravelCompanyIntegration.js"

export class TCIntegrationFactory {
    /**
     * build an test travel company integrations
     * @returns a test instance of TravelCompanyIntegration
     */
    public static buildMock(seed: number, mocks: {
        listAirports?: TravelCompanyIntegration['listAirports'],
        searchOneWayFlights?: TravelCompanyIntegration['searchOneWayFlights'],
    }): TravelCompanyIntegration {
        return {
            id: seed.toString(),
            label: `test-company${seed}`,
            initialize: function () {
                return Promise.resolve(this as TravelCompanyIntegration)
            },
            listAirports: mocks.listAirports ?? jest.fn<TravelCompanyIntegration['listAirports']>(),
            searchOneWayFlights: mocks.searchOneWayFlights ?? jest.fn<TravelCompanyIntegration['searchOneWayFlights']>()
        }
    }
}