import { Country } from "./Country"

export type Airport = {
    code: string
    name: string
    city: string
    region: string
    country: Country
    timeZone: string
}