import { Flight } from "@findmyflight/api";
import FlightDetails from "./FlightDetails";
import FlightsGroup from "./FlightsGroup";
import { DateUtils, ArrayUtils } from "@findmyflight/utils";
import FlightsSorter, { GroupingOption } from "./FlightsSorter";
import travelCompanies from '../../config-files/travel-companies.json'
import { useState } from "react";


type FlightsList = {
    type: 'flights-list'
    content: Flight[]
}
type FlightsGroup = {
    type: 'flights-group'
    description: string
    content: FlightsList | FlightsGroup[]
}


/**
 * Build a data structure that reflects the groupby and sortby operations specified by the
 * groupingOptions and applied on the flights. The data structure can have multiple levels of
 * nesting

// simplest case with no grouping
{
    "type": "flights-list",
    "content": [
        { "flight": 1 },
        { "flight": 2 }
    ]
} |
[
    // one grouping option, where each group contain a flights-list
    {
        "type": "flights-group",
        "description": "Departure: Bergamo",
        "content": {
            "type": "flights-list",
            "content": [
                { "flight": 1 },
                { "flight": 2 }
            ]
        }
    },
    // two grouping options
    {
        "type": "flights-group",
        "description": "Departure: Bergamo",
        "content": [
            {
                "type": "flights-group",
                "description": "Day XXX",
                "content": {
                    "type": "flights-list",
                    "content": [
                        { "flight": 1 },
                        { "flight": 2 }
                    ]
                }
            },
            {
                "type": "flights-group",
                "description": "Day YYY",
                "content": {
                    "type": "flights-list",
                    "content": [
                        { "flight": 1 },
                        { "flight": 2 }
                    ]
                }
            }
        ]
    }
]
 */
function groupAndSortFlights(
    groupingOptions: GroupingOption[], 
    flights: Flight[]
): FlightsList | FlightsGroup[] {
    const groupingOption = groupingOptions.shift()

    if (groupingOption === undefined) {
        return {
            type: 'flights-list',
            content: flights
        }
    }
    
    const groups = ArrayUtils.groupBy(flights, groupingOption.field.groupingData.groupKeyExtractor)

    const result = Array.from(groups.entries())
        .sort(([groupKeyA, _A], [groupKeyB, _B]) => {
            const direction = groupingOption.order === 'Ascending' ? 1 : -1
            // multiply by direction to invert the result in case of descending ordering
            return (
                    typeof(groupKeyA) === 'string' ?
                    groupKeyA.localeCompare(groupKeyB) :
                    groupKeyA - groupKeyB
                ) * direction
        })
        .map(([groupKey, groupFlights]) => ({
            type: 'flights-group',
            description: groupingOption.field.groupingData.groupDescriptor(groupKey),
            content: groupAndSortFlights(groupingOptions, groupFlights)
        } as FlightsGroup))
    
    groupingOptions.unshift(groupingOption)

    return result
}


export default function FlightsPanel({ flights }: { flights: Flight[] }) {
    const [sortedFlights, setSortedFlights] = useState(groupAndSortFlights([], flights))

    return (
        <>
            <FlightsSorter handleSort={(options) => setSortedFlights(groupAndSortFlights(options, flights)) } />
            
            <FlightsGroup groupDescription="No sorting">
                {
                    flights.map(f => (
                        <FlightDetails
                            key={`${f.flightNumber}-${f.departureDate}`}
                            flightNumber={f.flightNumber}
                            originAirport={`${f.origin.name} (${f.origin.code})`}
                            departureDateTime={DateUtils.formatFlightDateTime(f.departureDate)}
                            flightDuration={DateUtils.getDurationFromDates(f.departureDate, f.arrivalDate)}
                            travelCompany={travelCompanies.find(tc => tc.id === f.travelCompany)!.label}
                            destinationAirport={`${f.destination.name} (${f.destination.code})`}
                            arrivalDateTime={DateUtils.formatFlightDateTime(f.arrivalDate)}
                            price={f.price} />
                    ))
                }
            </FlightsGroup>
        </>
    )
}