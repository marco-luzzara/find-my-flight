import { Flight } from "@findmyflight/api";
import FlightDetails from "./FlightDetails";
import FlightsViewer from "./FlightsViewer";
import { DateUtils, ArrayUtils } from "@findmyflight/utils";
import FlightsSorter, { GroupingOption } from "./FlightsSorter";
import travelCompanies from '../../config-files/travel-companies.json'
import { useState } from "react";


export type FlightsList = {
    type: 'flights-list'
    content: Flight[]
}

export type FlightsGroupContainer = {
    type: 'flights-group-container'
    groupByField: string
    content: FlightsGroup[]
}

export type FlightsGroup = {
    type: 'flights-group'
    description: string
    content: FlightsList | FlightsGroupContainer
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
// one grouping option, where each group contain a flights-list
{
    "type": "flights-group-container",
    "groupByField": "Departure Airport"
    "content": [
        {
            "type": "flights-group",
            "description": "Departure: DDD",
            "content": {
                "type": "flights-list",
                "content": [
                    { "flight": 1 },
                    { "flight": 2 }
                ]
            }
        }
    ]
} |
{
    "type": "flights-group-container",
    "groupByField": "Departure Airport"
    "content": [
        {
            "type": "flights-group",
            "description": "Departure: DDD",
            "content": {
                "type": "flights-group-container",
                "groupByField": "Departure Date"
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
                    }
                ]
            }
        }
    ]
}
*/
function groupAndSortFlights(
    groupingOptions: GroupingOption[], 
    flights: Flight[]
): FlightsList | FlightsGroupContainer {
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

    return {
        type: 'flights-group-container',
        groupByField: '',
        content: result
    }
}


export default function FlightsPanel({ flights }: { flights: Flight[] }) {
    const [sortedFlights, setSortedFlights] = useState(groupAndSortFlights([], flights))

    return (
        <>
            <FlightsSorter handleSort={(options) => setSortedFlights(groupAndSortFlights(options, flights)) } />
            
            <FlightsViewer flights={sortedFlights} />
        </>
    )
}