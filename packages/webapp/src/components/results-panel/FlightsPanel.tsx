import { Flight } from "@findmyflight/api";
import FlightDetails from "./FlightDetails";
import FlightsGroup from "./FlightsGroup";
import { DateUtils } from "@findmyflight/utils";
import { Group } from "@mantine/core";
import FlightsSorter from "./FlightsSorter";

export default function FlightsPanel({ flights }: { flights: Flight[] }) {
    return (
        <>
            <FlightsSorter onSort={() => { }} />

            <FlightsGroup groupDescription="test group">
                {
                    flights.map(f => (
                        <FlightDetails
                            key={`${f.flightNumber}-${f.departureDate}`}
                            flightNumber={f.flightNumber}
                            originAirport={`${f.origin.name} (${f.origin.code})`}
                            departureDateTime={DateUtils.formatFlightDateTime(f.departureDate)}
                            flightDuration={DateUtils.getDurationFromDates(f.departureDate, f.arrivalDate)}
                            travelCompany={f.travelCompany}
                            destinationAirport={`${f.destination.name} (${f.destination.code})`}
                            arrivalDateTime={DateUtils.formatFlightDateTime(f.arrivalDate)}
                            price={f.price} />
                    ))
                }
            </FlightsGroup>
        </>
    )
}