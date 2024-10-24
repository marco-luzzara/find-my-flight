export enum PassengerType {
    ADULT,
    TEENAGER,
    CHILD,
    INFANT
}

export type PriceDetails = { [key in PassengerType]?: number }

export type Cookie = string
export type Session = Cookie[]