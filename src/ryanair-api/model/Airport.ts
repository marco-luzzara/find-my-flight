import { Country } from "./Country.js"

export interface Airport {
    code: string
    name: string
    city: string
    region: string
    country: Country
    coordinates: GeoPosition
    timeZone: string
}

interface GeoPosition {
    latitude: number
    longitude: number
}