export type PassengerType = 'adult' | 'teenager' | 'child' | 'infant'

export type PriceDetails = { [key in PassengerType]?: number }

export type Cookie = string
export type Session = Cookie[]