export type Country = {
    code: string;
    iso3code: string;
    name: string;
    currency: string;
    defaultAirportCode: string;
}

export type Currency = {
    code: string;
    name: string;
    symbol: string;
}

export type Airport = {
    code: string
    name: string
    city: string
    region: string
    country: Country
    timeZone: string
}

export type PassengerType = 'adult' | 'teenager' | 'child' | 'infant'

export type PriceDetails = { [key in PassengerType]?: number }

export type Cookie = string
export type Session = Cookie[]

export type Flight = {
    flightNumber: string
    originCode: string
    destinationCode: string
    departureDate: Date
    arrivalDate: Date
    seatLeft?: number
    infantsLeft?: number
    priceDetails: PriceDetails
    duration: number
}

/**
 * a map where the key is a stringed date and the value is an array
 * containing all the flights for the corresponding date
 */
export type FlightSchedule = Map<string, Flight[]>

export type ListFlightsBaseParams = {
    /**
     * age >= 16
     */
    adults: number;
    /**
     * 2 <= age <= 11
     */
    children?: number;
    /**
     * 12 <= age <= 15
     */
    teenagers?: number;
    /**
     * age < 2
     */
    infants?: number;
    dateOut: Date;
    destinationCode: string;
    originCode: string;
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

export type ListOneWayFlightsParams = ListFlightsBaseParams & {
    roundTrip: false;
}

export type ListRoundTripFlightsParams = ListFlightsBaseParams & {
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