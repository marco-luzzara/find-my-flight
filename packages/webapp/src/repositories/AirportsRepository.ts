import configurationManager from "@/ConfigurationManager";
import { Airport } from "@findmyflight/api";

export class AirportRepository {
    public async listAirports(): Promise<Airport[]> {
        return null
        // return await fetch(configurationManager.apiEndpoint + '/airports')
    }
}