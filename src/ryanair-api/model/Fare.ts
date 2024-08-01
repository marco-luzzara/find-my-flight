import { Airport } from "./Airport";
import Currency from "./Currency";

export type ListAvailableFlightsBaseParams = {
    adults: number;
    children?: number;
    teenagers?: number;
    infants?: number;
    dateOut: Date;
    destination: Airport;
    origin: Airport;
    promoCode?: string;
    roundTrip: boolean;
    includeConnectingFlights: boolean;
    /**
     * Number of days to check before the specified departure date 
     * (do you want to depart from origin `FlexDaysBeforeOut` days before?)
     * range = [0, 6] && flexDaysBeforeOut + flexDaysOut <= 6
     */
    flexDaysBeforeOut: number;
    /**
     * Number of days to check after the specified departure date
     * (do you want to depart from origin `FlexDaysOut` days later?) 
     * range = [0, 6] && flexDaysBeforeOut + flexDaysOut <= 6
     */
    flexDaysOut: number;
}

export type ListAvailableOneWayFlightsParams = ListAvailableFlightsBaseParams & {
    roundTrip: false;
}

export type ListAvailableRoundTripFlightsParams = ListAvailableFlightsBaseParams & {
    roundTrip: true;
    dateIn: Date;
    /**
     * Number of days to check before the specified arrival date 
     * (do you want to depart from destination `FlexDaysBeforeIn` days before?)
     * range = [0, 6] && flexDaysBeforeIn + flexDaysIn <= 6
     */
    flexDaysBeforeIn: number;
    /**
     * Number of days to check after the specified arrival date
     * (do you want to depart from destination `FlexDaysIn` days later?) 
     * range = [0, 6] && flexDaysBeforeIn + flexDaysIn <= 6
     */
    flexDaysIn: number;
}