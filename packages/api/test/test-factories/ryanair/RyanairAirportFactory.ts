import { Airport } from "@findmyflight/external-api-ryanair";

export class RyanairAirportFactory {
    /**
     * build an test airport using a seed letter
     * @param seed a letter used to generate the airport data
     * @returns an Airport
     */
    public static build(seed: string): Airport {
        if (seed.length > 1)
            throw new Error('seed must be a single letter')

        const airportCode = seed.repeat(3)
        return {
            city: 'City' + seed,
            code: airportCode,
            country: {
                name: 'Country' + seed,
                code: `Country${seed}Code`,
                currency: 'Currency' + seed,
                defaultAirportCode: airportCode,
                iso3code: 'iso3code' + seed
            },
            name: 'Airport' + seed,
            region: 'Region' + seed,
            timeZone: 'TimeZone' + seed
        }
    }
}