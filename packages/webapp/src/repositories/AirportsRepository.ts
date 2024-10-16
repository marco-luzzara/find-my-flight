import configurationManager from "@/ConfigurationManager";
import { Airport } from "@findmyflight/api";

export class AirportRepository {
    public async listAirports(): Promise<Airport[]> {
        const response = await fetch(configurationManager.apiEndpoint + '/airports')
        return await response.json() as Airport[]
    }
}