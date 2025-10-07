import { format } from "date-fns"

import { DateUtils } from "@findmyflight/utils"

import { ListOneWayFlightsParams, ListRoundTripFlightsParams } from "./types.js"

export default class ApiEndpointBuilder {
    // ******** AIRPORTS ********

    public static listAirports(languageLocale: string): string {
        return `https://www.ryanair.com/api/views/locate/5/airports/${languageLocale}/active`
    }

    public static listDestinationAirports(originAirportCode: string, languageLocale: string): string {
        return `https://www.ryanair.com/api/views/locate/searchWidget/routes/${languageLocale}/airport/${originAirportCode}`
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

    public static listDatesForFare(originAirportCode: string, destinationAirportCode: string): string {
        return `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${originAirportCode}/${destinationAirportCode}/availabilities`
    }

    public static listFlights(
        params: ListOneWayFlightsParams | ListRoundTripFlightsParams
    ): string {
        const baseParams = {
            'ADT': params.adults,
            'CHD': params.children ?? 0,
            'TEEN': params.teenagers ?? 0,
            'INF': params.infants ?? 0,
            'DateOut': format(params.dateOut, 'yyyy-MM-dd'),
            'Destination': params.destinationCode,
            'Origin': params.originCode,
            'promoCode': params.promoCode ?? '',
            'IncludeConnectingFlights': params.includeConnectingFlights,
            'FlexDaysBeforeOut': params.flexDaysBeforeOut,
            'FlexDaysOut': params.flexDaysOut,
            'RoundTrip': params.roundTrip,
            'ToUs': 'AGREED'
        }
        let roundTripParams = {}
        if (params.roundTrip === true) {
            roundTripParams = {
                'DateIn': DateUtils.formatDateAsISO(params.dateIn),
                'FlexDaysBeforeIn': params.flexDaysBeforeIn,
                'FlexDaysIn': params.flexDaysIn
            }
        }
        const paramsMap = { ...baseParams, ...roundTripParams }
        const urlParams = new URLSearchParams(paramsMap as any).toString()

        return `https://www.ryanair.com/api/booking/v4/en-EN/availability?${urlParams}`
    }
}