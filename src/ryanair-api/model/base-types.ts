export type PassengerType = 'ADT' | 'TEEN' | 'CHD' | 'INF'

export type PriceDetails = {
    passengerType: PassengerType
    price: number
}

export enum ComparisonResult {
    GREATER,
    EQUAL,
    SMALLER
}

export class FlightDuration {
    hours: number
    minutes: number

    constructor(duration: string) {
        const durationSegments = duration.split(':')
        this.hours = parseInt(durationSegments[0])
        this.minutes = parseInt(durationSegments[1])
    }

    public compare(other: FlightDuration): ComparisonResult {
        if (this.hours > other.hours || (this.hours === other.hours && this.minutes > other.minutes))
            return ComparisonResult.GREATER
        else if (this.hours < other.hours || (this.hours === other.hours && this.minutes < other.minutes))
            return ComparisonResult.SMALLER
        else
            return ComparisonResult.EQUAL
    }
}

export type Cookie = Record<string, string>
export type Session = Cookie[]