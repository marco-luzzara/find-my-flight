import { Airport } from "./Airport";
import { DayOfWeek, Time } from "./base-types";
import Currency from "./Currency";

export interface ListRoundTripFaresParams {
    languageLocale: string;
    priceForAdults: number;
    outboundDepartureDateFrom: Date;
    outboundDepartureDateTo: Date;
    inboundDepartureDateFrom: Date;
    inboundDepartureDateTo: Date;
    outboundDepartureTimeFrom?: Time;
    outboundDepartureTimeTo?: Time;
    inboundDepartureTimeFrom?: Time;
    inboundDepartureTimeTo?: Time;
    durationFrom?: number;
    durationTo?: number;
    outboundDepartureDaysOfWeek?: DayOfWeek;
    priceValueTo?: number;
    currency: Currency;
    departureAirport: Airport;
    arrivalAirport: Airport;
}