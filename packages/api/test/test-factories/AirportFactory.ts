import { Airport } from "../../src/model/Airport.js"

export class AirportFactory {
    /**
     * build an test airport using a seed letter
     * @param seed a letter used to generate the airport data
     * @returns an Airport
     */
    public static build(seed: string): Airport {
        if (seed.length != 1)
            throw new Error('seed must be a single letter')

        const airportCode = seed.repeat(3)
        return {
            code: airportCode,
            name: 'Airport' + seed
        }
    }
}