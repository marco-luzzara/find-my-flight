import { TravelCompanyIntegration } from "./integrations/TravelCompanyIntegration";

declare module "fastify" {
    interface FastifyInstance {
        travelCompanyIntegrations: TravelCompanyIntegration[];
    }
}