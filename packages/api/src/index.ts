import { travelCompanyIntegrations } from "./integrations/travel-company-integrations";
import { Airport } from "./model/Airport";
import { Flight } from "./model/Flight";
import { TravelCompanyId } from "./model/base-types";

// TODO: declaration file (?) to import only types instead of importing entire api module, unnecessary for
// other modules
export { Airport, Flight, TravelCompanyId }
export { travelCompanyIntegrations }