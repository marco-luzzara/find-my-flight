import { Airport } from "../../../src/ryanair-api/model/Airport";

export class AirportFactory {
    public static buildAirport(code: string): Airport {
        return {
            city: 'CityA',
            code: code,
            coordinates: {
                latitude: 1.0,
                longitude: 1.0
            },
            country: {
                name: 'CountryA0',
                code: 'CountryACode',
                currency: 'CurrencyA',
                defaultAirportCode: code,
                iso3code: 'iso3codeA'
            },
            name: 'AirportA',
            region: 'RegionA',
            timeZone: 'TimeZoneA'
        }
    }
}