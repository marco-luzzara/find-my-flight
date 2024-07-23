import { Airport } from "./model/Airport"
import { ListRoundTripFaresParams } from "./model/Fare"

export default class ApiEndpointBuilder {
    // ******** AIRPORTS ********

    public static listAirports(languageLocale: string): string {
        return `https://www.ryanair.com/api/views/locate/5/airports/${languageLocale}/active`
    }

    public static listDestinationAirports(originAirport: Airport, languageLocale: string): string {
        return `https://www.ryanair.com/api/views/locate/searchWidget/routes/${languageLocale}/airport/${originAirport.code}`
    }

    // ******** MISCELLANEOUS ********

    public static listCountries(languageLocale: string): string {
        return `https://www.ryanair.com/api/views/locate/3/countries/${languageLocale}`
    }

    public static listCurrencies(): string {
        return `https://www.ryanair.com/api/booking/v4/en-ie/res/currencies`
    }

    public static createSession(): string {
        return `https://www.ryanair.com/gb/en/trip/flights/select`
    }

    // ******** FARES ********

    public static listAvailableDatesForFare(originAirport: Airport, destinationAirport: Airport): string {
        return `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${originAirport.code}/${destinationAirport.code}/availabilities`
    }
}