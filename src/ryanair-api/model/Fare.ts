import { Airport } from "./Airport";
import { FlightDate } from "./base-types";
import Currency from "./Currency";

export type ListAvailableFlightsBaseParams = {
    fullLocale: string;
    adults: number;
    children?: number;
    teenagers?: number;
    infants?: number;
    dateOut: FlightDate;
    destination: Airport;
    origin: Airport;
    promoCode?: string;
    roundTrip: boolean;
    includeConnectingFlights: boolean;
    /**
     * Number of days to check before the specified departure date 
     * (do you want to depart from origin `FlexDaysBeforeOut` days before?) 
     */
    flexDaysBeforeOut: number;
    /**
     * Number of days to check after the specified departure date
     * (do you want to depart from origin `FlexDaysOut` days later?) 
     */
    flexDaysOut: number;
}

export type ListAvailableOneWayFlightsParams = ListAvailableFlightsBaseParams & {
    roundTrip: false;
}

export type ListAvailableRoundTripFlightsParams = ListAvailableFlightsBaseParams & {
    roundTrip: true;
    dateIn: FlightDate;
    /**
     * Number of days to check before the specified arrival date 
     * (do you want to depart from destination `FlexDaysBeforeIn` days before?) 
     */
    flexDaysBeforeIn: number;
    /**
     * Number of days to check after the specified arrival date
     * (do you want to depart from destination `FlexDaysIn` days later?) 
     */
    flexDaysIn: number;
}