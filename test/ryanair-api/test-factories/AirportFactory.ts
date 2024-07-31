import { Airport } from "../../../src/ryanair-api/model/Airport";

export class AirportFactory {
    public static buildAirport(code: string): Airport {
        return {
            city: 'CityA',
            code: code,
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