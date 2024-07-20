import { listAirports } from "./ryanair-api/apis/airports.js";

console.log(await listAirports('en'))