import { TravelCompanyIntegration } from "./integrations/TravelCompanyIntegration.js";

declare module "fastify" {
    interface FastifyInstance {
        travelCompanyIntegrations: TravelCompanyIntegration[];
    }
}