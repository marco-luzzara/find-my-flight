export enum PassengerType {
    ADULT,
    TEENAGER,
    CHILD,
    INFANT
}

export type PriceDetails = { [key in PassengerType]?: number }

export type Cookie = Record<string, string>
export type Session = Cookie[]