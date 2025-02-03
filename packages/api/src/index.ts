import { Airport } from "./model/Airport";
import { Flight } from "./model/Flight";
import { TravelCompanyId } from "./model/base-types";

// TODO: declaration file (?) to import only types instead of importing entire api module, unnecessary for
// other modules

// const travelCompanies = Array.from(travelCompanyIntegrations.entries()).map(e => ({
//     id: e[0],
//     label: e[1].label
// }))
export { Airport, Flight, TravelCompanyId }
// export { travelCompanies }