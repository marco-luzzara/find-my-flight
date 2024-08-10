import { Airport } from "./Airport"

export type Flight = {
    flightNumber: string
    origin: Airport
    destination: Airport
    departureDate: Date
    arrivalDate: Date
    price: number
}