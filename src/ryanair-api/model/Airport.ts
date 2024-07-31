import { Country } from "./Country"

export interface Airport {
    code: string
    name: string
    city: string
    region: string
    country: Country
    timeZone: string
}