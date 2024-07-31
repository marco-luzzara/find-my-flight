export class FlightDate extends Date {
    toCustomStringDate(): string {
        const year = this.getFullYear()
        const month = (this.getMonth() + 1).toString().padStart(2, '0')
        const day = this.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`;
    }
}

export type PassengerType = 'ADT' | 'TEEN' | 'CHD' | 'INF'

export type PriceDetails = {
    passengerType: PassengerType
    price: number
}

export class FlightDuration {
    hours: number
    minutes: number

    constructor(duration: string) {
        const durationSegments = duration.split(':')
        this.hours = parseInt(durationSegments[0])
        this.minutes = parseInt(durationSegments[1])
    }
}

export enum DayOfWeek {
    Monday = "MONDAY",
    Tuesday = "TUESDAY",
    Wednesday = "WEDNESDAY",
    Thursday = "THURSDAY",
    Friday = "FRIDAY",
    Saturday = "SATURDAY",
    Sunday = "SUNDAY"
}

export type Cookie = Record<string, string>
export type Session = Cookie[]